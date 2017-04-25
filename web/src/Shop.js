import React, { Component } from 'react';
import { ShopsService, UserService } from './services';
import { withRouter } from 'react-router';
import { MAP } from 'react-google-maps/lib/constants';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import Promise from 'bluebird';
import { ShopProfile, ShopProducts } from './shopProfile';
import './Shop.css';

class Shop extends Component {
  constructor(props) {
    super(props);
    this.navigateProfile = this.navigateProfile.bind(this);
    this.navigateShops = this.navigateShops.bind(this);
    this.state = {
      isLoading: true,
      location: {},
      user: null,
      shop: null
    };
  }
  navigateProfile(e) {
    e.preventDefault();
    this.props.history.push('/shops/' + this.state.shop.id);
  }
  navigateShops(e) {
    e.preventDefault();
    this.props.history.push('/shops/' + this.state.shop.id + '/products');
  }
  render() {
    if (this.state.isLoading) {
      return (<div>Loading ...</div>);
    }

    var bannerImage = this.state.shop.banner_image;
    var profileImage = this.state.shop.profile_image;
    var action = this.props.match.params.action;
    var content = (<ShopProfile  user={this.state.user} shop={this.state.shop} />);
    if (action === "products") {
      content = (<ShopProducts  user={this.state.user} shop={this.state.shop} />);
    }

    if (!bannerImage) {
      bannerImage = "/images/default-shop-banner.jpg";
    }

    if (!profileImage) {
      profileImage = "/images/profile-picture.png";
    }

    return (<div className="container">
      <section className="row white-section shop-section cover">
        <div className="cover-banner">
          <img src={bannerImage} />
        </div>
        <img src={profileImage} className="img-thumbnail profile-img" width="200" height="200" />
        <div className="profile-information">
          <h1>{this.state.shop.name}</h1>
        </div>
        <ul className="nav nav-pills menu">
          <li className="nav-item">
            <a href="#" className={action !== 'products' ? 'nav-link active' : 'nav-link'} onClick={(e) => { this.navigateProfile(e); }}>Profile</a>
          </li>
          <li className="nav-item">
            <a href="#" className={action === 'products' ? 'nav-link active' : 'nav-link'} onClick={(e) => { this.navigateShops(e); }}>Products</a>
          </li>
        </ul>
      </section>
      {content}
    </div>);
  }
  componentWillMount() {
    var self = this;
    var shopId = self.props.match.params.id;
    ShopsService.get(shopId).then(function(r) {
      var shop = r['_embedded'];
      UserService.getPublicClaims(shop.subject).then(function(user) {
        self.setState({
          isLoading: false,
          shop: shop,
          user: user
        });
      }).catch(function(e) {
        self.props.history.push('/error/internal');
      });
    }).catch(function(e) {
      self.props.history.push('/error/404');
    });
  }
}

export default withRouter(Shop);
