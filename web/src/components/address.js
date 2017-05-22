import React, {Component} from "react";
import {Tooltip} from "reactstrap";
import {CategoryService, SessionService, OpenIdService, UserService, GoogleMapService} from "../services/index";
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import {MAP} from "react-google-maps/lib/constants";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import Constants from "../../Constants";
import $ from "jquery";
import './address.css';

const INPUT_STYLE = {
    boxSizing: `border-box`,
    MozBoxSizing: `border-box`,
    border: `1px solid transparent`,
    width: `350px`,
    height: `32px`,
    marginTop: `10px`,
    padding: `0 12px`,
    borderRadius: `1px`,
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
    fontSize: `14px`,
    outline: `none`,
    textOverflow: `ellipses`,
};

const GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={props.zoom}
        center={props.center}
        ref={props.onMapLoad}
    >
        <SearchBox
            ref={props.onSearchBoxCreated}
            bounds={props.bounds}
            onPlacesChanged={props.onPlacesChanged}
            inputPlaceholder="Enter your address" controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
            inputStyle={INPUT_STYLE}
        />
        {props.currentLocation &&
        <Marker position={props.currentLocation} title='Current location'>
        </Marker>
        }
    </GoogleMap>
));

class Address extends Component {
    constructor(props) {
        super(props);
        this.onMapLoad = this.onMapLoad.bind(this);
        this.onSearchBoxCreated = this.onSearchBoxCreated.bind(this);
        this.onPlacesChanged = this.onPlacesChanged.bind(this);
        this.state = {
            zoom: 12,
            placeId: null,
            center: null,
            bounds: null,
            centerContent: null,
            currentLocation: null,
            address: {
                postal_code: "",
                locality: "",
                country: "",
                street_address: ""
            }
        }
    }

    onMapLoad(map) {
        this._googleMap = map;
    }

    onSearchBoxCreated(searchBox) {
        this._searchBox = searchBox;
    }

    onPlacesChanged() {
        var self = this;
        const places = this._searchBox.getPlaces();
        var enableNext = function (b) {
            if (self.props.addressCorrect) self.props.addressCorrect(b);
            self.setState({
                isAddressCorrect: b
            });
        };
        // Only one address should be returned.
        if (places.length !== 1) {
            if (self.props.onError) self.props.onError('The address must be unique !');
            enableNext(false);
            return;
        }

        var firstPlace = places[0];
        var url = Constants.googleMapUrl + '/geocode/json?key=' + Constants.googleMapKey + '&place_id=' + firstPlace.place_id;
        if (self.props.onLoading) self.props.onLoading(true);
        GoogleMapService.getPlaceByPlaceId(firstPlace.place_id).then(function(adr) {
          adr.adr.place_id = firstPlace.place_id;
          var location = firstPlace.geometry.location;
          self.setState({
              center: location,
              isAddressCorrect: true,
              currentLocation: location,
              address: adr.adr,
              placeId: firstPlace.place_id
          });
          if (self.props.onLoading) self.props.onLoading(false);
          if (!adr.adr.postal_code || !adr.adr.locality || !adr.adr.country || !adr.adr.street_address) {
              if (self.props.onError) self.props.onError('The address should be complete !');
              enableNext(false);
          } else {
              enableNext(true);
          }
        }).catch(function() {
          if (self.props.onError) self.props.onError('The address details cannot be fetched');
          if (self.props.onLoading) self.props.onLoading(false);
          enableNext(false);
        });
    }

    display() {
        var self = this;
        setTimeout(function () {
            const mapInstance = self._googleMap.context[MAP];
            window.google.maps.event.trigger(mapInstance, 'resize');
        }, 1000);
    }

    getAddress() {
      var json = {
        street_address: this.state.address.street_address,
        postal_code: this.state.address.postal_code,
        locality: this.state.address.locality,
        country: this.state.address.country,
        location: this.state.currentLocation,
        google_place_id: this.state.placeId
      };
      return json;
    }

    render() {
        var self = this;
        if (this.state.isContactInfoHidden) {
            return (<section className="col-md-12 section">Loading ...</section>)
        }

        var opts = {};
        if (!this.state.isEnabled) {
            opts['readOnly'] = 'readOnly';
        }

        var isInvalid = this.state.isEmailInvalid || this.state.isMobilePhoneInvalid || this.state.isHomePhoneInvalid;
        var optsActions = {};
        if (isInvalid) {
            optsActions['disabled'] = 'disabled';
        }

        return (
          <section className="row col-md-12">
            <div className="col-md-6">
              <div className='form-group col-md-12'><label className='control-label'>Street
                address</label><input type='text'
                  className={this.state.address.street_address !== "" ? 'form-control' : 'form-control invalid'}
                  name='street_address' value={this.state.address.street_address}
                  readOnly/></div>
              <div className='form-group col-md-12'><label className='control-label'>Postal code</label><input
                  type='text'
                  className={this.state.address.postal_code !== "" ? 'form-control' : 'form-control invalid'}
                  name='postal_code' value={this.state.address.postal_code} readOnly/></div>
              <div className='form-group col-md-12'><label className='control-label'>Locality</label><input
                  type='text'
                  className={this.state.address.locality !== "" ? 'form-control' : 'form-control invalid'}
                  name='locality' value={this.state.address.locality} readOnly/></div>
              <div className='form-group col-md-12'><label className='control-label'>Country</label><input
                  type='text'
                  className={this.state.address.country !== "" ? 'form-control' : 'form-control invalid'}
                  name='country' value={this.state.address.country} readOnly/></div>
                  <input type="hidden" name="place_id" value={this.state.address.place_id}/>
              </div>
            <div className="col-md-6">
              <GettingStartedGoogleMap
                    ref={(i) => this.googleMap = i }
                    zoom={this.state.zoom}
                    center={this.state.center}
                    centerContent={this.state.centerContent}
                    currentLocation={this.state.currentLocation}
                    onMapLoad={this.onMapLoad}
                    onSearchBoxCreated={this.onSearchBoxCreated}
                    onPlacesChanged={this.onPlacesChanged}
                    bounds={this.state.bounds}
                    containerElement={
                      <div style={{height: `100%`}}/>
                    }
                    mapElement={
                      <div style={{height: `100%`}}/>
                    }>
              </GettingStartedGoogleMap>
            </div>
          </section>
        );
    }

    componentDidMount() {
        var self = this;
        var setDefaultLocation = function () {
            self.setState({
                center: {
                    lat: 50,
                    lng: 50
                }
            });
        };
        if (self.props.onLoading) self.props.onLoading(true);
        // Get the current location and display it.
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                GoogleMapService.getPlaceByLocation(position.coords).then(function(adr) {
                  self.setState({
                      center: location,
                      currentLocation: location,
                      address: adr.adr,
                      isAddressCorrect: true,
                      placeId: adr.place_id
                  });
                  if (self.props.addressCorrect) self.props.addressCorrect(true);
                  if (self.props.onLoading) self.props.onLoading(false);
                }).catch(function() {
                  if (self.props.onWarning) self.props.onWarning('Current address cannot be retrieved');
                  if (self.props.onLoading) self.props.onLoading(false);
                  if (self.props.addressCorrect) self.props.addressCorrect(false);
                  setDefaultLocation();
                });
            });
        } else {
            if (self.props.onWarning) self.props.onWarning('Geolocation is not supported by your browser');
            if (self.props.onLoading) self.props.onLoading(false);
            if (self.props.addressCorrect) self.props.addressCorrect(false);
            setDefaultLocation();
        }
    }
}

export default Address;
