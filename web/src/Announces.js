import React, {Component} from "react";
import {Alert, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import {AnnouncementsService, UserService} from './services/index';
import Constants from '../Constants';
import './announces.css';

const announceOpts = {
    url: '/images/service-pin.png',
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
                icon={announceOpts}
                position={props.center}/>
        </GoogleMap>
    );
});

class Announces extends Component {
  constructor(props) {
    super(props);
    this._googleMap = null;
    this.closeError = this.closeError.bind(this);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.state = {
      isLoading: false,
      errorMessage: null,
      user : null,
      announce: null
    };
  }
  onMapLoad(map) {
      this._googleMap = map;
  }
  closeError() {
    this.setState({
      errorMessage: null
    });
  }
  refresh() {
    var self = this,
      id = self.props.match.params.id;
    self.setState({
      isLoading: true
    });
    AnnouncementsService.get(id).then(function(announceResult) {
      var announceEmbedded = announceResult['_embedded'];
      UserService.getPublicClaims(announceEmbedded.subject).then(function(userResult) {
        self.setState({
          isLoading: false,
          user: userResult,
          announce: announceEmbedded
        });
      }).catch(function() {
        self.setState({
          errorMessage: 'An error occured while trying to fetch the announce',
          isLoading: false
        });
      });
    }).catch(function() {
      self.setState({
        errorMessage: 'An error occured while trying to fetch the announce',
        isLoading: false
      });
    });
  }
  render() {
    if (this.state.isLoading) {
      return (<div className="container">Loading ...</div>);
    }

    if (this.state.errorMessage !== null) {
        return (<div className="container"><Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert></div>);
    }

    var img = "/images/profile-picture.png";
    if (this.state.user.picture && this.state.user.picture !== null) {
      img = this.state.user.picture;
    }

    return (<div className="container">
      <section className="white-section">
          <Breadcrumb>
              <BreadcrumbItem>{this.state.user.name}</BreadcrumbItem>
              <BreadcrumbItem active>{this.state.announce.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="row col-md-12 m-2 announce-container">
            <div className="col-md-8 p-1">
              <div className="row p-1">
                <div className="col-md-12">
                  <h3 className="title">{this.state.announce.name}</h3>
                </div>
              </div>
              <div className="row p-1">
                <div className="col-md-12">
                  { this.state.announce.category && this.state.announce.category !== null ? (
                    <p>The category is <i>{this.state.announce.category.name}</i></p>
                  ) : (<p>No category</p>) }
                </div>
              </div>
              <div className="row p-1">
                <div className="col-md-12">
                  <p>{this.state.announce.description}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 p1">
              <div className="row p-1">
                <div className="col-md-2">
                  <img src={img} className="rounded-circle image-small"/>
                </div>
                <div className="col-md-10">
                  <h5>{this.state.user.name}</h5>
                </div>
              </div>
              <h4 className="price">Estimation <i>€ 300</i></h4>
              <h5>Contact me</h5>
              <ul className="list-group">
                {this.state.user.email && this.state.user.email !== null && (
                  <li className="list-group-item justify-content-between">
                    {this.state.user.email}
                    <i className="fa fa-envelope fa-3"></i>
                  </li>
                )}
                {this.state.user.home_phone_number && this.state.user.home_phone_number !== null && (
                  <li className="list-group-item justify-content-between">
                    {this.state.user.home_phone_number}
                    <i className="fa fa-phone fa-3"></i>
                  </li>
                )}
                {this.state.user.mobile_phone_number && this.state.user.mobile_phone_number !== null && (
                  <li className="list-group-item justify-content-between">
                    {this.state.user.mobile_phone_number}
                    <i className="fa fa-mobile fa-3"></i>
                  </li>
                )}
              </ul>
              <h5>Address</h5>
              <i>{this.state.announce.street_address}</i>
              <div className='map-announce'>
                  <GettingStartedGoogleMap
                      onMapLoad={this.onMapLoad}
                      center={this.state.announce.location}
                      containerElement={
                          <div style={{height: `100%`}}/>
                      }
                      mapElement={
                          <div style={{height: `100%`}}/>
                      }>
                  </GettingStartedGoogleMap>
              </div>
            </div>
          </div>
      </section>
    </div>);
  }
  componentWillMount() {
    this.refresh();
  }
}

export default Announces;
