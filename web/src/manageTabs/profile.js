import React, {Component} from "react";
import Promise from "bluebird";
import {UserService, GoogleMapService} from '../services/index';
import {Alert} from 'reactstrap';
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import Constants from '../../Constants';
import './profile.css';
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
  save() {
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
  handleInputChange(e) {
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
  uploadPicture(e) {
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
  onMapLoad(map) {
    this._googleMap = map;
  }
  closeError() {
    this.setState({
      errorMessage: null
    });
  }
  closeSuccess() {
    this.setState({
      successMessage: null
    });
  }
  refresh() {
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
  onSearchBoxCreated(searchBox) {
    this._searchBox = searchBox;
  }
  onPlacesChanged() {
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
  render() {
    if (this.state.isLoading) {
      return (<div><i className="fa fa-spinner fa-spin"></i></div>);
    }

    var isInvalid = this.state.isEmailInvalid || this.state.isMobilePhoneInvalid || this.state.isHomePhoneInvalid;
    var optsActions = {};
    if (isInvalid) {
        optsActions['disabled'] = 'disabled';
    }

    return (<div className="container manage-container">
      <h1>Manage profile</h1>
      <Alert color="success" isOpen={this.state.successMessage !== null} toggle={this.closeSuccess}>{this.state.successMessage}</Alert>
      <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert>
      <div className="form-group">
        <label>Displayed name</label>
        <input type="text" value={this.state.user.name} name="name" onChange={this.handleInputChange} className="form-control" />
      </div>
      <div className="form-group">
        <label>Picture</label><br />
        <input type='file' accept='image/*' onChange={(e) => this.uploadPicture(e)}/><br />
        <img src={this.state.picture}  width='50' height='50' />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="text" value={this.state.user.email} name="email" onChange={this.handleInputChange} className="form-control" />
        { this.state.isEmailInvalid && (<span className="invalid-description">The email is invalid</span>) }
      </div>
      <div className="form-group">
        <label>Home phone number</label>
        <input type="text" value={this.state.user.home_phone_number} name="home_phone_number" onChange={this.handleInputChange} className="form-control" />
        { this.state.isHomePhoneInvalid && (<span className="invalid-description">The home phone is invalid</span>) }
      </div>
      <div className="form-group">
        <label>Mobile phone number</label>
        <input type="text" value={this.state.user.mobile_phone_number} name="mobile_phone_number" onChange={this.handleInputChange} className="form-control" />
        { this.state.isMobilePhoneInvalid && (<span className="invalid-description">The mobile phone is invalid</span>) }
      </div>
      <div className="form-group">
        <label>Address</label>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
                <div className='form-group col-md-12'>
                  <label className='control-label'>Street address</label>
                  <input type='text' className='form-control' name='street_address' value={this.state.address.street_address} readOnly/>
                </div>
                <div className='form-group col-md-12'>
                  <label className='control-label'>Postal code</label>
                  <input type='text' className='form-control' name='street_address' value={this.state.address.postal_code} readOnly/>
                </div>
                <div className='form-group col-md-12'>
                  <label className='control-label'>Locality</label>
                  <input type='text' className='form-control' name='street_address' value={this.state.address.locality} readOnly/>
                </div>
                <div className='form-group col-md-12'>
                  <label className='control-label'>Country</label>
                  <input type='text' className='form-control' name='country' value={this.state.address.country} readOnly/>
                </div>
            </div>
          </div>
          <div className="col-md-6">
            <GettingStartedGoogleMap
              onMapLoad={this.onMapLoad}
              center={this.state.location}
              onPlacesChanged={this.onPlacesChanged}
              onSearchBoxCreated={this.onSearchBoxCreated}
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
      <div className="form-group">
        {this.state.isUpdating ? (
          <button className="btn btn-success" disabled><i className='fa fa-spinner fa-spin'></i>Processing update ...</button>
        ) : (
          <button className="btn btn-success" onClick={this.save} {...optsActions}>Update</button>
        )}
      </div>
    </div>);
  }
  componentDidMount() {
    this.refresh();
  }
}

export default ManageProfile;
