import React, {Component} from "react";
import { translate } from 'react-i18next';
import { NavLink } from "react-router-dom";
import { ShopsService, UserService } from '../services/index';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Promise from "bluebird";

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

class Information extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.state = {
      isLoading: true,
      user: {},
      shop: {},
      order : {}
    };
  }

  refresh(order) { // Display user + shop information.
    var self = this;
    var requests = [ UserService.getPublicClaims(order.subject), ShopsService.get(order.shop_id) ];
    Promise.all(requests).then(function(res) {
      var claims = res[0]['claims'];
      var shop = res[1]['_embedded'];
      self.setState({
        isLoading: false,
        shop: shop,
        user: claims,
        order: order
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        shop: {},
        user: {},
        order: {}
      });
    });
  }

  render() { // Display the order information.
    var self = this;
    const { t } = self.props;
    var img = "/images/profile-picture.png";
    if (self.state.user.picture && self.state.user.picture !== null) {
      img = self.state.user.picture;
    }

    if (self.state.isLoading) {
      return (<div className="container"><i className="fa fa-spinner fa-spin"></i></div>);
    }

    return (<div className="row">
      <div className="col-md-5">
        { /* Display buyer */ }
        <section>
          <h5>{t('buyer')}</h5>
            <div className="row">
              <div className="col-md-2">
                <img src={img} className="rounded-circle image-small"/>
              </div>
              <div className="col-md-10">
                <p><NavLink to={"/users/" + self.state.user.sub} style={{color: "inherit"}}>{self.state.user.name}</NavLink></p>
              </div>
            </div>
        </section>
        { /* Display shop information */ }
        <section>
          <h5>{t('shop')}</h5>
          <p><NavLink to={"/shops/" + self.state.shop.id + "/view/profile"}  style={{color: "inherit"}}>{self.state.shop.name}</NavLink></p>
        </section>
        { /* Display status */ }
        <section>
          <h5>{t('status')}</h5>
          <span className="badge badge-default">{t('status_' + self.state.order.status)}</span>
        </section>
        { /* Display payment */ }
        { self.state.order.transport_mode === 'packet' && self.state.order.payment && (
          <section>
            <h5>{t('payment')}</h5>
            { self.state.order.payment.payment_method === 'paypal' && (<img src="/images/paypal.png" width="50" />) }
            <p><span className="badge badge-default">{t('payment_status_' + self.state.order.payment.status)}</span></p>
          </section>
        )}
      </div>
      <div className="col-md-7">
        { /* Display transport method */ }
        { self.state.order.transport_mode && self.state.order.transport_mode === 'manual' && (
          <section>
            <h5>{t('transport')}</h5>
            <p>{t('chooseHandToHandTransport')}</p>
          </section>
        ) }
        { self.state.order.transport_mode === 'packet' && (
          <section>
            <h5>{t('transport')}</h5>
            { self.state.order.package.transporter === 'dhl' && (<img src="/images/DHL.png" width="100" />) }
            { self.state.order.package.transporter === 'ups' && (<img src="/images/UPS.png" width="50" />) }
            { (!self.state.order.package.parcel_shop || !self.state.order.package.parcel_shop.id) && (<p>{t('deliveredAtHome')}</p>) }
          </section>
        ) }
        { /* Display buyer & seller address & parcel shop */ }
        { self.state.order.transport_mode === 'packet' && (
          <section>
            <div>
              <h5>{t('buyerAddress')}</h5>
              <p>{self.state.order.package.buyer.address.address_line}, {self.state.order.package.buyer.address.city}, {self.state.order.package.buyer.address.postal_code}, {self.state.order.package.buyer.address.country_code}</p>
            </div>
            <div>
              <h5>{t('sellerAddress')}</h5>
              <p>{self.state.order.package.seller.address.address_line}, {self.state.order.package.seller.address.city}, {self.state.order.package.seller.address.postal_code}, {self.state.order.package.seller.address.country_code}</p>
            </div>
            { /* Display the parcel shop */ }
            { (self.state.order.transport_mode === 'packet' && (self.state.order.package.parcel_shop && self.state.order.package.parcel_shop.id)) && (
              <div>
                <h5>{t('parcelShop')}</h5>
                <p>{self.state.order.package.parcel_shop.address.address_line}, {self.state.order.package.parcel_shop.address.city}, {self.state.order.package.parcel_shop.address.postal_code}, {self.state.order.package.parcel_shop.address.country_code}</p>
                <div style={{width: "100%", height: "200px"}}>
                  <GettingStartedGoogleMap
                    center={self.state.order.package.parcel_shop.location}
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
      </div>
    </div>);
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(Information);
