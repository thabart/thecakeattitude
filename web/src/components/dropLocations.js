import React, {Component} from "react";
import { Form, FormGroup, Label, Col, Input } from "reactstrap";
import { GoogleMapService, DhlService, UpsService } from "../services/index";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { MAP } from "react-google-maps/lib/constants";
import { translate } from 'react-i18next';
import SearchBox from "react-google-maps/lib/places/SearchBox";
import Constants from "../../Constants";
import Promise from "bluebird";
import moment from 'moment';

var dhlDaysMapping = {
    "0": "sunday",
    "1": "monday",
    "2": "tuesday",
    "3": "wednesday",
    "4": "thursday",
    "5": "friday",
    "6": "saturday"
};

var upsDaysMapping = {
    "1": "sunday",
    "2": "monday",
    "3": "tuesday",
    "4": "wednesday",
    "5": "thursday",
    "6": "friday",
    "7": "saturday"
};

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

const markerSelectedOpts = {
    url: '/images/shop-pin-selected.png',
    scaledSize: new window.google.maps.Size(34, 38)
};

const GettingStartedGoogleMap = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={props.zoom}
        center={props.center}
        ref={props.onMapLoad}
        defaultOptions={{draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true, fullscreenControl: false}}
    >
        { props.currentLocation &&
          <Marker position={props.currentLocation} title='Current location'>
          </Marker>
        }
        { props.markers && props.markers.map((marker, index) => {
          var onClick = () => props.onMarkerClick(marker);
          var iconOpts = marker.isSelected ? markerSelectedOpts : markerOpts;
          return (<Marker position={marker.location} onClick={onClick} icon={iconOpts} title={marker.name} /> );
        })}
    </GoogleMap>
));

class DropLocations extends Component {
    constructor(props) {
        super(props);
        this._currentAdr = null;
        this.onMapLoad = this.onMapLoad.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.refresh = this.refresh.bind(this);
        this.state = {
            zoom: 12,
            placeId: null,
            center: null,
            bounds: null,
            centerContent: null,
            currentLocation: null,
            selectedDropLocation: null,
            locations: []
        }
    }

    onMapLoad(map) { // Save the google map reference.
        if (!map) return;
        this._googleMap = map;
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

    setAddress(adr) { // Set the current address.
      var self = this;
      self._currentAdr = adr;
      self.refresh();
    }

    onMarkerClick(marker) { // Select a drop location.
      var locations = this.state.locations;
      var location = locations.filter(function(loc) { return loc === marker; })[0];
      locations.forEach(function(l) { l.isSelected = false; });
      location.isSelected = true;
      this.setState({
        selectedDropLocation: marker,
        locations: locations
      });
      if (this.props.onMarkerClick) {
        this.props.onMarkerClick(location);
      }
    }

    refresh() { // Refresh the markers.
      var self = this;
      var currentAdr = self._currentAdr;
      if (self.props.transporter === 'dhl') {
        DhlService.searchParcelShops({ country: currentAdr.country_code, query: currentAdr.locality}).then(function(adr) {
          var locations = adr['locations'];
          locations.forEach(function(location) { location.isSelected = false; });
          self.setState({
            placeId: currentAdr.google_place_id,
            currentLocation: currentAdr.location,
            center: currentAdr.location,
            selectedDropLocation: null,
            locations: locations
          });
        }).catch(function() {
          self.setState({
            placeId: currentAdr.google_place_id,
            currentLocation: currentAdr.location,
            center: currentAdr.location,
            selectedDropLocation: null,
            locations: []
          });
        });
        return;
      }

      if (self.props.transporter === 'ups') {
        var request = { address_line: currentAdr.street_address, postal_code: currentAdr.postal_code, country: currentAdr.country_code, city: currentAdr.locality };
        UpsService.searchParcelShops(request).then(function(adr) {
          var locations = adr['locations'];
          self.setState({
            placeId: currentAdr.google_place_id,
            currentLocation: currentAdr.location,
            center: currentAdr.location,
            selectedDropLocation: null,
            locations: locations
          });
        }).catch(function() {
          self.setState({
            placeId: currentAdr.google_place_id,
            currentLocation: currentAdr.location,
            center: currentAdr.location,
            selectedDropLocation: null,
            locations: []
          });
        });
      }
    }

    render() { // Return the view.
        const {t} = this.props;
        if (this.state.isContactInfoHidden) {
            return (<section className="col-md-12 section">{t('loadingMessage')}</section>)
        }

        var openingTimes = [];
        var adr = null;
        if (this.state.selectedDropLocation) {
          var daysMapping = this.props.transporter === 'dhl' ? dhlDaysMapping : upsDaysMapping;
          for(var day in daysMapping) {
            var openingTime = this.state.selectedDropLocation.opening_times.filter(function(ot) { return ot.day === day })[0];
            if (openingTime && openingTime.time_to && openingTime.time_from) {
              var timeTo = null;
              var timeFrom = null;
              if (moment(openingTime.time_to, 'HH:mm').isValid()) {
                timeTo = moment(openingTime.time_to, 'HH:mm').format('HH:mm');
              } else {
                timeTo = moment(openingTime.time_to, 'Hmm').format('HH:mm');
              }

              if (moment(openingTime.time_from, 'HH:mm').isValid()) {
                timeFrom = moment(openingTime.time_from, 'HH:mm').format('HH:mm');
              } else {
                timeFrom = moment(openingTime.time_from, 'Hmm').format('HH:mm');
              }
            }

            var hour = openingTime && openingTime.time_to && openingTime.time_from ? timeFrom + ' - ' + timeTo : t('closed');
            openingTimes.push((<tr><td>{t(daysMapping[day])}</td><td>{hour}</td></tr>));
          }

          var info = [];
          var addr = this.state.selectedDropLocation.address;
          if (addr.street) {
            info.push(addr.street);
          }

          if (addr.number) {
            info.push(addr.number);
          }

          if (addr.city) {
            info.push(addr.city);
          }

          adr = info.join(',');
        }

        return (
            <div className="row col-md-12">
                <div className="col-md-6" style={{minHeight: "400px"}}>
                  {
                    !this.state.selectedDropLocation ? (<i>{t('noDropLocationSelected')}</i>) :
                    (
                      <div className="row">
                        <div className="col-md-4">
                          <h5>{this.state.selectedDropLocation.name}</h5>
                          <p style={{wordWrap: "break-word"}}>{adr}</p>
                        </div>
                        <div className="col-md-8">
                          <h5>{t('businessHours')}</h5>
                          <table className="table">
                            <tbody>
                              {openingTimes}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  }
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
                        onMarkerClick={this.onMarkerClick}
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
        var adr = this.props.address;
        self.setAddress(adr);
    }
}

export default translate('common', { wait: process && !process.release, withRef: true })(DropLocations);
