import React, { Component } from 'react';
import { ShopsService, UserService, CommentsService } from './services';
import { Tooltip, Progress } from 'reactstrap';
import { withRouter } from 'react-router';
import { MAP } from 'react-google-maps/lib/constants';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { ShopProfile, ShopProducts } from './shopProfile';
import Promise from 'bluebird';
import Rater from 'react-rater';
import './Shop.css';
import 'react-rater/lib/react-rater.css';

class Shop extends Component {
  constructor(props) {
    super(props);
    this.navigateProfile = this.navigateProfile.bind(this);
    this.navigateShops = this.navigateShops.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isLoading: true,
      location: {},
      user: null,
      shop: null,
      averageScore: null,
      scores: null,
      nbComments: 0,
      isRatingOpened: false
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
  toggle() {
    this.setState({
      isRatingOpened: !this.state.isRatingOpened
    });
  }
  render() {
    if (this.state.isLoading) {
      return (<div>Loading ...</div>);
    }

    var bannerImage = this.state.shop.banner_image;
    var profileImage = this.state.shop.profile_image;
    var action = this.props.match.params.action;
    var self = this;
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
              <span id="rating"><Rater total={5} rating={this.state.averageScore} interactive={false} /> {this.state.nbComments} comments</span>
              <Tooltip placement='bottom' className="ratingPopup" isOpen={this.state.isRatingOpened} target="rating" toggle={this.toggle}>
                <ul>
                  {ratingSummary}
                </ul>
              </Tooltip>
            </div>) : '' }
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
      Promise.all([UserService.getPublicClaims(shop.subject), CommentsService.search({ shop_id: shopId })]).then(function(r) {
        var user = r[0],
         commentsResult = r[1],
         comments = commentsResult['_embedded'],
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
          isLoading: false,
          shop: shop,
          user: user,
          averageScore: average,
          scores: scores,
          nbComments: nbComments
        });
      }).catch(function() {
        self.props.history.push('/error/internal');
      });
    }).catch(function(e) {
      self.props.history.push('/error/404');
    });
  }
}

export default withRouter(Shop);
