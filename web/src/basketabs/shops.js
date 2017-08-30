import React, { Component } from "react";
import { Button } from "reactstrap";
import { translate } from 'react-i18next';
import { NavLink } from "react-router-dom";
import { ShopsService } from '../services/index';
import { BasketStore } from '../stores/index';
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
    this._waitForToken = null;
    this.next = this.next.bind(this);
    this.display = this.display.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changeActiveShop = this.changeActiveShop.bind(this);
    this.refreshOrders = this.refreshOrders.bind(this);
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

    this.setState({
      errorMessage: null
    });

    if (this.props.onNext) {
      var self = this;
      var orders = self.state.orders.filter(function(o) { return o.shop_id === self.state.activatedShop; });
      var order = $.extend(true, {}, orders[0]);
      this.props.onNext({ order: order });
    }
  }

  changeActiveShop(shopId) { // Change the active shop.
    this.setState({
      activatedShop: shopId
    });
  }

  display() { // Refresh the list of shops.
    var self = this;
    var shopIds = self.state.orders.map(function(o) { return o.shop_id; });
    if (!shopIds || shopIds.length === 0) {
      self.setState({
        navigation: [],
        shops: []
      });
    }

    self.setState({
      isLoading: true
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
        pagination: pagination
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        shops: [],
        navigation: [],
        pagination: []
      });
    });
  }

  refreshOrders() { // Refresh the orders.
    var orders = BasketStore.getOrders();
    this.setState({
      orders: orders
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

    if (this.state.shops && this.state.shops.length > 0) {
      this.state.shops.forEach(function(shop) {
        var profileImage = shop.profile_image || '/images/default-shop.png';
        var orders = self.state.orders.filter(function(o) { return o.shop_id === shop.id; });
        var order = orders[0];
        var totalPrice = t('totalPrice').replace('{0}', order.total_price);
        var numberOfProducts = t('numberOfProducts').replace('{0}', order.lines.length);
        shops.push((<li className="list-group-item list-group-item-action" onClick={() => self.changeActiveShop(shop.id) }>
          { self.state.activatedShop === shop.id ? (
             <div className="checkbox-container">
                 <i className="fa fa-check checkbox txt-info"/>
             </div>) : ''  }
          <div className="col-md-3"><img src={profileImage} width="50" /></div>
          <div className="col-md-3"><NavLink to={"/shops/" + shop.id + '/view/profile'} className="no-decoration red" href="#"><h4>{shop.name}</h4></NavLink></div>
          <div className="col-md-6">
            <h5>{totalPrice}</h5>
            <p>{numberOfProducts}</p>
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
            <ul className="list-group-default clickable">
              {shops}
            </ul>
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
    var self = this;
    this._waitForToken = AppDispatcher.register(function (payload) {
      switch (payload.actionName) {
        case Constants.events.BASKET_LOADED:
          self.state.orders = payload.data;
          self.setState({
            orders: payload.data
          });
          self.display();
        break;
      }
    });
    BasketStore.addChangeListener(self.refreshOrders);
  }

  componentWillUnmount() { // Remove listener.
    AppDispatcher.unregister(this._waitForToken);
    BasketStore.removeChangeListener(this.refreshOrders);
  }
}

export default translate('common', { wait: process && !process.release })(Shops);
