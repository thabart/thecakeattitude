import React, {Component} from "react";
import { translate } from 'react-i18next';
import { OrdersService, ProductsService, ShopsService, UserService } from './services/index';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import { ApplicationStore } from './stores/index';
import { UrlParser } from './utils/index';
import MainLayout from './MainLayout';
import AppDispatcher from './appDispatcher';
import Constants from '../Constants';
import Promise from "bluebird";

const defaultCount = 5;

const markerOpts = {
    url: '/images/shop-pin.png',
    scaledSize: new window.google.maps.Size(34, 38)
};

const GettingStartedGoogleMap = withGoogleMap(props => {
    return (
        <GoogleMap
            center={props.center}
            defaultZoom={12}
            defaultOptions={{fullscreenControl: false}}
        >
            <Marker
                icon={markerOpts}
                position={props.center}/>
        </GoogleMap>
    );
});

class Order extends Component {
    constructor(props) {
      super(props);
      this._waitForToken = null;
      this._page = '1';
      this._windowPaypal = null;
      this._request = {
        start_index: 0,
        count: defaultCount
      };
      this.changePage = this.changePage.bind(this);
      this.refresh = this.refresh.bind(this);
      this.confirmReception = this.confirmReception.bind(this);
      this.executePaypal = this.executePaypal.bind(this);
      this.downloadLabel = this.downloadLabel.bind(this);
      this.state = {
        isLoading: false,
        pagination: [],
        products: [],
        order: {},
        shop: {},
        user: {},
        isPaypalLoading: false
      };
    }

    changePage(e, page) { // Change the page.
        e.preventDefault();
        this._page = page;
        this._request['start_index'] = (page - 1) * defaultCount;
        this.refresh();
    }

    refresh() { // Refresh the order.
      var self = this,
        orderId = self.props.match.params.id;
      self.setState({
        isLoading: true
      });

      OrdersService.get(orderId).then(function(r) {
        var order = r['_embedded'];
        var productIds = order.lines.map(function(line) { return line.product_id; });
        self._request['product_ids'] = productIds;
        var requests = [ ProductsService.search(self._request), UserService.getPublicClaims(order.subject), ShopsService.get(order.shop_id) ];
        Promise.all(requests).then(function(res) {
          var products = res[0]['_embedded'];
          var claims = res[1]['claims'];
          var shop = res[2]['_embedded'];
          var pagination = res[0]['_links'].navigation;
          if (!(products instanceof Array)) {
            products = [products];
          }

          self.setState({
            isLoading: false,
            order: order,
            products: products,
            pagination: pagination,
            shop: shop,
            user: claims
          });
        }).catch(function() {
          self.setState({
            isLoading: false,
            order: {},
            products: [],
            pagination: [],
            shop: {},
            user: {},
            transaction: {}
          });
        });
      }).catch(function() {
        self.setState({
          isLoading: false,
          order: {},
          products: [],
          pagination: [],
          shop: {},
          user: {}
        });
      });
    }

    confirmReception() { // Confirm the reception of the packet.
      var self = this;
      self.setState({
        isLoading: true
      });
      var request = {
        'status': 'received'
      };
      const {t} = this.props;
      OrdersService.update(self.state.order.id, request).catch(function(e) {
        var errorMsg = t('confirmRequestError');
        if (e.responseJSON && e.responseJSON.error_description) {
          errorMsg = e.responseJSON.error_description;
        }

        ApplicationStore.sendMessage({
          message: errorMsg,
          level: 'error',
          position: 'tr'
        });
      });
    }

