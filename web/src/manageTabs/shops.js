import React, { Component } from "react";
import { ShopsService } from '../services/index';
import { Alert } from 'reactstrap';
import { NavLink } from "react-router-dom";
import { Guid } from '../utils';
import { translate } from 'react-i18next';
import moment from 'moment';
import $ from 'jquery';
import AppDispatcher from "../appDispatcher";

class ManageShops extends Component {
  constructor(props) {
    super(props);
    this._request = {count: 10, start_index: 0};
    this._common_id = null;
    this.refresh = this.refresh.bind(this);
    this.removeShop = this.removeShop.bind(this);
    this.closeError = this.closeError.bind(this);
    this.closeSuccess = this.closeSuccess.bind(this);
    this.navigate = this.navigate.bind(this);
    this.state = {
      isLoading: false,
      shops: [],
      navigation: [],
      errorMessage: null,
      successMessage: null
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
    this._common_id = Guid.generate();
    ShopsService.remove(id, this._common_id).then(function(r) {
      self.setState({
        isLoading: false,
        successMessage: 'The shop has been removed'
      });
    }).catch(function() {
      self.setState({
        errorMessage: 'An error occured while trying to remove the shop',
        isLoading: false
      });
    });
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

  refresh() { // Refresh table.
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

  render() {
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
            <a href="#" style={{padding: "5px", border: "1px solid #ee676b", borderRadius: "5px", color: "#ee676b"}}>
              <i className="fa fa-trash"></i> Delete
            </a>
            <a href="#" style={{padding: "5px", border: "1px solid green", borderRadius: "5px", marginLeft: "5px", color: "green"}}>
              <i className="fa fa-external-link"></i> View
            </a>
            <a href="#" style={{padding: "5px", border: "1px solid #6c6c44", borderRadius: "5px", marginLeft: "5px", color: "#6c6c44"}}>
              <i className="fa fa-pencil"></i> Edit
            </a>
            {/*
            <button className="btn btn-outline-secondary btn-sm" onClick={(e) => { self.removeShop(shop.id); }}><i className="fa fa-trash"></i></button>
            <NavLink to={'/shops/' + shop.id + '/view/profile'} className="btn btn-outline-secondary btn-sm"><i className="fa fa-eye"></i></NavLink>
            <NavLink to={'/shops/' + shop.id + '/edit/profile'} className="btn btn-outline-secondary btn-sm"><i className="fa fa-pencil"></i></NavLink>
            <NavLink to={'/addproduct/' + shop.id} className="btn btn-success"><i className="fa fa-plus"></i> ADD PRODUCT</NavLink>
            <NavLink to={'/addservice/' + shop.id} className="btn btn-success"><i className="fa fa-plus"></i> ADD SERVICE</NavLink>
            */}
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
        {rows.length === 0 && (<Alert color="warning">No shops</Alert>) || (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Creation datetime</th>
                <th>Manage</th>
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

  componentDidMount() {
    var self = this;
    AppDispatcher.register(function (payload) {
        switch (payload.actionName) {
            case 'remove-shop':
              if (payload.data && payload.data.common_id === self._common_id) {
                self.refresh();
              }

              break;
        }
    });

    self.refresh();
  }
}

export default translate('common', { wait: process && !process.release })(ManageShops);
