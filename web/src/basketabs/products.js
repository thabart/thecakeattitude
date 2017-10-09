import React, { Component } from "react";
import { Button } from "reactstrap";
import { translate } from 'react-i18next';
import { ProductsService, OrdersService } from '../services/index';
import { NavLink } from "react-router-dom";
import { Guid } from '../utils/index';
import { BasketStore, ApplicationStore } from '../stores/index';
import { Badge } from 'reactstrap';
import AppDispatcher from '../appDispatcher';
import Constants from '../../Constants';
import $ from 'jquery';

const defaultCount = 5;

class Products extends Component {
  constructor(props) {
    super(props);
    this._request = {
      start_index: 0,
      count: defaultCount
    };
    this._page = '1';
    this._order = {};
    this._waitForToken = null;
    this._commonId = null;
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.getTotalPrice = this.getTotalPrice.bind(this);
    this.changePage = this.changePage.bind(this);
    this.refresh = this.refresh.bind(this);
    this.changeOrderLineQuantity = this.changeOrderLineQuantity.bind(this);
    this.changeDiscountCode = this.changeDiscountCode.bind(this);
    this.update = this.update.bind(this);
    this.removeOrderLine = this.removeOrderLine.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      isLoading: false,
      products: [],
      pagination: [],
      order: {},
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
    var selectedOrderId = BasketStore.getSelectedOrderId();
    var orders = BasketStore.getOrders();
    var order = orders.filter(function(o) { return o.id === selectedOrderId; })[0];
    if (!order) {
      return;
    }

    order = $.extend(true, {}, order);
    self._order = $.extend(true, {}, order);
    self.setState({
      isLoading: true
    });
    var productIds = order.lines.map(function(line) { return line.product_id; });
    self._request['product_ids'] = productIds;
    ProductsService.search(self._request).then(function(res) {
      var products = res['_embedded'];
      var pagination = res['_links'].navigation;
      if (!(products instanceof Array)) {
        products = [products];
      }

      order.total_price = self.getTotalPrice(order, products);
      self.setState({
        isLoading: false,
        products: products,
        pagination: pagination,
        hasChanged: false,
        order: order
      });
    }).catch(function(e) {
      self.setState({
        isLoading: false,
        products: [],
        pagination: [],
        hasChanged: false,
        order: order
      });
    });
  }

  changeOrderLineQuantity(e, orderLineId) { // Change the order line quantity.
    var value = e.target.value;
    if (value <= 0) {
      e.preventDefault();
      return;
    }

    var order = this.state.order;
    var orderLines = order.lines;
    var orderLine = orderLines.filter(function(line) { return line.id === orderLineId; })[0];
    var product = this.state.products.filter(function(p) { return p.id === orderLine.product_id; })[0];
    if (value > product.available_in_stock) {
      e.preventDefault();
      return;
    }

    orderLine.quantity = value;
    var order = this.state.order;
    order.total_price = this.getTotalPrice(order, this.state.products);
    this.setState({
      order: order,
      hasChanged: true
    });
  }

  getTotalPrice(order, products) { // Calculate the total price & set the discount code.
    if (order.lines && order.lines.length > 0) { // Set the best valid public discount by default.
      var totalPrice = 0;
      order.lines.forEach(function(orderLine) {
        var orderDiscount = orderLine['discount'];
        var product = products.filter(function(p) { return p.id === orderLine.product_id })[0];
        totalPrice += product.price * orderLine.quantity;
        if (!orderDiscount) {
          var productDiscounts = product['discounts'];
          if (productDiscounts && productDiscounts.length > 0) {
            var bestDiscount = null;
            productDiscounts.forEach(function(discount) {
              if (!bestDiscount || bestDiscount === null || bestDiscount.money_saved < discount.money_saved) {
                bestDiscount = discount;
              }
            });

            if (bestDiscount && bestDiscount !== null) {
              orderLine.discount_code = bestDiscount.code;
              orderDiscount = bestDiscount;
            }
          }
        } else {
          orderLine.discount_code = orderDiscount.code;
        }

        if (orderDiscount) {
          totalPrice -= orderDiscount.money_saved * orderLine.quantity;
        }
      });

      return totalPrice;
    }

    return 0;
  }

  changeDiscountCode(e, orderLineId) { // Change the discount code.
      var value = e.target.value;
      var order = this.state.order;
      var orderLines = order.lines;
      var orderLine = orderLines.filter(function(line) { return line.id === orderLineId; })[0];
      orderLine.discount_code = value;
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
    order.total_price = this.getTotalPrice(order, this.state.products);
    this.setState({
      order: order,
      hasChanged: true
    });
  }

