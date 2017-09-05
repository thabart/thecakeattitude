import React, {Component} from "react";
import { Form, FormGroup, Label, Col, Input } from "reactstrap";
import { GoogleMapService, DhlService } from "../services/index";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { MAP } from "react-google-maps/lib/constants";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import Constants from "../../Constants";
import Promise from "bluebird";
import { translate } from 'react-i18next';

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

const markerOpts = {
    url: '/images/shop-pin.png',
    scaledSize: new window.google.maps.Size(34, 38)
};

const GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={props.zoom}
        center={props.center}
        ref={props.onMapLoad}
        defaultOptions={{draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true}}
    >
        <SearchBox
            ref={props.onSearchBoxCreated}
            bounds={props.bounds}
            onPlacesChanged={props.onPlacesChanged}
            inputPlaceholder="Enter your address" controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
            inputStyle={INPUT_STYLE}
        />
        { props.currentLocation &&
          <Marker position={props.currentLocation} title='Current location'>
          </Marker>
        }
        { props.markers && props.markers.map((marker, index) => {
          return (<Marker position={marker.location} icon={markerOpts} title={marker.name} /> );
        })}
    </GoogleMap>
));

class DropLocations extends Component {
    constructor(props) {
        super(props);
        this._currentAdr = null;
        this.onMapLoad = this.onMapLoad.bind(this);
        this.onSearchBoxCreated = this.onSearchBoxCreated.bind(this);
        this.onPlacesChanged = this.onPlacesChanged.bind(this);
        this.refresh = this.refresh.bind(this);
        this.state = {
            zoom: 12,
            placeId: null,
            center: null,
            bounds: null,
            centerContent: null,
            currentLocation: null,
            locations: []
        }
    }

    onMapLoad(map) { // Save the google map reference.
        if (!map) return;
        this._googleMap = map;
    }

    onSearchBoxCreated(searchBox) { // Save the searchbox reference.
        this._searchBox = searchBox;
    }

    onPlacesChanged() { // This method is triggered when the place changes.
        var self = this;
        const {t} = this.props;
        const places = this._searchBox.getPlaces();
        var enableNext = function (b) {
            if (self.props.addressCorrect) self.props.addressCorrect(b);
            self.setState({
                isAddressCorrect: b
            });
        };
        // Only one address should be returned.
        if (places.length !== 1) {
            if (self.props.onError) self.props.onError(t('uniqueAddressError'));
            enableNext(false);
            return;
        }

        var firstPlace = places[0];
        var country = firstPlace.address_components.filter(function(adrComp) { return adrComp.types.indexOf('country') !== -1; })[0];
        if (country) {
          country = country.short_name;
        } else {
          country = 'BE';
        }

        self._currentAdr = { country: country, name: firstPlace.name, location: firstPlace.geometry.location, place_id: firstPlace.place_id };
        self.refresh();
    }

    display() { // Display the map.
        var self = this;
        setTimeout(function () {
            const mapInstance = self._googleMap.context[MAP];
            window.google.maps.event.trigger(mapInstance, 'resize');
        }, 1000);
    }

    getAddress() { // Get the address.
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

    refresh() { // Refresh the markers.
      var self = this;
      var currentAdr = self._currentAdr;
      DhlService.searchParcelShops({ country: currentAdr.country, query: currentAdr.name}).then(function(adr) {
        var locations = adr['locations'];
        console.log(locations);
        self.setState({
          placeId: currentAdr.place_id,
          currentLocation: currentAdr.location,
          center: currentAdr.location,
          locations: locations
        });
      }).catch(function() {
        self.setState({
          placeId: currentAdr.place_id,
          currentLocation: currentAdr.location,
          center: currentAdr.location,
          locations: []
        });
      });

    }

    render() { // Return the view.
        const {t} = this.props;
        if (this.state.isContactInfoHidden) {
            return (<section className="col-md-12 section">{t('loadingMessage')}</section>)
        }

        return (
            <div className="row col-md-12">
                <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-6">
                        <label>LIBRAIRIE</label>
                        <label>Adresse</label>
                        <label>809990 RUE STÉPHANIE 157 1020 BRUXELLES</label>
                      </div>
                      <div className="col-md-6">
                        <h5>Heures d ouverture</h5>
                        <ul>
                          <li>Lundi</li>
                          <li>Mardi</li>
                          <li>Mercredi</li>
                          <li>Jeudi</li>
                          <li>Vendredi</li>
                          <li>Samedi</li>
                          <li>Dimanche</li>
                        </ul>
                      </div>
                    </div>
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
                        markers={this.state.locations}
                        containerElement={
                            <div style={{height: `100%`}}/>
                        }
                        mapElement={
                            <div style={{height: `100%`}}/>
                        }>
                    </GettingStartedGoogleMap>
                </div>
            </div>
        );
    }

    componentDidMount() { // Execute the the view is displayed.
        var self = this;
        const {t} = this.props;
        var promise = null;
        if (self.props.position) { // Retrieve position from the parent.
            promise = new Promise(function (resolve) {
                resolve(self.props.position);
            });
        }
        else if ("geolocation" in navigator) { // Retrieve position from current location.
            promise = new Promise(function (resolve) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    resolve(location);
                });
            });
        } else { // Get default location.
            promise = new Promise(function (resolve) {
                resolve({
                    lat: 50,
                    lng: 50
                })
            });
        }

        promise.then(function (location) {
            GoogleMapService.getPlaceByLocation({latitude: location.lat, longitude: location.lng}).then(function (adr) {
                self._currentAdr = { country: adr.adr.country_code, place_id: adr.place_id, name: adr.adr.locality, location: adr.geometry.location };
                self.refresh();
            }).catch(function () {
                self.setState({
                    center: {
                        lat: 50,
                        lng: 50
                    }
                });
            });
        });
    }
}

export default translate('common', { wait: process && !process.release, withRef: true })(DropLocations);
