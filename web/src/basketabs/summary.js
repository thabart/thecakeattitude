import React, {Component} from "react";
import { translate } from 'react-i18next';
import { BasketStore } from '../stores/index';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { ProductsService } from '../services/index';
import { Button, UncontrolledTooltip, Badge } from 'reactstrap';
import { ParcelSize } from '../components/index';
import { NavLink } from "react-router-dom";
import Constants from '../../Constants';

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

class Summary extends Component {
  constructor(props) {
    super(props);
    this._page = '1';
    this._request = {
      start_index: 0,
      count: defaultCount
    };
    this.previous = this.previous.bind(this);
    this.confirm = this.confirm.bind(this);
    this.refresh = this.refresh.bind(this);
    this.changePage = this.changePage.bind(this);
    this.state = {
      isLoading: false,
      products: [],
      pagination: [],
      order: {}
    };
  }

  changePage(e, page) { // Change the page.
      e.preventDefault();
      this._page = page;
      this._request['start_index'] = (page - 1) * defaultCount;
      this.refresh();
  }

  previous() { // Execute when the user clicks on previous.
    if (this.props.onPrevious) {
      this.props.onPrevious();
    }
  }

  confirm() { // Execute when the user clicks on "confirm".
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }

  refresh() { // Refresh the summary.
    var self = this;
    var selectedOrderId = BasketStore.getSelectedOrderId();
    var orders = BasketStore.getOrders();
    var order = orders.filter(function(o) { return o.id === selectedOrderId; })[0];
    if (!order) {
      return;
    }

    var productIds = order.lines.map(function(line) { return line.product_id; });
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
        pagination: pagination,
        order: order
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        products: [],
        pagination: [],
        order: order
      });
    });

  }

  render() { // Display the component.
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

        var discount = orderLine['discount'];
        products.push((<li className="list-group-item">
          <div className="col-md-2"><img src={productImage} width="40" /></div>
          <div className="col-md-4">
            <NavLink to={"/products/" + product.id} className="no-decoration red" href="#"><h4>{product.name}</h4></NavLink>
            <p>
              {t('oneUnitEqualTo').replace('{0}', product.quantity + ' ' + t(product.unit_of_measure))}
            </p>
            {!discount || discount === null && (
              <p>
                {t('pricePerUnit').replace('{0}', '€ ' + product.price)}
              </p>
            )}
            {discount && (
              <p dangerouslySetInnerHTML={{__html: t('pricePerUnitWithDiscount').replace('{0}', '€ ' + product.price).replace('{1}', '€ ' + (product.price - discount.money_saved))}}></p>
            )}
            <p>
              {t('availableInStock').replace('{0}', product.available_in_stock)}
            </p>
            {discount && (
              <p>{t('discount')} : <h5 className="inline">
                      <Badge color="success">
                        { discount.type === 'amount' && (<i style={{color: "white"}} className="ml-1">- € {discount.value}</i>) }     
                        { discount.type === 'percentage' && (<i style={{color: "white"}} className="ml-1">- % {discount.value}</i>) }                   
                      </Badge>
                  </h5>
              </p>
            )}
          </div>
          <div className="col-md-3">
            <h4>€ {orderLine.price}</h4>
          </div>
          <div className="col-md-3">{orderLine.quantity}</div>
        </li>));
      });
    }

    return (
      <div className="container rounded">
        { this.state.isLoading ? (<i className='fa fa-spinner fa-spin' /> ) : (
          <div>
            <p>{t('summaryTabDescription')}</p>
            <section className="row">
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
                )}
                { /* Display pagination */ }
                {pagination.length > 0 && (<ul className="pagination">
                    {pagination}
                </ul>)}
              </div>
              <div className="col-md-4">
                { /* Display transport mode */ }
                { this.state.order.transport_mode === 'manual' && (
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
                { /* Display parcel type */ }
                { this.state.order.transport_mode === 'packet' && (
                <div>
                  <h5>
                    {t('parcelSize')} <i className="fa fa-info-circle txt-info" id="parcelSizeTooltip"/>
                    <UncontrolledTooltip placement="right" target="parcelSizeTooltip" className="red-tooltip-inner">{t('parcelSizeTooltipInformation')}</UncontrolledTooltip>
                  </h5>
                  <ParcelSize isEditable={false} height={Constants.maxPackageSize.height} length={Constants.maxPackageSize.length} width={Constants.maxPackageSize.width} />
                </div>
                )}
                { /* Display parcel shop */ }
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
                ) }
                { /* Display the price */ }
                { this.state.order && this.state.order.package && (
                  <section>
                    <h5>{t('estimatedPrice').replace('{0}', this.state.order.package.estimated_price)}</h5>
                  </section>
                ) }
              </div>
            </section>
            <section style={{marginTop: "10px"}}>
              <h4>{t('totalPrice').replace('{0}', self.state.order.total_price)} {this.state.order.transport_mode === 'packet' && (<span className="badge badge-default">{t('additionalTransportFeeds').replace('{0}', this.state.order.package.estimated_price)}</span>)}</h4>
            </section>
            <section style={{marginTop: "10px"}}>
              <Button color="default" onClick={this.previous} >{t('previous')}</Button>
              <Button color="default" onClick={this.confirm} style={{marginLeft: "5px"}}>{t('confirm')}</Button>
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

export default translate('common', { wait: process && !process.release, withRef: true })(Summary);
