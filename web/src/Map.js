import React, { Component } from 'react';
import TrendingSellers from './widgets/trendingSellers';
import BestDeals from './widgets/bestDeals';
import { ShopsService } from './services';
import PublicAnnouncements from './widgets/publicAnnouncements';
import { withGoogleMap, GoogleMap, Circle, InfoWindow, Marker } from 'react-google-maps';
import { MAP } from 'react-google-maps/lib/constants';
import './Map.css';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    center={props.center}
    onDragStart={props.onDragStart}
    onDragEnd={props.onDragEnd}
    onZoomChanged={props.onZoomChanged}
    defaultZoom={12}
  >
  {props.markers && props.markers.map((marker, index) => {
    return (
        <Marker
          key={index}
          icon='/images/shop-pin.png'
          position={marker.location}
        />
      );
    })}
  </GoogleMap>
));

class Map extends Component {
  constructor(props) {
    super(props);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onZoomChanged = this.onZoomChanged.bind(this);
    this.state = {
      center : null,
      centerContent: null,
      isDragging: false,
      isSearching: false,
      shops: []
    };
  }
  onMapLoad(map) {
    var self = this;
    self._googleMap = map;
    var mapInstance = self._googleMap.context[MAP];
    var div = mapInstance.getDiv();
    $(div).append("<div class='search-circle-overlay'><div class='searching-circle'><div class='searching-message'><h3>Search</h3></div></div></div>");
    $(div).append("<div class='searching-overlay'><div class='searching-message'><i class='fa fa-spinner fa-spin'></i></div></div>");
    setTimeout(function() {
      self.refreshMap();
    }, 1000);
  }
  onDragStart() {
    this.setState({
      isDragging: true
    });
  }
  refreshMap() {
    var self = this;
    self.setState({
      isSearching: true
    });
    var bounds = self._googleMap.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    var northEast = {
      lat : ne.lat(),
      lng: ne.lng()
    };
    var southWest = {
      lat: sw.lat(),
      lng: sw.lng()
    };
    var json = {
      ne: northEast,
      sw: southWest
    };
    ShopsService.search(json).then(function(r) {
      var embedded = r['_embedded'];
      if (!(embedded instanceof Array)) {
        embedded = [embedded];
      }
        var shops = [];
      embedded.forEach(function(shop) {
        shops.push({ location: shop.location });
      });
      self.setState({
        shops: shops,
        isSearching: false
      });
    }).catch(function() {
      self.setState({
        shops: [],
        isSearching: false
      });
    });
  }
  onDragEnd() {
    this.setState({
      isDragging: false
    });
    this.refreshMap();
  }
  onZoomChanged() {
    this.refreshMap();
  }
  render() {
    var cl = "row";
    if (this.state.isSearching) {
      cl = "row searching";
    } else if (this.state.isDragging) {
      cl = "row pending-search";
    }

    return (
      <div>
        <form className="row justify-content-center search">
  				<input type="text" className="form-control col-5"/>
  				<input type="submit" className="btn btn-default" value="Search"></input>
  			</form>
        <div className={cl}>
          <div className="col-md-6">
            <div id="map" className="col-md-12">
              <GettingStartedGoogleMap
                center={this.state.center}
                centerContent={this.state.centerContent}
                onMapLoad={this.onMapLoad}
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                onZoomChanged={this.onZoomChanged}
                markers={this.state.shops}
                containerElement={
                  <div style={{ height: `100%` }} />
                }
                mapElement={
                  <div style={{ height: `100%` }} />
                }>
              </GettingStartedGoogleMap>
            </div>
          </div>
          <div className="col-md-6">
            <ul className="row list-unstyled" ref={(elt) => {this.widgetContainer = elt; }}>
              <li className="col-md-5 cell widget">
                <TrendingSellers />
              </li>
              <li className="col-md-5 cell widget">
                <BestDeals />
              </li>
              <li className="col-md-10 cell widget">
                <PublicAnnouncements />
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var self = this;
    // Can reorder all the widgets.
    $(this.widgetContainer).sortable({
      handle: '.card-header',
      opacity: 0.4,
      placeholder: 'placeholder',
      forcePlaceholderSize: true,
      cursor: 'move'
    });
    // Get the current location and display it.
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        self.setState({
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          centerContent: 'Current location'
        });
      });
    } else {
      // TODO : Geolocation is not possible.
    }
  }
}

export default Map;
