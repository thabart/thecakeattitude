import React, { Component } from 'react';
import { MAP } from 'react-google-maps/lib/constants';
import { CommentsService, UserService } from '../services';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import Promise from 'bluebird';
import moment from 'moment';
import Rater from 'react-rater';
import Constants from '../../Constants';
import './profile.css';

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

class ShopProfile extends Component {
  constructor(props) {
    super(props);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.state = {
      comments: []
    };
  }
  onMapLoad(map) {
    this._googleMap = map;
  }
  render() {
    var comments = [];
    if (this.state.comments) {
      this.state.comments.forEach(function(comment) {
        var date = moment(comment.update_datetime).format('LLL');
        var picture = comment.user.picture;
        if (!picture) {
          picture = "/images/profile-picture.png";
        } else {
          picture = Constants.openIdUrl + picture;
        }

        comments.push((<div className="col-md-6">
          <div className="comment">
            <div className="row header">
              <div className="col-md-3">
                <img src={picture} className="rounded-circle" width="60" height="60" />
              </div>
              <div className="col-md-9">
                <b>{comment.user.name}</b><br />
                {date}<br />
                <Rater total={5} rating={comment.score} interactive={false} /> Score : {comment.score}
              </div>
            </div>
            <div className="content">
              <p>{comment.content}</p>
            </div>
          </div>
        </div>));
      });
    }

    return ( <div>
      <section className="row white-section shop-section shop-section-padding">
        <h5 className="col-md-12">Description</h5>
        <p className="col-md-12">{this.props.shop.description}</p>
      </section>
      <section className="row white-section sub-section shop-section-padding">
        <h5 className="col-md-12">Contact information</h5>
        <div className="row col-md-12">
          <div className="col-md-3 contact">
            <i className="fa fa-envelope fa-3"></i><br />
            <span>{this.props.user.email}</span>
          </div>
          <div className="col-md-3 contact">
            <i className="fa fa-phone fa-3"></i><br />
            <span>{this.props.user.home_phone_number}</span>
          </div>
          <div className="col-md-3 contact">
            <i className="fa fa-mobile fa-3"></i><br />
            <span>{this.props.user.mobile_phone_number}</span>
          </div>
          <div className="col-md-3 contact">
            <i className="fa fa-map-marker fa-3"></i><br />
            <span>{this.props.shop.street_address}</span>
          </div>
        </div>
        <div className="col-md-12 map">
          <GettingStartedGoogleMap
            center={this.props.shop.location}
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
      <section className="row white-section shop-section shop-section-padding">
        <h5 className="col-md-12">Comments</h5>
        <div className="col-md-12">
            <div className="row">
              {comments}
            </div>
        </div>
      </section>
      <section className="row section white-section shop-section  shop-section-padding">
        <h5>Best deals</h5>
      </section>
    </div>);
  }
  componentWillMount() {
    var self = this;
    CommentsService.search({ shop_id: this.props.shop.id }).then(function(obj) {
      var comments = obj['_embedded'];
      if (!(comments instanceof Array)) {
        comments = [ comments ];
      }

      var subjects = [];
      comments.forEach(function(comment) {
        if (subjects.indexOf(comment.subject) === -1) {
          subjects.push(comment.subject);
        }
      });

      var getUserInfos = [];
      subjects.forEach(function(subject) {
        getUserInfos.push(UserService.getPublicClaims(subject));
      });

      Promise.all(getUserInfos).then(function(users) {
        comments.forEach(function(comment) {
          var user = null;
          users.forEach(function(u) {
            if (u.sub == comment.subject) {
              user = u;
              return;
            }
          });

          comment.user = user;
        });

        self.setState({
          comments: comments
        });
      }).catch(function() {

      });
    }).catch(function() {
    });
  }
}

export default ShopProfile;
