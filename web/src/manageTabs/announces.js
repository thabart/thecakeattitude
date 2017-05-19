import React, {Component} from "react";
import {Alert} from 'reactstrap';
import {AnnouncementsService} from '../services/index';
import moment from 'moment';
import $ from 'jquery';
import AppDispatcher from "../appDispatcher";
import {Guid} from '../utils';

class ManageAnnounces extends Component {
  constructor(props) {
    super(props);
    this._request = {count: 1, start_index: 0};
    this._common_id = null;
    this.removeAnnounce = this.removeAnnounce.bind(this);
    this.closeError = this.closeError.bind(this);
    this.closeSuccess = this.closeSuccess.bind(this);
    this.navigate = this.navigate.bind(this);
    this.state = {
      isLoading: false,
      announces: [],
      navigation: [],
      errorMessage: null,
      successMessage: null
    };
  }
  navigate(e, name) {
    e.preventDefault();
    var startIndex = name - 1;
    this._request = $.extend({}, this._request, {
        start_index: startIndex
    });
    this.refresh();
  }
  closeError() {
    this.setState({
      errorMessage: null
    });
  }
  closeSuccess() {
    this.setState({
      successMessage: null
    });
  }
  removeAnnounce(id) {
    var self = this;
    self.setState({
      isLoading: true
    });
    this._common_id = Guid.generate();
    AnnouncementsService.remove(id, this._common_id).then(function(r) {
      self.setState({
        isLoading: false,
        successMessage: 'The announce has been removed'
      });
    })
    .catch(function() {
      self.setState({
        errorMessage: 'An error occured while trying to remove the announce',
        isLoading: false
      });
    });
  }
  refresh() {
    var self = this;
    self.setState({
      isLoading: true
    });
    AnnouncementsService.searchMineAnnouncements(self._request)
      .then(function(result) {
        var announces = result['_embedded'],
            navigation = result['_links']['navigation'];
        if (!(announces instanceof Array)) {
          announces = [announces];
        }

        if (!(navigation instanceof Array)) {
            navigation = [navigation];
        }

        self.setState({
          isLoading: false,
          announces : announces,
          navigation: navigation
        });
      }).catch(function() {
        self.setState({
          isLoading: false,
          announces : [],
          navigation: []
        });
      });
  }
  render() {
    if (this.state.isLoading) {
      return (<div><i className="fa fa-spinner fa-spin"></i></div>);
    }

    var rows = [],
      navigations = [],
      self = this;
    if (this.state.announces && this.state.announces.length > 0) {
      this.state.announces.forEach(function(announce) {
        rows.push((<tr>
          <td>{announce.id}</td>
          <td>{announce.name}</td>
          <td>{announce.price}</td>
          <td>{moment(announce.create_datetime).format('LLL')}</td>
          <td>
            <button className="btn btn-outline-secondary btn-sm" onClick={(e) => { self.removeAnnounce(announce.id); }}><i className="fa fa-trash"></i></button>
          </td>
        </tr>));
      });
    }

    if (this.state.navigation && this.state.navigation.length > 1) {
      this.state.navigation.forEach(function (nav) {
        navigations.push((
          <li className="page-item"><a href="#" className="page-link" onClick={(e) => {
            self.navigate(e, nav.name);
          }}>{nav.name}</a></li>
        ));
      });
    }

    return (<div className="container manage-container">
      <h1>Manage announces</h1>
      <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert>
      <Alert color="success" isOpen={this.state.successMessage !== null} toggle={this.closeSuccess}>{this.state.successMessage}</Alert>
      {rows.length === 0 && (<Alert color="warning">No announces</Alert>) || (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Creation datetime</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      )}
      {navigations.length > 0 && (
        <ul className="pagination">
          {navigations}
        </ul>
      )}
    </div>);
  }
  componentDidMount() {
    var self = this;
    AppDispatcher.register(function (payload) {
        switch (payload.actionName) {
            case 'remove-announce':
              if (payload.data && payload.data.common_id === self._common_id) {
                self.refresh();
              }

              break;
        }
    });
    this.refresh();
  }
}

export default ManageAnnounces;
