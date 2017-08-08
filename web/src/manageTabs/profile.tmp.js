import React, {Component} from "react";
import { UserService, GoogleMapService } from '../services/index';
import { Alert } from 'reactstrap';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { translate } from 'react-i18next';
import Promise from "bluebird";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import Constants from '../../Constants';
import $ from 'jquery';

const currentLocationOpts = {
    url: '/images/current-location.png',
    scaledSize: new window.google.maps.Size(20, 20)
};

const INPUT_STYLE = {
    boxSizing: `border-box`,
    MozBoxSizing: `border-box`,
    border: `1px solid transparent`,
    width: `300px`,
    height: `40px`,
    marginTop: `10px`,
    padding: `0 12px`,
    borderRadius: `1px`,
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
    fontSize: `14px`,
    outline: `none`,
    textOverflow: `ellipses`,
};

const GettingStartedGoogleMap = withGoogleMap(props => {
    return (
        <GoogleMap
            ref={props.onMapLoad}
            center={props.center}
            defaultZoom={12}
        >
          <SearchBox
            ref={props.onSearchBoxCreated}
            bounds={props.bounds}
            onPlacesChanged={props.onPlacesChanged}
            inputPlaceholder="Enter your address" controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
            inputStyle={INPUT_STYLE}/>
          <Marker
            icon={currentLocationOpts}
            position={props.center}/>
        </GoogleMap>
    );
});

class ManageProfile extends Component {
  constructor(props) {
    super(props);
    this._googleMap = null;
    this._searchBox = null;
    this._hasImageChanged = false;
    this.save = this.save.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.uploadPicture = this.uploadPicture.bind(this);
    this.closeError = this.closeError.bind(this);
    this.closeSuccess = this.closeSuccess.bind(this);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.onPlacesChanged = this.onPlacesChanged.bind(this);
    this.onSearchBoxCreated = this.onSearchBoxCreated.bind(this);
    this.state = {
      isLoading: false,
      errorMessage: null,
      successMessage: null,
      user: {},
      picture: null,
      location: {},
      address: {},
      isUpdating: false,
      isEmailInvalid: false,
      isMobilePhoneInvalid: false,
      isHomePhoneInvalid: false
    };
  }

  save() { // Save the profile.
    var self = this,
      user = this.state.user,
      address = this.state.address;
    var result = $.extend({}, {
      email: user.email,
      home_phone_number: user.home_phone_number,
      mobile_phone_number: user.mobile_phone_number,
      name: user.name
    }, address);
    self.setState({
        isUpdating: true
    });
    var promises = [];
    if (this._hasImageChanged) {
      promises.push(UserService.updateImage(this.state.picture));
    }

    promises.push(UserService.updateClaims(result));
    Promise.all(promises).then(function() {
      self.setState({
        isUpdating: false,
        successMessage: 'Account has been updated'
      });
    }).catch(function() {
      self.setState({
        isUpdating: false,
        errorMessage: 'An error occured while trying to update the user'
      });
    });
  }

  handleInputChange(e) { // Handle the input change.
    var self = this;
    const target = e.target;
    const name = target.name;
    var isEmailInvalid = false,
        isMobilePhoneInvalid = false,
        isHomePhoneInvalid = false;
    switch (name) {
      case "email":
        var regex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$");
        if (!regex.test(target.value)) {
          isEmailInvalid = true;
        }
        break;
        case "mobile_phone_number":
        case "home_phone_number":
          var regex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
          if (!regex.test(target.value)) {
            if (name == "mobile_phone_number") {
              isMobilePhoneInvalid = true;
            } else {
              isHomePhoneInvalid = true;
            }
          }
          break;
      }

      var user = this.state.user;
      user[name] = target.value;
      self.setState({
        isEmailInvalid: isEmailInvalid,
        isMobilePhoneInvalid: isMobilePhoneInvalid,
        isHomePhoneInvalid: isHomePhoneInvalid,
        user: user
      });
  }

