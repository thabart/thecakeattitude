import React, {Component} from "react";
import { OrdersService, ShopsService } from '../services/index';
import { translate } from 'react-i18next';
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import { ApplicationStore } from '../stores/index';
import { Guid } from '../utils/index';
import AppDispatcher from "../appDispatcher";
import Constants from '../../Constants';
import moment from 'moment';
import $ from 'jquery';

const defaultCount = 5;

class ManageOrders extends Component {
  constructor(props) {
    super(props);
    this._page = '1';
    this._waitForToken = null;
    this._common_id = null;
    // var sub = ApplicationStore.getUser().sub;
    this._request = {
      count: defaultCount,
      start_index: 0,
      orders: [
        { target: 'create_datetime', method: 'desc' }
      ]
    };
    this.displaySent = this.displaySent.bind(this);
    this.displayReceived = this.displayReceived.bind(this);
    this.navToSent = this.navToSent.bind(this);
    this.navToReceived = this.navToReceived.bind(this);
    this.changePage = this.changePage.bind(this);
    this.refresh = this.refresh.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.state = {
      isLoading: false,
      orders: [],
      pagination: []
    };
  }

  displaySent(e) { // Display sent orders.
    e.preventDefault();
    this.props.history.push('/manage/orders');
    this.navToSent();
  }

  displayReceived(e) { // Display received orders.
    e.preventDefault();
    this.props.history.push('/manage/orders/received');
    this.navToReceived();
  }

  navToSent() { // Navigate to sent orders.
    var sub = ApplicationStore.getUser().sub;
    this._request['clients'] = [ sub ];
    delete this._request.sellers;
    this.refresh();
  }

  navToReceived() { // Navigate to received orders.
    var sub = ApplicationStore.getUser().sub;
    this._request['sellers'] = [ sub ];
    delete this._request.clients;
    this.refresh();
  }

  changePage(e, page) { // Change page.
    e.preventDefault();
    this._page = page;
    this._request['start_index'] = (page - 1) * defaultCount;
    this.refresh();
  }

  refresh() { // Refresh the list.
    var self = this;
    self.setState({
      isLoading: true
    });
    OrdersService.search(self._request).then(function(r) {
      var orders = r['_embedded'];
      var pagination = r['_links'].navigation;
      if (!(orders instanceof Array)) {
        orders = [orders];
      }

      var shopIds = orders.map(function(o) { return o.shop_id ;});
      ShopsService.search({ shop_ids: shopIds }).then(function(r) {
        var shops = r['_embedded'];
        if (!(shops instanceof Array)) {
          shops = [shops];
        }

        orders.forEach(function(order) {
          var shop = shops.filter(function(shop) { return shop.id === order.shop_id; })[0];
          order['shop_name'] = shop.name;
        });

        self.setState({
          isLoading: false,
          orders: orders,
          pagination: pagination
        });
      }).catch(function() {
        self.setState({
          isLoading: false,
          orders: [],
          pagination: []
        });
      });
    }).catch(function(e) {
      self.setState({
        isLoading: false,
        orders: [],
        pagination: []
      });
    });
  }

  deleteOrder(e, orderId) { // Remove the order.
    e.preventDefault();
    var self = this;
    self.setState({
      isLoading: true
    });
    const {t} = this.props;
    self._common_id = Guid.generate();
    OrdersService.remove(orderId, self._common_id).catch(function() {
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
    const {t} = this.props;
    var self = this;
    var action = self.props.match.params.subaction;
    if (!action || action !== "received") {
      action = "sent";
    }

    var orderLst = [];
    var paginationLst = [];
    if (this.state.orders) {
      this.state.orders.forEach(function(order) {
        var totalPrice = t('totalPrice').replace('{0}', order.total_price);
        var numberOfProducts = t('numberOfProducts').replace('{0}', order.lines.length);
        var status = t('status_' + order.status);
        orderLst.push((<tr>
          <td><NavLink to={"/shops/" + order.shop_id + '/view/profile'} className="no-decoration red" href="#"><h4>{order.shop_name}</h4></NavLink></td>
          <td>
            <h5>{totalPrice}</h5>
            <p>{numberOfProducts}</p>
          </td>
          <td>{moment(order.create_datetime).format('LLL')}</td>
          <td><span className="badge badge-default">{status}</span></td>
          <td>
            <a href="#" className="btn-light red" style={{marginRight: "5px"}} onClick={(e) => { self.deleteOrder(e, order.id) }}><i className="fa fa-trash"></i>  {t('delete')}</a>
            <NavLink to={'/orders/' + order.id} className="btn-light green" style={{textDecoration: 'none !important'}}>
              <i className="fa fa-external-link"></i>  {t('view')}
            </NavLink>
          </td>
        </tr>));
      });
    }

    if (this.state.pagination && this.state.pagination.length > 1) {
        this.state.pagination.forEach(function (page) {
            paginationLst.push((<li className="page-item">
              <a className={self._page === page.name ? "page-link active" : "page-link"} href="#" onClick={(e) => { self.changePage(e, page.name);}}>
                {page.name}
              </a>
            </li>))
        });
    }

    return (<div className="container">
      <div className="section" style={{padding: "20px"}}>
        { this.state.isLoading ? (<i className="fa fa-spinner fa-spin"></i>) : (
          <div>
            <ul className="nav nav-pills red">
              <li className="nav-item"><a href="#" className={action === "sent" ? "nav-link active" : "nav-link"} onClick={self.displaySent}>{t('sent')}</a></li>
              <li className="nav-item"><a href="#" className={action === "received" ? "nav-link active" : "nav-link"} onClick={self.displayReceived}>{t('received')}</a></li>
            </ul>
            { orderLst.length === 0 ? (<span><i>{t('noOrder')}</i></span>) : (
              <table className="table" style={{marginTop: "10px"}}>
                <thead>
                  <tr>
                    <th>{t('shop')}</th>
                    <th>{t('price')}</th>
                    <th>{t('creationDate')}</th>
                    <th>{t('status')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orderLst}
                </tbody>
              </table>
            ) }
            { paginationLst.length > 0 && (<ul className="pagination">
                {paginationLst}
            </ul>) }
          </div>
        ) }
      </div>
    </div>);
  }

  componentDidMount() { // Execute before the render method.
    var self = this;
    var action = self.props.match.params.subaction;
    if (!action || action !== "received") {
      action = "sent";
    }

    if (action === 'received') {
      self.navToReceived();
    } else {
      self.navToSent();
    }

    const {t} = this.props;
    self._waitForToken = AppDispatcher.register(function (payload) {
        switch (payload.actionName) {
            case Constants.events.ORDER_REMOVED_ARRIVED:
              if (payload.data && payload.data.common_id === self._common_id) {
                ApplicationStore.sendMessage({
                  message: t('orderRemoved'),
                  level: 'success',
                  position: 'bl'
                });

                self.refresh();
              }

              break;
        }
    });
  }

  componentWillUnmount() { // Remove listener.
      AppDispatcher.unregister(this._waitForToken);
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(ManageOrders));
