import React, {Component} from "react";
import { translate } from 'react-i18next';
import { PrintOrderLabelStore, ApplicationStore } from '../stores/index';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { ParcelSize } from '../components/index';

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
    this.previous = this.previous.bind(this);
    this.refresh = this.refresh.bind(this);
    this.buy = this.buy.bind(this);
    this.state = {
      order: null
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
    var order = PrintOrderLabelStore.getOrder();
    var request = {
        alternate_delivery_address: {
          name: order.package.parcel_shop.name,
          address: order.package.parcel_shop.address
        },
        ship_from: {
          name: order.package.buyer.name,
          address: order.package.buyer.address
        },
        shipper: {
          name: order.package.buyer.name,
          address: order.package.buyer.address
        },
        ship_to: {
          name: order.package.seller.name,
          address: order.package.seller.address
        },
        package: order.package.parcel,
        card: order.package.card
    };

    if (this.props.onBuy) {
      this.props.onBuy(request);
    }
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
            { this.state.order.package.transporter === 'ups' && (<img src="/images/UPS.png" width="100" />) }
          </section>
          <section>
            <h5>{t('parcelSize')}</h5>
            <ParcelSize isEditable={false} weight={this.state.order.package.parcel.weight} height={this.state.order.package.parcel.height}
              weight={this.state.order.package.parcel.weight} width={this.state.order.package.parcel.width}/>
          </section>
        </div>
      </div>
      <div>
        <h5>{t('totalPrice').replace('{0}', this.state.order.package.estimated_price)}</h5>
      </div>
      <div>
        <button className="btn btn-default" onClick={this.previous}>{t('previous')}</button>
        <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={this.buy}>{t('buy')}</button>
      </div>
    </div>);
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(Summary);
