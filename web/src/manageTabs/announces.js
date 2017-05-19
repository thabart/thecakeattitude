import React, {Component} from "react";
import {Alert} from 'reactstrap';
import {AnnouncementsService, SessionService} from '../services/index';
import moment from 'moment';
import AppDispatcher from "../appDispatcher";

class ManageAnnounces extends Component {
  constructor(props) {
    super(props);
    this.removeAnnounce = this.removeAnnounce.bind(this);
    this.closeError = this.closeError.bind(this);
    this.closeSuccess = this.closeSuccess.bind(this);
    this.state = {
      isLoading: false,
      announces: [],
      errorMessage: null,
      successMessage: null
    };
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
    AnnouncementsService.remove(id).then(function() {
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
    AnnouncementsService.searchMineAnnouncements({ start_index: 0, count: 10 })
      .then(function(result) {
        var announces = result['_embedded'];
        if (!(announces instanceof Array)) {
          announces = [announces];
        }

        self.setState({
          isLoading: false,
          announces : announces
        });
      }).catch(function() {
        self.setState({
          isLoading: false
        });
      });
  }
  render() {
    if (this.state.isLoading) {
      return (<div><i className="fa fa-spinner fa-spin"></i></div>);
    }

    var rows = [],
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
    </div>);
  }
  componentDidMount() {
    var self = this;
    AppDispatcher.register(function (payload) {
        switch (payload.actionName) {
            case 'remove-announce':
              self.refresh();
              break;
        }
    });
    this.refresh();
  }
}

export default ManageAnnounces;
