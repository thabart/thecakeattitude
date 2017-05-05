import React, { Component } from 'react';
import { ShopsService, UserService, CommentsService } from './services';
import { Tooltip, Progress, Alert } from 'reactstrap';
import { withRouter } from 'react-router';
import { MAP } from 'react-google-maps/lib/constants';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { ShopProfile, ShopProducts, ShopServices } from './shopProfile';
import Promise from 'bluebird';
import Rater from 'react-rater';
import './Shop.css';
import 'react-rater/lib/react-rater.css';

class Shop extends Component {
  constructor(props) {
    super(props);
    this.navigateProfile = this.navigateProfile.bind(this);
    this.navigateShops = this.navigateShops.bind(this);
    this.navigateServices = this.navigateServices.bind(this);
    this.toggle = this.toggle.bind(this);
    this.refreshScore = this.refreshScore.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.state = {
      isLoading: false,
      location: {},
      user: null,
      shop: null,
      scores: null,
      nbComments: 0,
      isRatingOpened: false,
      errorMessage : null
    };
  }
  // Toggle the error
  toggleError() {
    this.setState({
      errorMessage : null
    });
  }
  // Navigate to the profile
  navigateProfile(e) {
    e.preventDefault();
    this.props.history.push('/shops/' + this.state.shop.id);
  }
  // Navigate to the shops
  navigateShops(e) {
    e.preventDefault();
    this.props.history.push('/shops/' + this.state.shop.id + '/products');
  }
  // Navigate to the services.
  navigateServices(e) {
    e.preventDefault();
    this.props.history.push('/shops/' + this.state.shop.id + '/services');
  }
  // Toggle score window
  toggle() {
    this.setState({
      isRatingOpened: !this.state.isRatingOpened
    });
  }
  // Update the score
  refreshScore() {
    var self = this;
    ShopsService.searchComments(this.state.shop.id, {}).then(function(commentsResult) {
      var comments = commentsResult['_embedded'],
       average = null,
       scores = null,
       nbComments = 0;

      if (comments) {
        if (!(comments instanceof Array)) {
          comments = [comments];
        }

        var total = 0;
        scores = {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0
        };
        comments.forEach(function(comment) {
          total += comment.score;
          scores[""+comment.score+""] += 1;
        });

        var average = Math.round((total / comments.length) * 1000) / 1000;
        nbComments = comments.length;
      }

      self.setState({
        scores: scores,
        nbComments: nbComments
      });
      self.refs.rater.onRate(average);
    });
  }
  // Render the component
  render() {
    if (this.state.isLoading) {
      return (<div className="container">Loading ...</div>);
    }

    if (this.state.errorMessage !== null) {
      return (<div className="container"><Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert></div>);
    }

    var bannerImage = this.state.shop.banner_image;
    var profileImage = this.state.shop.profile_image;
    var action = this.props.match.params.action;
    var self = this;
    var tags = [];
    var content = (<ShopProfile  user={this.state.user} shop={this.state.shop} onRefreshScore={this.refreshScore} />);
    if (action === "products") {
      content = (<ShopProducts  user={this.state.user} shop={this.state.shop} />);
    } else if (action === "services") {
      content = (<ShopServices user={this.state.user} shop={this.state.shop} /> );
    }

    if (!bannerImage) {
      bannerImage = "/images/default-shop-banner.jpg";
    }

    if (!profileImage) {
      profileImage = "/images/profile-picture.png";
    }

    var ratingSummary = [];
    if (self.state.nbComments > 0) {
      for (var score = 5; score >= 1; score--) {
        var nb = self.state.scores[score];
        var n = 0;
        if (nb > 0) {
          n = (nb / self.state.nbComments) * 100;
        }

        n = Math.round(n);
        ratingSummary.push((<li className="row">
          <div className="col-md-4"><Rater total={5} rating={score} interactive={false} /></div>
          <div className="col-md-6"><Progress value={n} /></div>
          <div className="col-md-2">{nb}</div>
        </li>));
      }
    }

    if (self.state.shop.tags && self.state.shop.tags.length > 0) {
      self.state.shop.tags.forEach(function(tag) {
        tags.push((<li>{tag}</li>));
      });
    }

    return (<div className="container">
      <section className="row white-section shop-section cover">
        <div className="cover-banner">
          <img src={bannerImage} />
        </div>
        <img src={profileImage} className="img-thumbnail profile-img" width="200" height="200" />
        <div className="profile-information">
          <h1>{this.state.shop.name}</h1>
          { this.state.nbComments > 0 ? (
            <div>
              <span id="rating"><Rater total={5} ref="rater" interactive={false} /> {this.state.nbComments} comments</span>
              <Tooltip placement='bottom' className="ratingPopup" isOpen={this.state.isRatingOpened} target="rating" toggle={this.toggle}>
                <ul>
                  {ratingSummary}
                </ul>
              </Tooltip>
              {tags.length > 0 && (
                <ul className="shop-tags">
                  {tags}
                </ul>)
              }
            </div>) : '' }
        </div>
        <ul className="nav nav-pills menu">
          <li className="nav-item">
            <a href="#" className={action !== 'products' && action !== 'services' ? 'nav-link active' : 'nav-link'} onClick={(e) => { this.navigateProfile(e); }}>Profile</a>
          </li>
          <li className="nav-item">
            <a href="#" className={action === 'products' ? 'nav-link active' : 'nav-link'} onClick={(e) => { this.navigateShops(e); }}>Products</a>
          </li>
          <li className="nav-item">
            <a href="#" className={action === 'services' ? 'nav-link active': 'nav-link' } onClick={(e) => {this.navigateServices(e); }}>Services</a>
          </li>
        </ul>
      </section>
      {content}
    </div>);
  }
  // Execute after the render
  componentWillMount() {
    var self = this;
    var shopId = self.props.match.params.id;
    self.setState({
      isLoading: true
    });
    ShopsService.get(shopId).then(function(r) {
      var shop = r['_embedded'];
      UserService.getPublicClaims(shop.subject).then(function(user) {
        self.setState({
          isLoading: false,
          shop: shop,
          user: user
        });
        self.refreshScore();
      });
    }).catch(function(e) {
      var json = e.responseJSON;
      var error = "an error occured while trying to retrieve the shop";
      if (json && json.error_description) {
        error = json.error_description;
      }

      self.setState({
        errorMessage: error,
        isLoading: false
      });
    });
  }
}

export default withRouter(Shop);