  reset() { // Reset the changes.
    this.setState({
      order: $.extend(true, {}, this._order),
      hasChanged: false
    });
  }

  update() { // Update the order.
    var self = this;
    self.setState({
      isLoading: true
    });
    const {t} = this.props;
    self._commonId = Guid.generate();
    OrdersService.update(self.state.order.id, self.state.order, self._commonId).catch(function(e) {
      var errorMsg = t('basketUpdatedError');
      if (e.responseJSON && e.responseJSON.error_description) {
        errorMsg = e.responseJSON.error_description;
      }

      self.setState({
        isLoading: false
      });
      ApplicationStore.sendMessage({
        message: errorMsg,
        level: 'error',
        position: 'tr'
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
        if (!product) {
          return;
        }

        var productImage = product['images'];
        if (!productImage || productImage.length === 0) {
            productImage = "/images/default-product.jpg";
        } else {
            productImage = productImage[0];
        }

        var discounts = product['discounts'];
        var bestDiscount = orderLine.discount;
        if (!bestDiscount) {
          if (discounts && discounts.length > 0) {
            discounts.forEach(function(discount) {
              if (!bestDiscount || bestDiscount === null || bestDiscount.money_saved < discount.money_saved) {
                  bestDiscount = discount;
              }
            });
          }
        }

        products.push((<li className="list-group-item">
          <div className="col-md-2"><img src={productImage} width="40" /></div>
          <div className="col-md-3">
            <NavLink to={"/products/" + product.id} className="no-decoration red" href="#"><h4>{product.name}</h4></NavLink>
            <p>
              {t('oneUnitEqualTo').replace('{0}', product.quantity + ' ' + t(product.unit_of_measure))} <br />
              {t('pricePerUnit').replace('{0}', '€ ' + product.price)} <br />
              {t('availableInStock').replace('{0}', product.available_in_stock)}
            </p>
          </div>
          <div className="col-md-2">
            {!bestDiscount || bestDiscount === null ? (<h4>€ {orderLine.price}</h4>) : (
              <div>
                  <h5 className="inline">
                      <Badge color="success">
                        <strike style={{color: "white"}}>€ {product.price}</strike>
                        <i style={{color: "white"}} className="ml-1">- € {bestDiscount.money_saved}</i>
                      </Badge>
                  </h5>
                  <h5 className="inline ml-1">€ {(product.price - bestDiscount.money_saved)}</h5>
              </div>
            )}
          </div>
          <div className="col-md-2"><input type="number" className="form-control" value={orderLine.quantity} max={product.available_in_stock} min="0" onChange={(e) => self.changeOrderLineQuantity(e, orderLine.id)} /></div>
          <div className="col-md-2"><input type="text" className="form-control" value={orderLine.discount_code} onChange={(e) => self.changeDiscountCode(e, orderLine.id)} /></div>
          <div className="col-md-1"><a href="#" className="btn-light red" onClick={(e) => { self.removeOrderLine(e, orderLine.id) }}><i className="fa fa-trash"></i></a></div>
        </li>));
      });
    }

    return (
      <div className="container rounded">
        { this.state.isLoading ? (<i className='fa fa-spinner fa-spin' /> ) : (
          <div>
            <section>
              <p>{t('productBasketDescription')}</p>
              { this.state.hasChanged && ( <p>{t('basketHasChanged')}</p>) }
              { /* Display products */ }
              { products.length === 0 ? (<span>{t('noProducts')}</span>) : (
                <div className="list-group-default">
                  <li className="list-group-item">
                    <div className="col-md-2 offset-md-5">{t('price')}</div>
                    <div className="col-md-2">{t('productQuantity')}</div>
                    <div className="col-md-2">{t('discountCode')}</div>
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
              <h4>{t('totalPrice').replace('{0}', self.state.order.total_price)}</h4>
            </section>
            <section style={{marginTop: "10px"}}>
                <Button color="default" onClick={this.previous}>{t('previous')}</Button>
                { this.state.hasChanged ? (<Button color="default" onClick={this.update}  style={{marginLeft:"5px"}}>{t('update')}</Button>) : (<Button color="default" style={{marginLeft:"5px"}} disabled>{t('update')}</Button>) }
                { this.state.hasChanged ? (<Button color="default" onClick={this.reset}  style={{marginLeft:"5px"}}>{t('reset')}</Button>) : (<Button color="default" style={{marginLeft:"5px"}} disabled>{t('reset')}</Button>) }
                <Button color="default" onClick={this.next} style={{marginLeft:"5px"}}>{t('next')}</Button>
            </section>
          </div>
        )}
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

export default translate('common', { wait: process && !process.release, withRef: true })(Products);
