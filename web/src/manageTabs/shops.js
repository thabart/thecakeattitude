import React, { Component } from "react";
import { ShopsService } from '../services/index';
import { Alert } from 'reactstrap';
import { NavLink } from "react-router-dom";
import { Guid } from '../utils';
import { translate } from 'react-i18next';
import { ApplicationStore } from '../stores/index';
import moment from 'moment';
import AppDispatcher from "../appDispatcher";
import Constants from '../../Constants';
import $ from 'jquery';

class ManageShops extends Component {
  constructor(props) {
    super(props);
    this._request = {count: 10, start_index: 0};
    this._common_id = null;
    this._waitForToken = null;
    this.refresh = this.refresh.bind(this);
    this.removeShop = this.removeShop.bind(this);
    this.navigate = this.navigate.bind(this);
    this.state = {
      isLoading: false,
      shops: [],
      navigation: [],
      errorMessage: null
    };
  }

  navigate(e, name) { // Navigate through the table
    e.preventDefault();
    var startIndex = name - 1;
    this._request = $.extend({}, this._request, {
        start_index: startIndex
    });
    this.refresh();
  }

  removeShop(id) { // Remove the shop.
    var self = this;
    self.setState({
      isLoading: true
    });
    const {t} = this.props;
    this._common_id = Guid.generate();
    ShopsService.remove(id, this._common_id).catch(function() {
      ApplicationStore.sendMessage({
        message: t('errorRemoveShop'),
        level: 'error',
        position: 'tr'
      });
      self.setState({
        isLoading: false
      });
    });
  }

  refresh() { // Refresh the table.
    var self = this;
    self.setState({
      isLoading: true
    });
    ShopsService.searchMineShops(self._request).then(function(result) {
      var shops = result['_embedded'],
          navigation = result['_links']['navigation'];
      if (!(shops instanceof Array)) {
        shops = [shops];
      }

      if (!(navigation instanceof Array)) {
          navigation = [navigation];
      }

      self.setState({
        isLoading: false,
        shops: shops,
        navigation: navigation
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        shops: [],
        navigation: []
      });
    });
  }

  render() { // Render the view.
    if (this.state.isLoading) {
      return (<div><i className="fa fa-spinner fa-spin"></i></div>);
    }

    const {t} = this.props;
    var rows = [],
      navigations = [],
      self = this;
    if (this.state.shops && this.state.shops.length > 0) {
      this.state.shops.forEach(function(shop) {
        rows.push((<tr>
          <td>{shop.name}</td>
          <td>{shop.category.name}</td>
          <td>{moment(shop.create_datetime).format('LLL')}</td>
          <td>
            <a href="#" className="btn-light red" style={{textDecoration: 'none !important', marginRight: "5px"}} onClick={(e) => { self.removeShop(shop.id); }}>
              <i className="fa fa-trash"></i> {t('delete')}
            </a>
            <NavLink to={'/shops/' + shop.id + '/view/profile'} className="btn-light green" style={{textDecoration: 'none !important', marginRight: "5px"}}>
              <i className="fa fa-external-link"></i> {t('view')}
            </NavLink>
            <NavLink to={'/shops/' + shop.id + '/edit/profile'} className="btn-light gray" style={{textDecoration: 'none !important'}}>
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
        {rows.length === 0 && (<span><i>{t('noShops')}</i></span>) || (
          <table className="table">
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('category')}</th>
                <th>{t('creationDate')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table> )}
        {navigations.length > 0 && (
          <ul className="pagination">
            {navigations}
          </ul>
        )}
      </div>
    </div>);
  }

  componentDidMount() { // Execute before the render method.
    var self = this;
    const {t} = this.props;
    self._waitForToken = AppDispatcher.register(function (payload) {
        switch (payload.actionName) {
            case Constants.events.REMOVE_SHOP_ARRIVED:
              if (payload.data && payload.data.common_id === self._common_id) {
                ApplicationStore.sendMessage({
                  message: t('successRemoveShop'),
                  level: 'success',
                  position: 'bl'
                });
                self.refresh();
              }

              break;
        }
    });

    self.refresh();
  }

  componentWillUnmount() { // Remove listener.
      AppDispatcher.unregister(this._waitForToken);
  }
}

export default translate('common', { wait: process && !process.release })(ManageShops);
