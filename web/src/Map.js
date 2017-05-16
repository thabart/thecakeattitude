import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import TrendingSellers from "./widgets/trendingSellers";
import ShopServices from "./widgets/shopServices";
import PublicAnnouncements from "./widgets/publicAnnouncements";
import {withRouter} from "react-router";
import BestDeals from "./widgets/bestDeals";
import {ShopsService, SessionService, AnnouncementsService} from "./services/index";
import {withGoogleMap, GoogleMap, InfoWindow, Marker} from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import {MAP} from "react-google-maps/lib/constants";
import "./Map.css";
import $ from "jquery";
import "jquery-ui/ui/widgets/sortable";
import AppDispatcher from "./appDispatcher";
import "./styles/Palette.css";

const currentLocationOpts = {
    url: '/images/current-location.png',
    scaledSize: new window.google.maps.Size(20, 20)
};

const shopOpts = {
    url: '/images/shop-pin.png',
    scaledSize: new window.google.maps.Size(34, 38)
};

const announceOpts = {
  url: '/images/service-pin.png',
  scaledSize: new window.google.maps.Size(34, 38)
};

const INPUT_STYLE = {
    boxSizing: `border-box`,
    MozBoxSizing: `border-box`,
    border: `1px solid transparent`,
    width: `600px`,
    height: `40px`,
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
        ref={props.onMapLoad}
        center={props.center}
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
        onZoomChanged={props.onZoomChanged}
        defaultZoom={12}
    >
        <SearchBox
            ref={props.onSearchBoxCreated}
            bounds={props.bounds}
            onPlacesChanged={props.onPlacesChanged}
            inputPlaceholder="Enter your address" controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
            inputStyle={INPUT_STYLE}/>
        {props.markers && props.markers.map((marker, index) => {
            var onClick = () => props.onMarkerClick(marker);
            var onCloseClick = () => props.onMarkerClose(marker);
            return (
                <Marker
                    key={index}
                    icon={marker.opts}
                    position={marker.location}
                    onClick={onClick}
                >
                    {marker.showInfo && (<InfoWindow onCloseClick={onCloseClick}>
                      {marker.info}
                    </InfoWindow>)}
                </Marker>
            );
        })}
      <Marker
          icon={currentLocationOpts}
          position={props.center}/>
    </GoogleMap>
));

