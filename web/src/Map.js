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
import FilterModal from './FilterModal';
import {MAP} from "react-google-maps/lib/constants";
import Constants from '../Constants';
import "./Map.css";
import $ from "jquery";
import "jquery-ui/ui/widgets/sortable";
import AppDispatcher from "./appDispatcher";
import "react-grid-layout/css/styles.css";
import {Responsive, WidthProvider} from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

function getLayoutFromLocalStorage() {
    let ls = null;
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem('gameinshop_layouts')) || null;
        } catch (e) {/*Ignore*/
        }
    }

    return ls;
}

function saveLayout(value) {
    if (global.localStorage) {
        global.localStorage.setItem('gameinshop_layouts', JSON.stringify(value));
    }
}

function getActiveWidgets() {
    let ls = null;
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem('gameinshop_widgets')) || null;
        } catch (e) {/*Ignore*/
        }
    }

    return ls;
}

function saveActiveWidgets(value) {
    if (global.localStorage) {
        global.localStorage.setItem('gameinshop_widgets', JSON.stringify(value));
    }
}

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
        {props.currentPosition && props.currentPosition !== null && (<Marker
            icon={currentLocationOpts}
            position={props.currentPosition}/>)}
    </GoogleMap>
));

class Map extends Component {
    constructor(props) {
        super(props);
        var self = this;
        this._searchBox = null;
        this._searchTarget = "name";
        this._category_ids = null;
        this._isAnnounceDisplayed = true;
        this._isShopsDisplayed = true;
        this.openModal = this.openModal.bind(this);
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.setCurrentMarker = this.setCurrentMarker.bind(this);
        this.onMapLoad = this.onMapLoad.bind(this);
        this.onFilterLoad = this.onFilterLoad.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onZoomChanged = this.onZoomChanged.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMarkerClose = this.onMarkerClose.bind(this);
        this.onSearchBoxCreated = this.onSearchBoxCreated.bind(this);
        this.onPlacesChanged = this.onPlacesChanged.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.filter = this.filter.bind(this);
        this.filterWidgets = this.filterWidgets.bind(this);
        this.onCloseWidget = this.onCloseWidget.bind(this);
        this.openAddingWidgets = this.openAddingWidgets.bind(this);
        this.refreshActiveWidgets = this.refreshActiveWidgets.bind(this);
        this.state = {
            markers: [],
            center: {lat: 50.8503, lng: 4.3517},
            currentPosition: null,
            isDragging: false,
            isSearching: false,
            bounds: null,
            searchValue: null,
            activeWidgets: getActiveWidgets() || [
              'a', 'b', 'c', 'd'
            ],
            isTrendingShopsActive: true,
            isBestDealsActive: true,
            isBestServicesActive: true,
            isPublicAnnouncementsActive: true,
            isAddingWidgets: false
        };
    }

    openModal() {
      this.refs.filterModal.show();
    }

    onLayoutChange(layout, layouts) {
      saveLayout(layouts);
    }

    setCurrentMarker(id) {
        var markers = this.state.markers;
        var selectedMarker = null;
        markers.forEach(function (marker) {
            if (marker.id === id) {
                selectedMarker = marker;
                marker.showInfo = true;
            } else {
                marker.showInfo = false;
            }
        });

        this.setState({
            center: selectedMarker.location,
            markers: markers
        });
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
    }

