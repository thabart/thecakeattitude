import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import TrendingSellers from './widgets/trendingSellers';
import { withRouter } from 'react-router';
import BestDeals from './widgets/bestDeals';
import { ShopsService } from './services';
import PublicAnnouncements from './widgets/publicAnnouncements';
import { withGoogleMap, GoogleMap, Circle, InfoWindow, Marker } from 'react-google-maps';
import { MAP } from 'react-google-maps/lib/constants';
import './Map.css';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';

const currentLocationOpts = {
  url: '/images/current-location.png',
  scaledSize: new window.google.maps.Size(20, 20)
};

const shopOpts = {
  url : '/images/shop-pin.png',
  scaledSize: new window.google.maps.Size(34, 38)
};

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    center={props.center}
    onDragStart={props.onDragStart}
    onDragEnd={props.onDragEnd}
    onZoomChanged={props.onZoomChanged}
    defaultZoom={12}
  >
  <Marker
    icon={currentLocationOpts}
    position={props.center} />
  {props.markers && props.markers.map((marker, index) => {
    var onClick = () => props.onMarkerClick(marker);
    var onCloseClick = () => props.onCloseClick(marker);
    return (
        <Marker
          key={index}
          icon={shopOpts}
          position={marker.location}
          onClick={onClick}
        >
          {marker.showInfo && (<InfoWindow onCloseClick={onCloseClick}>
            <div>
              <strong>{marker.name}</strong><br />
              <NavLink to={"/shops/" + marker.id }>View profile</NavLink>
            </div>
          </InfoWindow>)}
        </Marker>
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
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.state = {
      center : { lat: 50.8503, lng: 4.3517 },
      isDragging: false,
      isSearching: false,
      shops: []
    };
  }
  // Call when the google map is initialized
  onMapLoad(map) {
    var self = this;
    self._googleMap = map;
    if (!map) {
      return;
    }

    var mapInstance = self._googleMap.context[MAP];
    var div = mapInstance.getDiv();
    $(div).append("<div class='search-circle-overlay'><div class='searching-circle'><div class='searching-message'><h3>Search</h3></div></div></div>");
    $(div).append("<div class='searching-overlay'><div class='searching-message'><i class='fa fa-spinner fa-spin'></i></div></div>");
    setTimeout(function() {
      self.refreshMap();
    }, 1000);
  }
  // Drag start
  onDragStart() {
    this.setState({
      isDragging: true
    });
  }
  // Drag end
  onDragEnd() {
    this.setState({
      isDragging: false
    });
    this.refreshMap();
  }
  // Zoom on map
  onZoomChanged() {
    this.refreshMap();
  }
  // Click on marker
  onMarkerClick(marker) {
    this.setState({
      shops: this.state.shops.map(shop => {
        if (shop === marker) {
          return {
            ...marker,
            showInfo: true
          };
        }

        return marker;
      })
    });
  }
  // Close the marker
  onCloseClick(marker) {
    this.setState({
      shops: this.state.shops.map(shop => {
        if (shop === marker) {
          return {
            ...marker,
            showInfo: false
          };
        }

        return marker;
      })
    });
  }
  // Refresh the map
  refreshMap() {
    var self = this;
    var bounds = self._googleMap.getBounds();
    if (!bounds) {
      return;
    }

    self.setState({
      isSearching: true
    });
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
    self.refs.trendingSellers.refresh(json);
    self.refs.bestDeals.refresh(json);
    ShopsService.search(json).then(function(r) {
      var embedded = r['_embedded'];
      if (!(embedded instanceof Array)) {
        embedded = [embedded];
      }
        var shops = [];
      embedded.forEach(function(shop) {
        shops.push({ location: shop.location, name: shop.name, showInfo: false, id: shop.id });
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
  // Render the view
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
                onMapLoad={this.onMapLoad}
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                onZoomChanged={this.onZoomChanged}
                onMarkerClick={this.onMarkerClick}
                onCloseClick={this.onCloseClick}
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
                <TrendingSellers ref="trendingSellers" history={this.props.history}/>
              </li>
              <li className="col-md-5 cell widget">
                <BestDeals ref="bestDeals" history={this.props.history}/>
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
          }
        });
      });
    } else {
      // TODO : Geolocation is not possible.
    }
  }
}


export default withRouter(Map);
