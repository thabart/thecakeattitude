import React, { Component } from "react";
import { Button } from "reactstrap";
import { translate } from 'react-i18next';
import { NavLink } from "react-router-dom";
import { ShopsService, OrdersService } from '../services/index';
import { BasketStore, ApplicationStore } from '../stores/index';
import AppDispatcher from '../appDispatcher';
import Constants from '../../Constants';
import $ from 'jquery';

const defaultCount = 5;

class Shops extends Component {
  constructor(props) {
    super(props);
    this._request = {
      start_index: 0,
      count: defaultCount
    };
    this._page = '1';
    this.next = this.next.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changeActiveShop = this.changeActiveShop.bind(this);
    this.refresh = this.refresh.bind(this);
    this.removeOrder = this.removeOrder.bind(this);
    this.state = {
      isLoading: false,
      shops: [],
      navigation: [],
      orders: [],
      activatedShop: null,
      errorMessage: null
    };
  }

  changePage(e, page) { // Change the page.
      e.preventDefault();
      this._page = page;
      this._request['start_index'] = (page - 1) * defaultCount;
      this.display();
  }

  next() { // Execute when the user click on next.
    if (this.state.activatedShop === null) {
      const {t} = this.props;
      this.setState({
        errorMessage: t('selectOneShopError')
      });
      return;
    }

    var self = this;
    self.setState({
      errorMessage: null
    });

    if (this.props.onNext) {
      var order = self.state.orders.filter(function(o) { return o.shop_id === self.state.activatedShop; })[0];
      AppDispatcher.dispatch({
        actionName: Constants.events.SELECT_ORDER_ACT,
        data: order.id
      });
      this.props.onNext();
    }
  }

  changeActiveShop(shopId) { // Change the active shop.
    this.setState({
      activatedShop: shopId
    });
  }

  refresh() { // Refresh all the bills.
    var orders = BasketStore.getOrders();
    var self = this;
    var shopIds = orders.map(function(o) { return o.shop_id; });
    if (!shopIds || shopIds.length === 0) {
      self.setState({
        activatedShop: null,
        isLoading: false,
        navigation: [],
        shops: [],
        orders: []
      });
      return;
    }

    self.setState({
      isLoading: true,
      activatedShop: null
    });
    self._request['shop_ids'] = shopIds;
    ShopsService.search(self._request).then(function(res) {
      var shops = res['_embedded'];
      var pagination = res['_links'].navigation;
      if (!(shops instanceof Array)) {
        shops = [shops];
      }

      self.setState({
        isLoading: false,
        shops: shops,
        pagination: pagination,
        orders: orders
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        shops: [],
        navigation: [],
        pagination: [],
        orders: []
      });
    });
  }

  removeOrder(e, orderId) { // Remove the order.
    e.preventDefault();
    var self = this;
    self.setState({
      isLoading: true
    });
    const {t} = this.props;
    OrdersService.remove(orderId).catch(function() {
      self.setState({
        isLoading: false
      });
      ApplicationStore.sendMessage({
        message: t('removeOrderError'),
        level: 'error',
        position: 'tr'
      });
    });
  }

  render() { // Display the component.
    const { t } = this.props;
    if (this.state.isLoading) {
      return (<i className='fa fa-spinner fa-spin'/>);
    }

    var pagination = [],
      shops = [],
      self = this;
    if (this.state.pagination && this.state.pagination.length > 1) {
        this.state.pagination.forEach(function (page) {
            pagination.push((<li className="page-item">
              <a className={self._page === page.name ? "page-link active" : "page-link"} href="#" onClick={(e) => { self.changePage(e, page.name);}}>
                {page.name}
              </a>
            </li>))
        });
    }

    if (this.state.orders && this.state.orders.length > 0 && this.state.shops && this.state.shops.length > 0) {
      this.state.orders.forEach(function(order) {
        var shop = self.state.shops.filter(function(s) { return s.id === order.shop_id; })[0];
        var profileImage = shop.profile_image || '/images/default-shop.png';
        var totalPrice = t('totalPrice').replace('{0}', order.total_price);
        var numberOfProducts = t('numberOfProducts').replace('{0}', order.lines.length);
        shops.push((<li className="list-group-item list-group-item-action" onClick={() => self.changeActiveShop(shop.id) }>
          { self.state.activatedShop === shop.id ? (
             <div className="checkbox-container">
                 <i className="fa fa-check checkbox txt-info"/>
             </div>) : ''  }
          <div className="col-md-3"><img src={profileImage} width="50" /></div>
          <div className="col-md-3"><NavLink to={"/shops/" + shop.id + '/view/profile'} className="no-decoration red" href="#"><h4>{shop.name}</h4></NavLink></div>
          <div className="col-md-4">
            <h5>{totalPrice}</h5>
            <p>{numberOfProducts}</p>
          </div>
          <div className="col-md-2">
            <a href="#" className="btn-light red" onClick={(e) => { self.removeOrder(e, order.id) }}><i className="fa fa-trash"></i></a>
          </div>
        </li>));
      });
    }

    return (
      <div className="container rounded">
        <p>{t('basketShopsDescription')}</p>
        {this.state.errorMessage !== null && (<span style={{color: "#d9534f"}}>{this.state.errorMessage}</span>)}
        <div>
          <section>
            {shops.length === 0 ? (<span>{t('noBills')}</span>) : (
              <ul className="list-group-default clickable">
                {shops}
              </ul>
            )}
            {pagination.length > 0 && (<ul className="pagination">
                {pagination}
            </ul>)}
          </section>
          <section>
            <Button color="default" onClick={this.next} >{t('next')}</Button>
          </section>
        </div>
      </div>
    );
  }

  componentDidMount() { // Execute before the render.
    BasketStore.addLoadListener(this.refresh);
  }

  componentWillUnmount() { // Remove listener.
    BasketStore.removeLoadListener(this.refresh);
  }
}

export default translate('common', { wait: process && !process.release })(Shops);
