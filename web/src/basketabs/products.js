import React, { Component } from "react";
import { Button } from "reactstrap";
import { translate } from 'react-i18next';
import { ProductsService, OrdersService } from '../services/index';
import { NavLink } from "react-router-dom";
import { Guid } from '../utils/index';
import { BasketStore } from '../stores/index';
import AppDispatcher from '../appDispatcher';
import Constants from '../../Constants';

const defaultCount = 5;

class Products extends Component {
  constructor(props) {
    super(props);
    this._request = {
      start_index: 0,
      count: defaultCount
    };
    this._page = '1';
    this._order = null;
    this._waitForToken = null;
    this._commonId = null;
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.changePage = this.changePage.bind(this);
    this.refresh = this.refresh.bind(this);
    this.changeOrderLineQuantity = this.changeOrderLineQuantity.bind(this);
    this.update = this.update.bind(this);
    this.removeOrderLine = this.removeOrderLine.bind(this);
    this.state = {
      isLoading: false,
      products: [],
      pagination: [],
      order: null,
      hasChanged: false
    };
  }

  previous() { // Execute when the user clicks on previous.
    if (this.props.onPrevious) {
      this.props.onPrevious();
    }
  }

  next() { // Execute when the user click on next.
    if (this.props.onNext) {
      this.props.onNext();
    }
  }

  changePage(e, page) { // Change the page.
      e.preventDefault();
      this._page = page;
      this._request['start_index'] = (page - 1) * defaultCount;
      this.refresh();
  }

  refresh() { // Refresh the page.
    var self = this;
    if (self.state.order === null) {
      return;
    }

    self.setState({
      isLoading: true
    });
    var productIds = self.state.order.lines.map(function(line) { return line.product_id; });
    self._request['product_ids'] = productIds;
    ProductsService.search(self._request).then(function(res) {
      var products = res['_embedded'];
      var pagination = res['_links'].navigation;
      if (!(products instanceof Array)) {
        products = [products];
      }

      self.setState({
        isLoading: false,
        products: products,
        pagination: pagination
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        products: [],
        pagination: []
      });
    });
  }

  display(order) { // Display the products.
    this._order = order;
    this.state.order = order;
    this.setState({
      order: order
    });
    this.refresh();
  }

  changeOrderLineQuantity(e, orderLineId) { // Change the order line quantity.
    var value = e.target.value;
    var order = this.state.order;
    var orderLines = order.lines;
    var orderLine = orderLines.filter(function(line) { return line.id === orderLineId; })[0];
    var product = this.state.products.filter(function(p) { return p.id === orderLine.product_id; })[0];
    orderLine.quantity = value;
    orderLine.price = value * product.price;
    var totalPrice = 0;
    orderLines.forEach(function(l) { totalPrice += l.price; });
    order.total_price = totalPrice;
    this.setState({
      order: order,
      hasChanged: true
    });
  }

  removeOrderLine(e, orderLineId) { // Remove the order line.
    e.preventDefault();
    var order = this.state.order;
    var orderLines = order.lines;
    var orderLine = orderLines.filter(function(line) { return line.id === orderLineId; })[0];
    var index = orderLines.indexOf(orderLine);
    orderLines.splice(index, 1);
    var totalPrice = 0;
    orderLines.forEach(function(l) { totalPrice += l.price; });
    order.total_price = totalPrice;
    this.setState({
      order: order,
      hasChanged: true
    });
  }

  update() { // Update the order.
    var self = this;
    self.setState({
      isLoading: true
    });
    self._commonId = Guid.generate();
    OrdersService.update(self.state.order.id, self.state.order, self._commonId).then(function() {
      self.setState({
        isLoading: false
      });

      var orders = BasketStore.getOrders();
      try {
        console.log(orders);
      var filteredOrders = orders.filter(function(o) { return o.id === self.state.order.id });
      if (filteredOrders && filteredOrders.length === 1) {
        var order = filteredOrders[0];
        order.total_price = self.state.order.total_price;
        order.lines = self.state.order.lines;
      }

      console.log(orders);
      AppDispatcher.dispatch({
        actionName: Constants.events.UPDATE_BASKET_INFORMATION_ACT,
        data: orders
      });
    } catch(e) {
      console.log(e);
    }
    }).catch(function() {
      self.setState({
        isLoading: false
      });
    });
  }

  render() { // Display the component.
    const { t } = this.props;
    var pagination = [],
      products = [],
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

    if (this.state.order && this.state.order.lines && this.state.order.lines.length > 0) {
      this.state.order.lines.forEach(function(orderLine) {
        var product = self.state.products.filter(function(prod) { return prod.id === orderLine.product_id; })[0];
        var productImage = product['images'];
        if (!productImage || productImage.length === 0) {
            productImage = "/images/default-product.jpg";
        } else {
            productImage = productImage[0];
        }

        products.push((<li className="list-group-item">
          <div className="col-md-2"><img src={productImage} width="40" /></div>
          <div className="col-md-3"><NavLink to={"/products/" + product.id} className="no-decoration red" href="#"><h4>{product.name}</h4></NavLink></div>
          <div className="col-md-3"><h4>€ {orderLine.price}</h4></div>
          <div className="col-md-2"><input type="number" className="form-control" value={orderLine.quantity} min="0" onChange={(e) => self.changeOrderLineQuantity(e, orderLine.id)} /></div>
          <div className="col-md-2"><a href="#" className="btn-light red" onClick={(e) => { self.removeOrderLine(e, orderLine.id) }}><i className="fa fa-trash"></i></a></div>
        </li>));
      });
    }

    return (
      <div className="container rounded">
        { this.state.isLoading ? (<i className='fa fa-spinner fa-spin' /> ) : (
          <div>
            <section>
              <p>{t('productBasketDescription')}</p>

              { /* Display products */ }
              { products.length === 0 ? (<span>{t('noProducts')}</span>) : (
                <div className="list-group-default">
                  <li className="list-group-item">
                    <div className="col-md-3 offset-md-5">{t('price')}</div>
                    <div className="col-md-2">{t('productQuantity')}</div>
                  </li>
                  {products}
                </div>
              )}

              { /* Display pagination */ }
              {pagination.length > 0 && (<ul className="pagination">
                  {pagination}
              </ul>)}
            </section>
            <section style={{marginTop: "10px"}}>
                <Button color="default" onClick={this.previous}>{t('previous')}</Button>
                { this.state.hasChanged ? (<Button color="default" onClick={this.update}  style={{marginLeft:"5px"}}>{t('update')}</Button>) : (<Button color="default" style={{marginLeft:"5px"}} disabled>{t('update')}</Button>) }
                <Button color="default" style={{marginLeft:"5px"}}>Reset</Button>
                <Button color="default" onClick={this.next} style={{marginLeft:"5px"}}>{t('next')}</Button>
            </section>
          </div>
        )}
      </div>
    );
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(Products);
