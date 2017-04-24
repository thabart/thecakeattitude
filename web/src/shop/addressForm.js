import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import { CategoryService, SessionService, OpenIdService, UserService } from '../services';
import { withGoogleMap, GoogleMap, InfoWindow, Circle, Marker } from 'react-google-maps';
import { MAP } from 'react-google-maps/lib/constants';
import SearchBox from 'react-google-maps/lib/places/SearchBox'
import Game from '../game/game';
import Constants from '../../Constants';
import $ from 'jquery';

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

var getAddress = function(adrComponents) {
		var result = {
      postal_code: "",
      locality: "",
      country: "",
      street_address: ""
    };
		var streetNumber = "",
			route = "";
		adrComponents.forEach(function(adrComponent) {
			if (!adrComponent.types) {
				return;
			}

			if (adrComponent.types.includes("street_number")) {
				streetNumber = adrComponent.long_name;
				return;
			}

			if (adrComponent.types.includes("route")) {
				route = adrComponent.long_name;
				return;
			}

			if (adrComponent.types.includes("postal_code")) {
				result['postal_code'] = adrComponent.long_name;
				return;
			}

			if (adrComponent.types.includes("locality")) {
				result['locality'] = adrComponent.long_name;
				return;
			}

			if (adrComponent.types.includes("country")) {
				result['country'] = adrComponent.long_name;
				return;
			}
		});

    if (streetNumber !== "" && route != "") {
		    result["street_address"] = streetNumber +" "+route;
    }

		return result;
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
        inputPlaceholder="Enter your address" controlPosition={window.google.maps.ControlPosition.TOP_LEFT} inputStyle={INPUT_STYLE}
      />
      {props.currentLocation &&
        <Marker position={props.currentLocation} title='Current location'>
        </Marker>
      }
  </GoogleMap>
));

class AddressForm extends Component {
  constructor(props) {
    super(props);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.onSearchBoxCreated = this.onSearchBoxCreated.bind(this);
    this.onPlacesChanged = this.onPlacesChanged.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.state = {
      zoom: 12,
      placeId: null,
      center: null,
      bounds: null,
      centerContent: null,
      currentLocation: null,
      address : {
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
    var enableNext = function(b) {
      self.setState({
        isAddressCorrect : b
      });
    };
    // Only one address should be returned.
    if (places.length !== 1) {
      self.props.onError('The address must be unique !');
      enableNext(false);
      return;
    }

    var firstPlace = places[0];
    var url = Constants.googleMapUrl + '/geocode/json?key=' + Constants.googleMapKey + '&place_id='+ firstPlace.place_id;
    self.props.onLoading(true);
    // Retrieve the address details.
    $.get(url).then(function(r) {
      if (r.status !== 'OK') {
        self.props.onError('The address details cannot be fetched');
        self.props.onLoading(false);
        enableNext(false);
        return;
      }

      var result = r.results[0];
      var location = firstPlace.geometry.location;
      var adr = getAddress(result.address_components);
      adr.place_id = firstPlace.place_id;
      self.setState({
        center: location,
        isAddressCorrect: true,
        currentLocation: location,
        address: adr,
        placeId: firstPlace.place_id
      });
      self.props.onLoading(false);
      if (!adr.postal_code || !adr.locality || !adr.country || !adr.street_address) {
        self.props.onError('The address should be complete !');
        enableNext(false);
      } else {
        enableNext(true);
      }
    }).catch(function(e) {
      self.props.onError('The address details cannot be fetched');
      enableNext(false);
      self.props.onLoading(false);
    });
  }
  previous() {
    this.props.onPrevious();
  }
  next() {
    var json = {
      street_address: this.state.address.street_address,
      postal_code: this.state.address.postal_code,
      locality: this.state.address.locality,
      country: this.state.address.country,
      location: this.state.currentLocation,
      google_place_id: this.state.placeId
    };

    this.props.onNext(json);
  }
  display() {
    var self = this;
    setTimeout(function() {
      const mapInstance = self._googleMap.context[MAP];
      window.google.maps.event.trigger(mapInstance, 'resize');
    }, 1000);
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
      <div>
        <section className="row section">
          <div className="col-md-6">
            <div className='form-group col-md-12'><label className='control-label'>Street address</label><input type='text' className={this.state.address.street_address !== "" ? 'form-control' : 'form-control invalid'} name='street_address' value={this.state.address.street_address} readOnly /></div>
            <div className='form-group col-md-12'><label className='control-label'>Postal code</label><input type='text' className={this.state.address.postal_code !== "" ? 'form-control' : 'form-control invalid'} name='postal_code' value={this.state.address.postal_code} readOnly /></div>
            <div className='form-group col-md-12'><label className='control-label'>Locality</label><input type='text' className={this.state.address.locality !== "" ? 'form-control' : 'form-control invalid'} name='locality' value={this.state.address.locality}  readOnly/></div>
            <div className='form-group col-md-12'><label className='control-label'>Country</label><input type='text' className={this.state.address.country !== "" ? 'form-control' : 'form-control invalid'} name='country' value={this.state.address.country} readOnly/></div>
            <input type="hidden" name="place_id" value={this.state.address.place_id} />
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
                  <div style={{ height: `100%` }} />
                }
                mapElement={
                  <div style={{ height: `100%` }} />
                }>
              </GettingStartedGoogleMap>
          </div>
        </section>
        <section className="col-md-12 sub-section">
          <button className="btn btn-primary previous" onClick={this.previous}>Previous</button>
          <button className="btn btn-primary next" disabled={!this.state.isAddressCorrect} onClick={this.next}>Next</button>
        </section>
      </div>
    );
  }
  componentDidMount() {
    var self = this;
    var setDefaultLocation = function() {
      self.setState({
        center: {
          lat: 50,
          lng: 50
        }
      });
    };
    self.props.onLoading(true);
    // Get the current location and display it.
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
			  var url = Constants.googleMapUrl + "/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude;
        $.get(url).then(function(r) {
          if (r.status !== 'OK') {
            return;
          }

          var result = r.results[0];
          var adr = getAddress(result.address_components);
          self.setState({
            center: location,
            currentLocation: location,
            address: adr,
            isAddressCorrect: true,
            placeId: result.place_id
          });
          self.props.onLoading(false);
        }).fail(function() {
          self.props.onWarning('Current address cannot be retrieved');
          self.props.onLoading(false);
          setDefaultLocation();
        });
      });
    } else {
      self.props.onWarning('Geolocation is not supported by your browser');
      self.props.onLoading(false);
      setDefaultLocation();
    }
  }
}

export default AddressForm;
