import React, {Component} from "react";
import { Alert } from 'reactstrap';
import { NavLink } from "react-router-dom";
import { ClientService } from '../services/index';
import { Guid } from '../utils';
import { translate } from 'react-i18next';
import { ApplicationStore } from '../stores/index';
import moment from 'moment';
import AppDispatcher from "../appDispatcher";
import Constants from '../../Constants';
import $ from 'jquery';

class ManageServices extends Component {
  constructor(props) {
    super(props);
    this._waitForToken = null;
    this._request = {count: 10, start_index: 0};
    this._common_id = null;
    this.remove = this.remove.bind(this);
    this.navigate = this.navigate.bind(this);
    this.state = {
      isLoading: false,
      clientServices: [],
      navigation: [],
      errorMessage: null,
      successMessage: null
    };
  }

  navigate(e, name) { // Navigate through the client services.
    e.preventDefault();
    var startIndex = name - 1;
    this._request = $.extend({}, this._request, {
        start_index: startIndex
    });
    this.refresh();
  }

  remove(id) { // remove client service.
    var self = this;
    self.setState({
      isLoading: true
    });
    const {t} = this.props;
    this._common_id = Guid.generate();
    ClientService.remove(id, this._common_id).catch(function() {
      ApplicationStore.sendMessage({
        message: t('errorRemoveClientService'),
        level: 'error',
        position: 'tr'
      });
      self.setState({
        isLoading: false
      });
    });
  }

  refresh() { // Refresh client services.
    var self = this;
    self.setState({
      isLoading: true
    });
    ClientService.searchMineAnnouncements(self._request)
      .then(function(result) {
        var clientServices = result['_embedded'],
            navigation = result['_links']['navigation'];
        if (!(clientServices instanceof Array)) {
          clientServices = [clientServices];
        }

        if (!(navigation instanceof Array)) {
            navigation = [navigation];
        }

        self.setState({
          isLoading: false,
          clientServices : clientServices,
          navigation: navigation
        });
      }).catch(function() {
        self.setState({
          isLoading: false,
          clientServices : [],
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
    const {t} = this.props;
    if (this.state.clientServices && this.state.clientServices.length > 0) {
      this.state.clientServices.forEach(function(clientService) {
        rows.push((<tr>
          <td>{clientService.name}</td>
          <td>{clientService.price}</td>
          <td>{moment(clientService.create_datetime).format('LLL')}</td>
          <td>
            <a href="#" className="btn-light red" style={{textDecoration: 'none !important', marginRight: "5px"}} onClick={(e) => { self.remove(clientService.id); }}>
              <i className="fa fa-trash"></i> {t('delete')}
            </a>
            <NavLink to={'/clientservices/' + clientService.id} className="btn-light green" style={{textDecoration: 'none !important', marginRight: "5px"}}>
              <i className="fa fa-external-link"></i> {t('view')}
            </NavLink>
            <NavLink to={'/clientservices/' + clientService.id + '/edit'} className="btn-light gray" style={{textDecoration: 'none !important'}}>
              <i className="fa fa-pencil"></i> {t('edit')}
            </NavLink>
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

    return (<div className="container">
      <div className="section">
        {rows.length === 0 && (<span><i>{t('noClientService')}</i></span>) || (
          <table className="table">
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('price')}</th>
                <th>{t('creationDate')}</th>
                <th></th>
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
      </div>
    </div>);
  }

  componentDidMount() { // Execute before the render.
    var self = this;
    const {t} = this.props;
    self._waitForToken = AppDispatcher.register(function (payload) {
        switch (payload.actionName) {
            case Constants.events.REMOVE_CLIENT_SERVICE_ARRIVED:
              if (payload.data && payload.data.common_id === self._common_id) {
                ApplicationStore.sendMessage({
                  message: t('successRemoveClientService'),
                  level: 'success',
                  position: 'bl'
                });
                self.refresh();
              }

              break;
        }
    });
    this.refresh();
  }

  componentWillUnmount() { // Remove listener.
      AppDispatcher.unregister(this._waitForToken);
  }
}

export default translate('common', { wait: process && !process.release })(ManageServices);