  uploadPicture(e) { // Upload the picture.
    e.preventDefault();
    var self = this;
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
      self._hasImageChanged = true;
      self.setState({
        picture: reader.result
      });
    };
    reader.readAsDataURL(file);
  }

  onMapLoad(map) { // Store google map reference.
    this._googleMap = map;
  }

  closeError() { // Close error message.
    this.setState({
      errorMessage: null
    });
  }

  closeSuccess() { // Close success message.
    this.setState({
      successMessage: null
    });
  }

  refresh() { // Refresh the profile informatin.
    var self = this;
    self.setState({
      isLoading: true
    });
    UserService.getClaims().then(function(userResult) {
      var picture = "/images/profile-picture.png";
      if (userResult.picture) {
        picture = userResult.picture;
      }

      self.setState({
        user: userResult,
        isLoading: false,
        picture: picture,
        location: {lat: 50.8503, lng: 4.3517}
      });

      if (userResult.google_place_id) {
        GoogleMapService.getPlaceByPlaceId(userResult.google_place_id).then(function(adr) {
          var a = adr.adr;
          a.google_place_id = adr.place_id;
          self.setState({
            location: adr.geometry.location,
            address: a
          });
        });
      }
    }).catch(function(e) {
      self.setState({
        isLoading: false,
        errorMessage: 'An error occured while trying to retrieve the user information'
      });
    });
  }

  onSearchBoxCreated(searchBox) { // Store search box reference.
    this._searchBox = searchBox;
  }

  onPlacesChanged() { // Execute when the place has changed.
    var self = this;
    const places = self._searchBox.getPlaces();
    var firstPlace = places[0];
    GoogleMapService.getPlaceByPlaceId(firstPlace.place_id).then(function(adr) {
      var a = adr.adr;
      a.google_place_id = adr.place_id;
      self.setState({
        address: a,
        location: adr.geometry.location
      });
    }).catch(function(e) {
      console.log(e);
    });
  }

  render() { // Display profile.
    if (this.state.isLoading) {
      return (<div><i className="fa fa-spinner fa-spin"></i></div>);
    }

    const {t} = this.props;
    var bannerImage = "/images/default-shop-banner.jpg";
    var isInvalid = this.state.isEmailInvalid || this.state.isMobilePhoneInvalid || this.state.isHomePhoneInvalid;
    var optsActions = {};
    if (isInvalid) {
        optsActions['disabled'] = 'disabled';
    }

    return (<div className="container">
      <Alert color="success" isOpen={this.state.successMessage !== null} toggle={this.closeSuccess}>{this.state.successMessage}</Alert>
      <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert>
      { /* Header */ }
      <section className="row cover">
          { /* Cover banner */ }
          <div className="cover-banner">
              <img src={bannerImage}/>
          </div>
          { /* Profile picture */ }
          <div className="profile-img">
              <img src={this.state.picture} className="img-thumbnail" />
          </div>
          { /* Profile information */ }
          <div className="profile-information">
              <h1>{this.state.user.name}</h1>
          </div>
      </section>
      { /* Contact information */ }
      <section className="section row" style={{marginTop: "20px", paddingTop: "20px"}}>
        <div className="col-md-12">
          <h5>{t('contactInformation')}</h5>
          <div className="row">
            { /* Email */ }
            <div className="col-md-3 shop-badge">
              <i className="fa fa-envelope fa-3 icon"></i><br />
              <span>{this.state.user.email}</span>
            </div>
            { /* Home phone */ }
            <div className="col-md-3 shop-badge">
              <i className="fa fa-phone fa-3 icon"></i><br />
              <span>{this.state.user.home_phone_number}</span>
            </div>
            { /* Mobile phone */ }
            <div className="col-md-3 shop-badge">
              <i className="fa fa-mobile fa-3 icon"></i><br />
              <span>{this.state.user.mobile_phone_number}</span>
            </div>
            { /* Address */ }
            <div className="col-md-3 shop-badge">
              <i className="fa fa-map-marker fa-3 icon"></i><br />
              <span>TO COMPLETE</span>
            </div>
          </div>
        </div>
      </section>
    </div>);
  }

  componentDidMount() { // Execute before the render.
    this.refresh();
  }
}

export default translate('common', { wait: process && !process.release })(ManageProfile);