class Map extends Component {
    constructor(props) {
        super(props);
        this._searchBox = null;
        this._searchTarget = "name";
        this.onMapLoad = this.onMapLoad.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onZoomChanged = this.onZoomChanged.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMarkerClose = this.onMarkerClose.bind(this);
        this.onSearchBoxCreated = this.onSearchBoxCreated.bind(this);
        this.onPlacesChanged = this.onPlacesChanged.bind(this);
        this.search = this.search.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            markers: [],
            center: {lat: 50.8503, lng: 4.3517},
            isDragging: false,
            isSearching: false,
            bounds: null,
            searchValue: null
        };
    }

    handleInputChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    changeFilter(e) {
        var selected = $(e.target).find(':selected');
        this._searchTarget = $(selected).data('target');
    }

    search() {

    }

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
        setTimeout(function () {
            self.refreshMap();
        }, 1000);
    }

    onDragStart() {
        this.setState({
            isDragging: true
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

    onMarkerClick(marker) {
      var markers = this.state.markers;
      markers.forEach(function(m) {
        if (m === marker) {
          m.showInfo = true;
        }
      });
      this.setState({
        markers: markers
      });
    }

    onMarkerClose(marker) {
      var markers = this.state.markers;
      markers.forEach(function(m) {
        if (m === marker) {
          m.showInfo = false;
        }
      });
      this.setState({
        markers: markers
      });
    }

    refreshMap() {
        var self = this;
        var bounds = self._googleMap.getBounds();
        if (!bounds) {
            return;
        }

        self.setState({
            isSearching: true,
            markers: []
        });
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        var northEast = {
            lat: ne.lat(),
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
        if (this.state.searchValue && this.state.searchValue !== null && this.state.searchValue !== "") {
            switch (this._searchTarget) {
                case "name":
                    json['name'] = this.state.searchValue;
                    break;
                case "tag_name":
                    json['tag'] = this.state.searchValue;
                    break;
            }
        }

        self.refs.trendingSellers.refresh(json);
        self.refs.bestDeals.refresh(json);
        self.refs.shopServices.refresh(json);
        self.refs.publicAnnouncements.refresh(json);
        ShopsService.search(json).then(function(shopsResult) {
          var shopsEmbedded = shopsResult['_embedded'];
          if (!(shopsEmbedded instanceof Array)) {
              shopsEmbedded = [shopsEmbedded];
          }

          var markers = self.state.markers;
          shopsEmbedded.forEach(function (shop) {
            markers.push({location: shop.location, name: shop.name, showInfo: false, id: shop.id, opts: shopOpts, info: (
              <div>
                <strong>{shop.name}</strong><br />
                <NavLink to={"/shops/" + shop.id }>View profile</NavLink>
              </div>)});
          });
          self.setState({
            isSearching: false,
            markers: markers
          });
        });
        AnnouncementsService.search(json).then(function(announcesResult) {
          var announcesEmbedded = announcesResult['_embedded'];
          if (!(announcesEmbedded instanceof Array)) {
            announcesEmbedded = [announcesEmbedded];
          }

          var markers = self.state.markers;
          announcesEmbedded.forEach(function (announce) {
            markers.push({location: announce.location, name: announce.name, showInfo: false, id: announce.id, opts: announceOpts, info: (<div><strong>{announce.name}</strong></div>)});
          });
          self.setState({
            isSearching: false,
            markers: markers
          });
        });
    }

    onSearchBoxCreated(searchBox) {
        this._searchBox = searchBox;
    }

    onPlacesChanged() {
        var self = this;
        const places = this._searchBox.getPlaces();
        if (places.length !== 1) {
            return;
        }

        var firstPlace = places[0];
        var location = firstPlace.geometry.location;
        self.setState({
            center: location
        });
        self.refreshMap();
    }

    render() {
        var cl = "row";
        if (this.state.isSearching) {
            cl = "row searching";
        } else if (this.state.isDragging) {
            cl = "row pending-search";
        }

        var session = SessionService.getSession();
        var isLoggedIn = session && session != null;
        return (
            <div className={cl} id="widget-container">
                <div className="col-md-8 hidden-sm-down">

                    {/* Search form */}
                    <form className="row col-md-8 offset-md-1" onSubmit={(e) => {
                        e.preventDefault();
                        this.refreshMap();
                    }}>
                        <select className="form-control col-md-2" onChange={(e) => {
                            this.changeFilter(e);
                        }}>
                            <option data-target="name">Name</option>
                            <option data-target="tag_name">Tag</option>
                        </select>
                        <input type="text" className="form-control col-md-8" name="searchValue"
                               placeholder="Shop, product, service, etc."
                               onChange={this.handleInputChange}
                        />
                        <button className="btn btn-info col-md-2" onClick={this.refreshMap}>search</button>
                    </form>

                    {/* Widgets panel */}
                    <ul className="row list-unstyled m-1" ref={(elt) => {
                        this.widgetContainer = elt;
                    }}>
                        <li className="col-md-4 p-1">
                            <TrendingSellers ref="trendingSellers" history={this.props.history}/>
                        </li>
                        <li className="col-md-4 p-1">
                            <BestDeals ref="bestDeals" history={this.props.history}/>
                        </li>
                        <li className="col-md-4 p-1">
                            <ShopServices ref="shopServices" history={this.props.history}/>
                        </li>
                        <li className="col-md-12 p-1">
                            <PublicAnnouncements ref="publicAnnouncements" history={this.props.history} />
                        </li>
                    </ul>
                </div>

                {/* Map */}
                <div className="col-md-4" id="map-container">
                    <GettingStartedGoogleMap
                        center={this.state.center}
                        onMapLoad={this.onMapLoad}
                        onDragStart={this.onDragStart}
                        onDragEnd={this.onDragEnd}
                        onZoomChanged={this.onZoomChanged}
                        onMarkerClick={this.onMarkerClick}
                        onMarkerClose={this.onMarkerClose}
                        markers={this.state.markers}
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
                {isLoggedIn && (<div className="addAnnouncement"><a href="/addAnnounce"><i className="fa fa-bullhorn"></i></a></div>)}
            </div>
        );
    }

    componentDidMount() {
        var self = this;
        // Refresh the map when a new shop arrived.
        AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case 'new-shop':
                    var shops = self.state.shops;
                    shops.push(payload.data);
                    self.setState(shops);
                    break;
            }
        });
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
            navigator.geolocation.getCurrentPosition(function (position) {
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
