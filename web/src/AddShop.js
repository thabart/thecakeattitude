import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { TabContent, TabPane } from 'reactstrap';
import { withGoogleMap, GoogleMap, InfoWindow, Circle, Marker, Tooltip } from 'react-google-maps';
import Constants from '../Constants';
import SearchBox from 'react-google-maps/lib/places/SearchBox'
import { MAP } from 'react-google-maps/lib/constants';
import { DescriptionForm, ContactInfoForm, TagsForm, PaymentForm } from './shop';
import $ from 'jquery';
import './AddShop.css';

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
class AddShop extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.onSearchBoxCreated = this.onSearchBoxCreated.bind(this);
    this.onPlacesChanged = this.onPlacesChanged.bind(this);
    this.displayError = this.displayError.bind(this);
    this._googleMap = null;
    this._searchBox = null;
    this.state = {
      zoom: 12,
      activeTab: '1',
      center: null,
      centerContent: null,
      bounds: null,
      currentLocation: null,
      address : {
        postal_code: "",
        locality: "",
        country: "",
        street_address: ""
      },
      errorMessage: null,
      warningMessage: null,
      isAddressCorrect: false,
      isLoading: false
    };
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });

      if (tab === '2') {
        var self = this;
        setTimeout(function() {
          const mapInstance = self._googleMap.context[MAP];
          window.google.maps.event.trigger(mapInstance, 'resize');
        }, 100);
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
    self.displayError(null);
    const places = this._searchBox.getPlaces();
    var enableNext = function(b) {
      self.setState({
        isAddressCorrect : b
      });
    };
    // Only one address should be returned.
    if (places.length !== 1) {
      self.displayError('The address must be unique !');
      enableNext(false);
      return;
    }

    var firstPlace = places[0];
    var url = Constants.googleMapUrl + '/geocode/json?key=' + Constants.googleMapKey + '&place_id='+ firstPlace.place_id;
    self.loading(true);
    // Retrieve the address details.
    $.get(url).then(function(r) {
      if (r.status !== 'OK') {
        self.displayError('The address details cannot be fetched');
        self.loading(false);
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
        address: adr
      });
      self.loading(false);
      if (!adr.postal_code || !adr.locality || !adr.country || !adr.street_address) {
        self.displayError('The address should be complete !');
        enableNext(false);
      } else {
        enableNext(true);
      }
    }).catch(function(e) {
      self.displayError('The address details cannot be fetched');
      enableNext(false);
      self.loading(false);
    });
  }
  displayError(msg) {
    this.setState({
      errorMessage: msg
    });
  }
  displayWarning(msg) {
    this.setState({
      warningMessage: msg
    });
  }
  loading(isLoading) {
    this.setState({
      isLoading: isLoading
    });
  }
  render() {
    return (
      <div className="container">
        <ul className="progressbar">
          <li className={(parseInt(this.state.activeTab) >= 1) ?'active' : ''}>Description</li>
          <li className={(parseInt(this.state.activeTab) >= 2) ?'active' : ''}>Address</li>
          <li className={(parseInt(this.state.activeTab) >= 3) ?'active' : ''}>Contact</li>
          <li className={(parseInt(this.state.activeTab) >= 4) ?'active' : ''}>Tags</li>
          <li className={(parseInt(this.state.activeTab) >= 5) ?'active' : ''}>Products</li>
          <li className={(parseInt(this.state.activeTab) >= 6) ?'active' : ''}>Payment</li>
        </ul>
        <div className={this.state.errorMessage === null ? 'hidden' : 'alert alert-danger'}>{this.state.errorMessage}</div>
        <div className={this.state.warningMessage === null ? 'hidden' : 'alert alert-warning'}>{this.state.warningMessage}</div>
        <TabContent activeTab={this.state.activeTab} className="progressbar-content">
          <div className={this.state.isLoading ? 'loading': 'loading hidden'}><i className='fa fa-spinner fa-spin'></i></div>
          <TabPane tabId='1' className={this.state.isLoading ? 'hidden': ''}>
            <DescriptionForm onNext={() => { this.toggle('2'); }}/>
          </TabPane>
          <TabPane tabId='2' className={this.state.isLoading ? 'hidden': ''}>
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
    					<button className="btn btn-primary previous" onClick={() => { this.toggle('1'); }}>Previous</button>
      				<button className="btn btn-primary next" disabled={!this.state.isAddressCorrect} onClick={() => {this.toggle('3'); }}>Next</button>
    				</section>
          </TabPane>
          <TabPane tabId='3' className={this.state.isLoading ? 'hidden': ''}>
            <ContactInfoForm onError={(msg) => { this.displayError(msg); }} onPrevious={() => { this.toggle('2'); }} onNext={() => { this.toggle('4'); }}/>
          </TabPane>
          <TabPane tabId='4' className={this.state.isLoading ? 'hidden': ''}>
            <TagsForm onError={(msg) => { this.displayError(msg); }} onPrevious={() => { this.toggle('3'); }} onNext={() => { this.toggle('5'); }}/>
          </TabPane>
          <TabPane tabId='5' className={this.state.isLoading ? 'hidden': ''}>
            <section className="col-md-12 section">
              <button type='button' className='btn btn-success'><span className='fa fa-plus glyphicon-align-left'></span> Add product</button>
            </section>
            <section className="col-md-12 sub-section">
    					<button className="btn btn-primary previous" onClick={() => { this.toggle('4'); }}>Previous</button>
      				<button className="btn btn-primary next" onClick={() => { this.toggle('6'); }}>Next</button>
            </section>
          </TabPane>
          <TabPane tabId='6' className={this.state.isLoading ? 'hidden': ''}>
            <PaymentForm  onPrevious={() => { this.toggle('5'); }} />
          </TabPane>
        </TabContent>
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
    self.loading(true);
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
            isAddressCorrect: true
          });
          self.loading(false);
        }).fail(function() {
          self.displayWarning('Current address cannot be retrieved');
          setDefaultLocation();
          self.loading(false);
        });
      });
    } else {
      self.displayWarning('Geolocation is not supported by your browser');
      setDefaultLocation();
      self.loading(false);
    }
  }
}

export default AddShop;
