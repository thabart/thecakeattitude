import React, { Component } from 'react';
import { ShopsService, UserService } from './services';
import { withRouter } from 'react-router';
import { MAP } from 'react-google-maps/lib/constants';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import Promise from 'bluebird';
import './Shop.css';

const shopOpts = {
  url : '/images/shop-pin.png',
  scaledSize: new window.google.maps.Size(34, 38)
};

const GettingStartedGoogleMap = withGoogleMap(props => {
    return (
      <GoogleMap
        ref={props.onMapLoad}
        center={props.center}
        defaultZoom={12}
      >
      <Marker
        icon={shopOpts}
        position={props.center} />
      </GoogleMap>
    );
});

class Shop extends Component {
  constructor(props) {
    super(props);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.state = {
      isLoading: true,
      shop : null,
      user: null,
      location: {}
    };
  }
  onMapLoad(map) {
    this._googleMap = map;
  }
  render() {
    if (this.state.isLoading) {
      return (<div>Loading ...</div>);
    }

    var bannerImage = this.state.shop.banner_image;
    var profileImage = this.state.shop.profile_image;
    if (!bannerImage) {
      bannerImage = "/images/default-shop-banner.jpg";
    }

    if (!profileImage) {
      profileImage = "/images/profile-picture.png";
    }

    return (  <div className="container">
      <section className="row white-section shop-section cover">
        <div className="cover-banner">
          <img src={bannerImage} />
        </div>
        <img src={profileImage} className="img-thumbnail profile-img" width="200" height="200" />
        <div className="profile-information">
          <h1>{this.state.shop.name}</h1>
        </div>
      </section>
      <section className="row white-section shop-section shop-section-padding">
        <h5 className="col-md-12">Description</h5>
        <p className="col-md-12">{this.state.shop.description}</p>
      </section>
      <section className="row white-section sub-section shop-section-padding">
        <h5 className="col-md-12">Contact information</h5>
        <div className="row col-md-12">
          <div className="col-md-3 contact">
            <i className="fa fa-envelope fa-3"></i><br />
            <span>{this.state.user.email}</span>
          </div>
          <div className="col-md-3 contact">
            <i className="fa fa-phone fa-3"></i><br />
            <span>{this.state.user.home_phone_number}</span>
          </div>
          <div className="col-md-3 contact">
            <i className="fa fa-mobile fa-3"></i><br />
            <span>{this.state.user.mobile_phone_number}</span>
          </div>
          <div className="col-md-3 contact">
            <i className="fa fa-map-marker fa-3"></i><br />
            <span>{this.state.shop.street_address}</span>
          </div>
        </div>
        <div className="col-md-12 map">
          <GettingStartedGoogleMap
            center={this.state.location}
            onMapLoad={this.onMapLoad}
            containerElement={
              <div style={{ height: `100%` }} />
            }
            mapElement={
              <div style={{ height: `100%` }} />
            }>
          </GettingStartedGoogleMap>
        </div>
      </section>
      <section className="row section white-section shop-section  shop-section-padding">
        <h5>Best deals</h5>
      </section>
    </div>);
  }
  componentWillMount() {
    var self = this;
    var shopId = self.props.match.params.id;

    ShopsService.get(shopId).then(function(r) {
      var shop = r['_embedded'];
      UserService.getPublicClaims(shop.subject).then(function(cl) {
        self.setState({
          isLoading: false,
          shop: shop,
          location: shop.location,
          user: cl
        });
      }).catch(function() {
        self.props.history.push('/error/internal');
      });
    }).catch(function() {
      self.props.history.push('/error/404');
    });
  }
}

export default withRouter(Shop);
