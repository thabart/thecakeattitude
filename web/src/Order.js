import React, {Component} from "react";
import { translate } from 'react-i18next';
import { OrdersService, ProductsService, ShopsService, UserService } from './services/index';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import { ApplicationStore } from './stores/index';
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
      this._request = {
        start_index: 0,
        count: defaultCount
      };
      this.changePage = this.changePage.bind(this);
      this.refresh = this.refresh.bind(this);
      this.confirmReception = this.confirmReception.bind(this);
      this.state = {
        isLoading: false,
        pagination: [],
        products: [],
        order: {},
        shop: {},
        user: {}
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
        Promise.all([ ProductsService.search(self._request), UserService.getPublicClaims(order.subject), ShopsService.get(order.shop_id) ]).then(function(res) {
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
            user: {}
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
                  <h5>{t('buyer')}</h5>
                  <div className="row">
                    <div className="col-md-2">
                      <img src={img} className="rounded-circle image-small"/>
                    </div>
                    <div className="col-md-10">
                      <p><NavLink to={"/users/" + this.state.user.sub} style={{color: "inherit"}}>{this.state.user.name}</NavLink></p>
                    </div>
                  </div>
                  <h5>{t('shop')}</h5>
                  <p><NavLink to={"/shops/" + this.state.shop.id + "/view/profile"}  style={{color: "inherit"}}>{this.state.shop.name}</NavLink></p>
                  <h5>{t('status')}</h5>
                  <span className="badge badge-default">{t('status_' + this.state.order.status)}</span>
                  { this.state.order.transport_mode && this.state.order.transport_mode === 'manual' && (
                    <div>
                      <h5>{t('transport')}</h5>
                      <span>{t('chooseHandToHandTransport')}</span>
                    </div>
                  ) }
                  { this.state.order.transport_mode === 'packet' && (
                    <div>
                      <p>{t('choosePackageTransport').replace('{0}', t(this.state.order.package.transporter))}</p>
                      <h5>{t('estimatedPrice').replace('{0}', this.state.order.package.estimated_price)}</h5>
                    </div>
                  )}
                  { this.state.order.transport_mode === 'packet' && !this.state.order.package.parcel_shop && (
                    <h5>{t('deliveredAtHome')}</h5>
                  )}
                  { this.state.order.transport_mode === 'packet' && this.state.order.package.parcel_shop && (
                    <div>
                      <h5>{t('parcelShop')}</h5>
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
                </div>
              </div>
              <div style={{marginTop: "10px"}}>
                <h4>{t('totalPrice').replace('{0}', self.state.order.total_price)} {this.state.order.transport_mode === 'packet' && (<span className="badge badge-default">{t('additionalTransportFeeds').replace('{0}', this.state.order.package.estimated_price)}</span>)}</h4>
              </div>
              <div style={{marginTop: "10px"}}>
                { this.state.order.transport_mode && this.state.order.transport_mode === 'manual' && this.state.order.status === 'confirmed' && isBuyer && (
                  <button className="btn btn-default" onClick={this.confirmReception}>{t('confirmReception')}</button>
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
          }
      });
    }

    componentWillUnmount() { // Remove listener.
        AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Order));
