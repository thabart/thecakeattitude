import React, { Component } from 'react';
import { ShopsService } from './services';
import { withRouter } from 'react-router';
import './Shop.css';

class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      shop : null
    };
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
      <section className="row section cover">
        <div className="cover-banner">
          <img src={bannerImage} />
        </div>
        <img src={profileImage} className="img-thumbnail profile-img" width="200" height="200" />
        <div className="profile-information">
          <h1>{this.state.shop.name}</h1>
        </div>
      </section>
      <section className="row section section-description">
        <h5 className="col-md-12">Description</h5>
        <p className="col-md-12">{this.state.shop.description}</p>
      </section>
      <section className="row sub-section section-description">
        <h5>Contact information</h5>
        <table>

        </table>
      </section>
      <section className="row section section-descritpion">
        <h5>Best deals</h5>
      </section>
    </div>);
  }
  componentWillMount() {
    var self = this;
    var shopId = self.props.match.params.id;
    ShopsService.get(shopId).then(function(r) {
      var shop = r['_embedded'];
      self.setState({
        isLoading: false,
        shop: shop
      });
    }).catch(function() {
      self.props.history.push('/error/404');
    });
  }
}

export default withRouter(Shop);