    onFilterLoad(filter) {
      var self = this;
      setTimeout(function () {
          self.refreshActiveWidgets();
          self.filter(filter);
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
        markers.forEach(function (m) {
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
        markers.forEach(function (m) {
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

        var searchShopsRequest = $.extend({}, json, {
          category_id: self._category_ids
        });
        var searchProductsRequest = $.extend({}, json, {
          shop_category_ids: self._category_ids
        });
        var searchServicesRequest = $.extend({}, json, {
          shop_category_ids: self._category_ids
        });
        var searchAnnounces = $.extend({}, json, {
          category_id: self._category_ids
        });

        if (this._isShopsDisplayed) {
          if (self.state.activeWidgets.includes('a')) {
            self.refs.trendingSellers.refresh(searchShopsRequest);
          }

          if (self.state.activeWidgets.includes('b')) {
            self.refs.bestDeals.refresh(searchProductsRequest);
          }

          if (self.state.activeWidgets.includes('c')) {
            self.refs.shopServices.refresh(searchServicesRequest);
          }

          ShopsService.search(searchShopsRequest).then(function (shopsResult) {
              var shopsEmbedded = shopsResult['_embedded'];
              if (!(shopsEmbedded instanceof Array)) {
                  shopsEmbedded = [shopsEmbedded];
              }

              var markers = self.state.markers;
              shopsEmbedded.forEach(function (shop) {
                  var opts = shopOpts;
                  if (shop.category && shop.category.pin_image_partial_path && shop.category.pin_image_partial_path !== null && shop.category.pin_image_partial_path !== '') {
                    opts.url = Constants.apiUrl + shop.category.pin_image_partial_path;
                  }

                  markers.push({
                      location: shop.location, name: shop.name, showInfo: false, id: shop.id, opts: opts, info: (
                          <div>
                              <strong>{shop.name}</strong><br />
                              <NavLink to={"/shops/" + shop.id+ '/view/profile' }>View profile</NavLink>
                          </div>)
                  });
              });
              self.setState({
                  isSearching: false,
                  markers: markers
              });
          }).catch(function() {
            self.setState({
                isSearching: false
            });
          });
        } else {
          if (self.state.activeWidgets.includes('a')) {
            self.refs.trendingSellers.reset();
          }

          if (self.state.activeWidgets.includes('b')) {
            self.refs.bestDeals.reset();
          }

          if (self.state.activeWidgets.includes('c')) {
            self.refs.shopServices.reset();
          }
        }

        if (this._isAnnounceDisplayed) {
          if (self.state.activeWidgets.includes('d')) {
            self.refs.publicAnnouncements.refresh(searchAnnounces);
          }
          AnnouncementsService.search(searchAnnounces).then(function (announcesResult) {
              var announcesEmbedded = announcesResult['_embedded'];
              if (!(announcesEmbedded instanceof Array)) {
                  announcesEmbedded = [announcesEmbedded];
              }

              var markers = self.state.markers;
              announcesEmbedded.forEach(function (announce) {
                  markers.push({
                      location: announce.location,
                      name: announce.name,
                      showInfo: false,
                      id: announce.id,
                      opts: announceOpts,
                      info: (<div>
                        <strong>{announce.name}</strong><br />
                        <NavLink to={"/announces/" + announce.id }>View announce</NavLink>
                      </div>)
                  });
              });
              self.setState({
                  isSearching: false,
                  markers: markers
              });
          }).catch(function() {
            self.setState({
                isSearching: false
            });
          });
        }
        else
        {
          if (self.state.activeWidgets.includes('d')) {
            self.refs.publicAnnouncements.reset();
          }
        }

        if (!this._isAnnounceDisplayed && !this._isShopsDisplayed) {
          self.setState({
              isSearching: false
          });
        }
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

    filter(result) {
      this._isAnnounceDisplayed = result.include_announces;
      this._isShopsDisplayed = result.include_shops;
      this._category_ids = result.categories.map(function(category) {
        return category.id;
      });
      this.refs.filterModal.close();
      this.refreshMap();
    }

    refreshActiveWidgets() {
      var self = this;
      self.setState({
        isTrendingShopsActive: self.state.activeWidgets.includes('a'),
        isBestDealsActive: self.state.activeWidgets.includes('b'),
        isBestServicesActive: self.state.activeWidgets.includes('c'),
        isPublicAnnouncementsActive: self.state.activeWidgets.includes('d')
      });
    }

    filterWidgets() {
      var activeWidgets = [];
      if (this.state.isTrendingShopsActive) {
        activeWidgets.push('a');
      }

      if (this.state.isBestDealsActive) {
        activeWidgets.push('b')
      }

      if (this.state.isBestServicesActive) {
        activeWidgets.push('c');
      }

      if (this.state.isPublicAnnouncementsActive) {
        activeWidgets.push('d');
      }

      saveActiveWidgets(activeWidgets);
      this.setState({
        activeWidgets: activeWidgets,
        isAddingWidgets: false
      });

    }

    onCloseWidget(key) {
      var activeWidgets = this.state.activeWidgets;
      var index = activeWidgets.indexOf(key);
      if (index === -1) {
        return;
      }

      activeWidgets.splice(index, 1);
      saveActiveWidgets(this.state.activeWidgets);
      this.setState({
        activeWidgets: activeWidgets
      });
      this.refreshActiveWidgets();
    }

    openAddingWidgets() {
      var isAddingWidgets = !this.state.isAddingWidgets;
      this.setState({
        isAddingWidgets: isAddingWidgets
      });
    }

    render() {
        var self = this,
          internalItems = {
            'a' : (<div key={'a'}><TrendingSellers ref="trendingSellers" history={self.props.history} setCurrentMarker={self.setCurrentMarker} onClose={() => { self.onCloseWidget('a'); }}/></div>),
            'b':  (<div key={'b'}><BestDeals ref="bestDeals" history={self.props.history} setCurrentMarker={self.setCurrentMarker} onClose={() => { self.onCloseWidget('b'); }} /></div>),
            'c':  (<div key={'c'}><ShopServices ref="shopServices" history={self.props.history} setCurrentMarker={self.setCurrentMarker} onClose={() => { self.onCloseWidget('c'); }}/></div>),
            'd': (<div key={'d'}><PublicAnnouncements ref="publicAnnouncements" history={self.props.history} setCurrentMarker={self.setCurrentMarker} onClose={() => { self.onCloseWidget('d'); }}/></div>)
          },
          cl = "row",
          items = [ ],
          gridLayout = getLayoutFromLocalStorage() || {
                  lg: [
                      {i: 'a', x: 0, y: 0, w: 1, h: 1, isResizable: true},
                      {i: 'b', x: 1, y: 0, w: 1, h: 1, isResizable: true},
                      {i: 'c', x: 2, y: 0, w: 1, h: 1, isResizable: true},
                      {i: 'd', x: 0, y: 1, w: 3, h: 2, minW: 2, isResizable: true}
                  ]
              };
        if (this.state.isSearching) {
            cl = "row searching";
        } else if (this.state.isDragging) {
            cl = "row pending-search";
        }

        self.state.activeWidgets.forEach(function(activeWidget) {
          items.push(internalItems[activeWidget]);
        });

        var session = SessionService.getSession();
        var isLoggedIn = session && session != null;
        if (gridLayout && gridLayout.lg) {
          gridLayout.lg.forEach(function(rec) {
            if (rec.i === 'd' && (!rec['minW'] || rec['w'] < 2)) {
              rec['minW'] = 2;
              rec['w'] = 2;
            }
          });
        }

        return (
            <div className={cl} id="widget-container">
                <div className="col-md-8 hidden-sm-down">
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
                    <ResponsiveReactGridLayout className="layout"
                                               layouts={gridLayout} rowHeight={300}
                                               cols={{lg: 3, md: 3, sm: 1, xs: 1, xxs: 1}} draggableHandle=".move"
                                               onLayoutChange={this.onLayoutChange}>
                                               {items}
                    </ResponsiveReactGridLayout >
                </div>
                <div className="col-md-4" id="map-container">
                    <GettingStartedGoogleMap
                        currentPosition={this.state.currentPosition}
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
                <div className="options">
                    <a href="/" onClick={(e) => {
                      e.preventDefault();
                      this.openAddingWidgets();
                    }}><i className="fa fa-bars"></i></a>
                    <a href="/" onClick={(e) => {
                      e.preventDefault();
                      this.openModal();
                    }}><i className="fa fa-filter"></i></a>
                    {isLoggedIn && (<NavLink to="/addAnnounce"><i className="fa fa-bullhorn"></i></NavLink>)}
                </div>
                <FilterModal ref="filterModal" filter={this.filter} onFilterLoad={this.onFilterLoad} />
                {this.state.isAddingWidgets && (
                  <div className="add-widgets">
                    <h5>Active widgets</h5>
                    <div className="form-group">
                      <input type="checkbox" name="isTrendingShopsActive" checked={this.state.isTrendingShopsActive} onChange={this.handleInputChange}/><label>Trending shops</label>
                    </div>
                    <div className="form-group">
                      <input type="checkbox" name="isBestDealsActive" checked={this.state.isBestDealsActive} onChange={this.handleInputChange}/><label>Best deals</label>
                    </div>
                    <div className="form-group">
                      <input type="checkbox" name="isBestServicesActive" checked={this.state.isBestServicesActive} onChange={this.handleInputChange}/><label>Best services</label>
                    </div>
                    <div className="form-group">
                      <input type="checkbox" name="isPublicAnnouncementsActive" checked={this.state.isPublicAnnouncementsActive} onChange={this.handleInputChange}/><label>Public announcement</label>
                    </div>
                    <div className="form-group">
                      <button className="btn btn-success" onClick={this.filterWidgets}>UPDATE</button>
                    </div>
                  </div>
                )}
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

        this._searchShopsRequest = {};

        // Get the current location and display it.
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                self.setState({
                    currentPosition: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
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
