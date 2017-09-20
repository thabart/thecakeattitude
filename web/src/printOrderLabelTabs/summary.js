import React, {Component} from "react";
import { translate } from 'react-i18next';
import { PrintOrderLabelStore, ApplicationStore } from '../stores/index';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { ParcelSize } from '../components/index';
import { OrdersService } from '../services/index';
import { UrlParser } from '../utils/index';

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
    this._paypalOpened = false;
    this._windowPaypal = null;
    this.previous = this.previous.bind(this);
    this.refresh = this.refresh.bind(this);
    this.buy = this.buy.bind(this);
    this.state = {
      order: null,
      isPaypalLoading: false
    };
  }

  previous() { // Execute when the user clicks on previous.
    if (this.props.onPrevious) {
      this.props.onPrevious();
    }
  }

  refresh() { // Refresh the summary.
    var self = this;
    var order = PrintOrderLabelStore.getOrder();
    self.setState({
      order: order
    });
  }

  buy() { // Buy the label.
    var self = this;
    if (self._windowPaypal && self._windowPaypal.isClosed == false) return;
    var order = PrintOrderLabelStore.getOrder();
    var request = {
      package: order.package.parcel
    };
    self.setState({
      isPaypalLoading: true
    });
    const {t} = self.props;
    OrdersService.purchaseLabel(order.id, request).then(function(r) {
      var approvalUrl = r['approval_url'];
      self._windowPaypal = window.open(approvalUrl, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=400');
      var isProcessing = false;
      var interval = setInterval(function() {
          if (isProcessing) return;
          if (self._windowPaypal.closed) {
              clearInterval(interval);
              return;
          }

          var href = null;
          try
          {
            href = self._windowPaypal.location.href;
          }
          catch(ex) { return; }
          var paymentId = UrlParser.getParameterByName('paymentId', href);
          var payerId = UrlParser.getParameterByName('PayerID', href);
          if (!paymentId && !payerId) {
            return;
          }

          isProcessing = true;
          OrdersService.confirmLabel(self.state.order.id, {
            payer_id: payerId,
            transaction_id: paymentId
          }).then(function() {
            self.setState({
              isPaypalLoading: false
            });
            self._windowPaypal.close();
          }).catch(function(e) {
            var errorMsg = t('orderPurchaseLabelError');
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
          });
          /*
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
          */
      });
    }).catch(function(e) {
      const {t} = self.props;
      var errorMsg = t('orderPurchaseLabelError');
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
    });

    /*
    if (this.props.onBuy) {
      this.props.onBuy();
    }
    */
  }

  render() { // Display the component.
    const {t} = this.props;
    if (!this.state.order) {
      return (<span></span>);
    }

    return (<div>
      <div className="row" style={{padding: "10px"}}>
        <div className="col-md-8">
          { /* Buyer Address */ }
          <section>
            <h5>{t('buyerAddress')}</h5>
            <p>{this.state.order.package.buyer.address.address_line}, {this.state.order.package.buyer.address.city}, {this.state.order.package.buyer.address.postal_code}, {this.state.order.package.buyer.address.country_code}</p>
          </section>
          { /* Seller Address */ }
          <section>
            <h5>{t('sellerAddress')}</h5>
            <p>{this.state.order.package.seller.address.address_line}, {this.state.order.package.seller.address.city}, {this.state.order.package.seller.address.postal_code}, {this.state.order.package.seller.address.country_code}</p>
          </section>
          { /* Parcel shop Address */ }
          <section>
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
          </section>
        </div>
        <div className="col-md-4">
          <section>
            <h5>{t('transport')}</h5>
            { this.state.order.package.transporter === 'dhl' && (<img src="/images/DHL.png" width="100" />) }
            { this.state.order.package.transporter === 'ups' && (<img src="/images/UPS.png" width="50" />) }
          </section>
          <section>
            <h5>{t('parcelSize')}</h5>
            <ParcelSize isEditable={false} weight={this.state.order.package.parcel.weight} height={this.state.order.package.parcel.height}
              length={this.state.order.package.parcel.length} width={this.state.order.package.parcel.width}/>
          </section>
        </div>
      </div>
      <div>
        <h5>{t('totalPrice').replace('{0}', this.state.order.package.estimated_price)}</h5>
      </div>
      <div>
        <button className="btn btn-default" onClick={this.previous}>{t('previous')}</button>
        <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={this.buy} disabled={this.state.isPaypalLoading && 'disabled'}>
          { this.state.isPaypalLoading ? (t('loginPaypalProcessing')) : (t('buyWithPaypal')) }
        </button>
      </div>
    </div>);
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(Summary);