    executePaypal() { // Execute the paypal payment.
      var self = this;
      if (self._windowPaypal && self._windowPaypal.isClosed == false) return;
      var url = self.state.order.payment.approval_url;
      self._windowPaypal = window.open(url, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=400');
      self.setState({
        isPaypalLoading: true
      });
      const {t} = this.props;
      var isProcessing = false;
      var interval = setInterval(function () {
          if (isProcessing) return;
          if (self._windowPaypal.closed) {
              clearInterval(interval);
              self.setState({
                isPaypalLoading: false
              });
              return;
          }

          var href = self._windowPaypal.location.href;
          var paymentId = UrlParser.getParameterByName('paymentId', href);
          var payerId = UrlParser.getParameterByName('PayerID', href);
          if (!paymentId && !payerId) {
            return;
          }

          isProcessing = true;
          OrdersService.acceptPayment(self.state.order.id, {
            payer_id: payerId,
            transaction_id: paymentId
          }).then(function() {
            self.setState({
              isPaypalLoading: false
            });
            self._windowPaypal.close();
            clearInterval(interval);
          }).catch(function(e) {
            var errorMsg = t('orderTransactionCannotBeConfirmed');
            if (e.responseJSON && e.responseJSON.error_description) {
              errorMsg = e.responseJSON.error_description;
            }

            self.setState({
              isPaypalLoading: false
            });
            ApplicationStore.sendMessage({
              message: errorMsg,
              level: 'error',
              position: 'tr'
            });
            self._windowPaypal.close();
            clearInterval(interval);
          });
        });
    }

    downloadLabel() { // Download the label.
      var self = this;
      self.setState({
        isFileLoading: true
      });
      var anchor = document.createElement('a');
      OrdersService.getLabel(this.state.order.id).then(function(r) {
        var url = window.URL.createObjectURL(r);
        anchor.href = url
        anchor.click();
      });
    }

    render() { // Render the view.
      const {t} = this.props;
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

          products.push((<li className="list-group-item">
            <div className="col-md-2"><img src={productImage} width="40" /></div>
            <div className="col-md-4">
              <NavLink to={"/products/" + product.id} className="no-decoration red" href="#"><h4>{product.name}</h4></NavLink>
              <p>
                {t('oneUnitEqualTo').replace('{0}', product.quantity + ' ' + t(product.unit_of_measure))} <br />
                {t('pricePerUnit').replace('{0}', '€ ' + product.new_price)} <br />
                {t('availableInStock').replace('{0}', product.available_in_stock)}
              </p>
            </div>
            <div className="col-md-3">
              <h4>€ {orderLine.price}</h4>
            </div>
            <div className="col-md-3">{orderLine.quantity}</div>
          </li>));
        });
      }

      var img = "/images/profile-picture.png";
      if (this.state.user.picture && this.state.user.picture !== null) {
        img = this.state.user.picture;
      }

      var sub = ApplicationStore.getUser().sub;
      var isBuyer = this.state.order && this.state.order.subject === sub;
      var isSeller = this.state.shop && this.state.shop.subject === sub;
      return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        { this.state.isLoading ? (<div className="container"><i className="fa fa-spinner fa-spin"></i></div>) : (
          <div className="container">
            <h2>{t('orderTitle')}</h2>
            <section className="section" style={{padding: "10px"}}>
              <div className="row">
                <div className="col-md-8">
                  { /* Display products */ }
                  { products.length === 0 ? (<span>{t('noProducts')}</span>) : (
                    <div className="list-group-default">
                      <li className="list-group-item">
                        <div className="col-md-3 offset-md-6">{t('price')}</div>
                        <div className="col-md-2">{t('productQuantity')}</div>
                      </li>
                      {products}
                    </div>
                  ) }
                  { /* Display pagination */ }
                  {pagination.length > 0 && (<ul className="pagination">
                      {pagination}
                  </ul>)}
                </div>
                <div className="col-md-4">
                  { /* Display buyer */ }
                  <section>
                    <h5>{t('buyer')}</h5>
                    <div className="row">
                      <div className="col-md-2">
                        <img src={img} className="rounded-circle image-small"/>
                      </div>
                      <div className="col-md-10">
                        <p><NavLink to={"/users/" + this.state.user.sub} style={{color: "inherit"}}>{this.state.user.name}</NavLink></p>
                      </div>
                    </div>
                  </section>
                  { /* Display shop information */ }
                  <section>
                    <h5>{t('shop')}</h5>
                    <p><NavLink to={"/shops/" + this.state.shop.id + "/view/profile"}  style={{color: "inherit"}}>{this.state.shop.name}</NavLink></p>
                  </section>
                  { /* Display status */ }
                  <section>
                    <h5>{t('status')}</h5>
                    <span className="badge badge-default">{t('status_' + this.state.order.status)}</span>
                  </section>
                  { /* Display transport method */ }
                  { this.state.order.transport_mode && this.state.order.transport_mode === 'manual' && (
                    <section>
                      <h5>{t('transport')}</h5>
                      <p>{t('chooseHandToHandTransport')}</p>
                    </section>
                  ) }
                  { this.state.order.transport_mode === 'packet' && (
                    <section>
                      <h5>{t('transport')}</h5>
                      { this.state.order.package.transporter === 'dhl' && (<img src="/images/DHL.png" width="100" />) }
                      { this.state.order.package.transporter === 'ups' && (<img src="/images/UPS.png" width="50" />) }
                      { (!this.state.order.package.parcel_shop || !this.state.order.package.parcel_shop.id) && (<p>{t('deliveredAtHome')}</p>) }
                    </section>
                  ) }
                  { this.state.order.transport_mode === 'packet' && this.state.order.payment && (
                    <section>
                      <h5>{t('payment')}</h5>
                      { this.state.order.payment.payment_method === 'paypal' && (<img src="/images/paypal.png" width="50" />) }
                      <p><span className="badge badge-default">{t('payment_status_' + this.state.order.payment.status)}</span></p>
                    </section>
                  )}
                  { /* Display buyer & seller address & parcel shop */ }
                  { this.state.order.transport_mode === 'packet' && (
                    <section>
                      <div>
                        <h5>{t('buyerAddress')}</h5>
                        <p>{this.state.order.package.buyer.address.address_line}, {this.state.order.package.buyer.address.city}, {this.state.order.package.buyer.address.postal_code}, {this.state.order.package.buyer.address.country_code}</p>
                      </div>
                      <div>
                        <h5>{t('sellerAddress')}</h5>
                        <p>{this.state.order.package.seller.address.address_line}, {this.state.order.package.seller.address.city}, {this.state.order.package.seller.address.postal_code}, {this.state.order.package.seller.address.country_code}</p>
                      </div>
                      { /* Display the parcel shop */ }
                      { (this.state.order.transport_mode === 'packet' && (this.state.order.package.parcel_shop && this.state.order.package.parcel_shop.id)) && (
                        <div>
                          <h5>{t('parcelShop')}</h5>
                          <p>{this.state.order.package.parcel_shop.address.address_line}, {this.state.order.package.parcel_shop.address.city}, {this.state.order.package.parcel_shop.address.postal_code}, {this.state.order.package.parcel_shop.address.country_code}</p>
                          <div style={{width: "100%", height: "200px"}}>
                              <GettingStartedGoogleMap
                                  center={this.state.order.package.parcel_shop.location}
                                  containerElement={
                                      <div style={{height: `100%`}}/>
                                  }
                                  mapElement={
                                      <div style={{height: `100%`}}/>
                                  }>
                              </GettingStartedGoogleMap>
                          </div>
                        </div>
                      )}
                    </section>
                  ) }
                  { /* Display price */ }
                  { this.state.order.transport_mode === 'packet' && (
                    <section>
                      <h5>{t('estimatedPrice').replace('{0}', this.state.order.package.estimated_price)}</h5>
                    </section>
                  )}
                </div>
              </div>
              <div style={{marginTop: "10px"}}>
                <h4>{t('totalPrice').replace('{0}', self.state.order.total_price)} {this.state.order.transport_mode === 'packet' && (<span className="badge badge-default">{t('additionalTransportFeeds').replace('{0}', this.state.order.package.estimated_price)}</span>)}</h4>
              </div>
              <div style={{marginTop: "10px"}}>
                { this.state.order.transport_mode && this.state.order.transport_mode === 'manual' && this.state.order.status === 'confirmed' && isBuyer && (
                  <button className="btn btn-default" onClick={this.confirmReception}>{t('confirmReception')}</button>
                ) }
                { this.state.order.payment && this.state.order.payment.approval_url && this.state.order.payment.status === 'created' && isBuyer && (
                  <button className="btn btn-default" onClick={this.executePaypal} disabled={this.state.isPaypalLoading && 'disabled'}>
                    { this.state.isPaypalLoading ? (t('loginPaypalProcessing')) : (t('buyWithPaypal')) }
                  </button>
                ) }
                { this.state.order.transport_mode && this.state.order.transport_mode === 'packet' && this.state.order.status === 'confirmed' && this.state.order.payment && this.state.order.payment.status === 'approved' && isSeller && this.state.order.shipment_identification_number && (
                  <button className="btn btn-default" onClick={this.downloadLabel}>{t('downloadLabel')}</button>
                ) }
                { this.state.order.transport_mode && this.state.order.transport_mode === 'packet' && this.state.order.status === 'confirmed' && this.state.order.payment && this.state.order.payment.status === 'approved' && isSeller && !this.state.order.shipment_identification_number && (
                  <NavLink to={'/printlabel/' + this.state.order.id } className="btn btn-default">{t('buyLabel')}</NavLink>
                ) }
              </div>
            </section>
          </div>
        ) }
      </MainLayout>);
    }

    componentDidMount() { // Execute before the render.
      var self = this;
      const {t} = this.props;
      self.refresh();
      self._waitForToken = AppDispatcher.register(function (payload) {
          switch (payload.actionName) {
            case Constants.events.ORDER_UPDATED_ARRIVED:
              ApplicationStore.sendMessage({
                message: t('basketUpdated'),
                level: 'success',
                position: 'bl'
              });
              self.refresh();
            break;
            case Constants.events.ORDER_RECEIVED_ARRIVED:
              ApplicationStore.sendMessage({
                message: t('orderReceived'),
                level: 'success',
                position: 'bl'
              });
              self.refresh();
            break;
            case Constants.events.ORDER_TRANSACTION_RECEIVED_ARRIVED:
              ApplicationStore.sendMessage({
                message: t('orderTransactionApproved'),
                level: 'success',
                position: 'bl'
              });
              self.refresh();
            break;
          }
      });
    }

    componentWillUnmount() { // Remove listener.
        AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Order));
