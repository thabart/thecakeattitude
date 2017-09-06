import React, {Component} from "react";
import {Form, FormGroup, Label, Col, Input} from "reactstrap";
import {GoogleMapService} from "../services/index";
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import {MAP} from "react-google-maps/lib/constants";
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

    onMapLoad(map) { // Save the google map reference.
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
        var url = Constants.googleMapUrl + '/geocode/json?key=' + Constants.googleMapKey + '&place_id=' + firstPlace.place_id;
        if (self.props.onLoading) self.props.onLoading(true);
        GoogleMapService.getPlaceByPlaceId(firstPlace.place_id).then(function (adr) {
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
                if (self.props.onError) self.props.onError(t('completeAddressError'));
                enableNext(false);
            } else {
                enableNext(true);
            }
        }).catch(function () {
            if (self.props.onError) self.props.onError(t('addressDetailsError'));
            if (self.props.onLoading) self.props.onLoading(false);
            enableNext(false);
        });
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
            google_place_id: this.state.placeId,
            country_code: this.state.address.country_code
        };
        return json;
    }

    render() { // Return the view.
        const {t} = this.props;
        if (this.state.isContactInfoHidden) {
            return (<section className="col-md-12 section">{t('loadingMessage')}</section>)
        }

        return (
            <div className="row col-md-12">
                <div className="col-md-6">
                    <Form>
                        <FormGroup>
                            <Label sm={12}>{t('streetAddress')}</Label>
                            <Col sm={12}>
                                <Input type="text"
                                       className={this.state.address.street_address !== "" ? 'form-control' : 'form-control invalid'}
                                       name="street_address"
                                       value={this.state.address.street_address}
                                       readOnly/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label sm={12}>{t('postalCode')}</Label>
                            <Col sm={12}>
                                <Input type="text"
                                       className={this.state.address.postal_code !== "" ? 'form-control' : 'form-control invalid'}
                                       name="postal_code"
                                       value={this.state.address.postal_code}
                                       readOnly/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label sm={12}>{t('locality')}</Label>
                            <Col sm={12}>
                                <Input type="text"
                                       className={this.state.address.locality !== "" ? 'form-control' : 'form-control invalid'}
                                       name="locality"
                                       value={this.state.address.locality}
                                       readOnly/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label sm={12}>{t('country')}</Label>
                            <Col sm={12}>
                                <Input type="text"
                                       className={this.state.address.country !== "" ? 'form-control' : 'form-control invalid'}
                                       name="country"
                                       value={this.state.address.country}
                                       readOnly/>
                            </Col>
                        </FormGroup>
                        <input type="hidden" name="place_id" value={this.state.address.place_id}/>
                    </Form>
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
            </div>
        );
    }

    componentDidMount() { // Execute the the view is displayed.
        var self = this;
        const {t} = this.props;
        if (self.props.onLoading) self.props.onLoading(true);
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
                self.setState({
                    center: location,
                    currentLocation: location,
                    address: adr.adr,
                    isAddressCorrect: true,
                    placeId: adr.place_id
                });
                if (self.props.addressCorrect) self.props.addressCorrect(true);
                if (self.props.onLoading) self.props.onLoading(false);
            }).catch(function () {
                if (self.props.onWarning) self.props.onWarning(t('yourAddressCannotBeRetrievedError'));
                if (self.props.onLoading) self.props.onLoading(false);
                if (self.props.addressCorrect) self.props.addressCorrect(false);
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

export default translate('common', { wait: process && !process.release, withRef: true })(Address);
