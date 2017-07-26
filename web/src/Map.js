import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import TrendingSellers from "./widgets/trendingSellers";
import ShopServices from "./widgets/shopServices";
import PublicAnnouncements from "./widgets/publicAnnouncements";
import {withRouter} from "react-router";
import BestDeals from "./widgets/bestDeals";
import {ShopsService, SessionService, AnnouncementsService, CategoryService} from "./services/index";
import {withGoogleMap, GoogleMap, InfoWindow, Marker} from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";
import {MAP} from "react-google-maps/lib/constants";
import Constants from '../Constants';
import $ from "jquery";
import "jquery-ui/ui/widgets/sortable";
import AppDispatcher from "./appDispatcher";
import "react-grid-layout/css/styles.css";
import {Responsive, WidthProvider} from "react-grid-layout";
import NotificationSystem from 'react-notification-system';
import MainLayout from './MainLayout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import { translate } from 'react-i18next';
import "./styles/map.css";

const filterStorageKey = "shopingame_filter";
const widgetStorageKey = "shopingame_widgets";
const widgetKeys = {
  trendingSellers: 'a',
  shopServices: 'b',
  bestDeals: 'c',
  announces: 'd'
};

function getFilter() { // Get the filter from the local storage.
  let ls = {
    include_shops : true,
    include_announces : true,
    excludedCategories : []
  };
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(filterStorageKey)) || {
        include_shops : true,
        include_announces : true,
        excludedCategories : []
      };
    } catch (e) { }
  }

  return ls;
}

function saveFilter(value) { // Persist the filter into the global storage.
    if (global.localStorage) {
      global.localStorage.setItem(filterStorageKey, JSON.stringify(value));
    }
}

function getActiveWidgets() { // Get active widgets from the storage.
    let ls = null;
    if (global.localStorage) {
        try {
            ls = JSON.parse(global.localStorage.getItem(widgetStorageKey)) || null;
        } catch (e) { }
    }

    return ls;
}

function saveActiveWidgets(value) { // Persist the active widgets into the storage.
    if (global.localStorage) {
        global.localStorage.setItem(widgetStorageKey, JSON.stringify(value));
    }
}

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
        this._waitForToken = null;
        this._searchBox = null;
        this._searchTarget = "name";
        this._category_ids = null;
        this._isAnnounceDisplayed = true;
        this._isShopsDisplayed = true;
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
        this.openAddingWidgets = this.openAddingWidgets.bind(this);
        this.toggleCategory = this.toggleCategory.bind(this);
        this.toggleEye = this.toggleEye.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleWidget = this.toggleWidget.bind(this);
        var keys = [];
        for(var name in widgetKeys) {
          keys.push(widgetKeys[name]);
        }

        var activeWidgets = getActiveWidgets() || keys;
        this.state = {
            markers: [],
            center: {lat: 50.8503, lng: 4.3517},
            currentPosition: null,
            isDragging: false,
            isSearching: false,
            bounds: null,
            searchValue: null,
            activeWidgets: activeWidgets,
            isTrendingShopsActive: true,
            isBestDealsActive: true,
            isBestServicesActive: true,
            isPublicAnnouncementsActive: true,
            isAddingWidgets: false,
            isVerticalMenuDisplayed: true,
            isShopsLayerDisplayed : true,
            isServicesLayerDisplayed: true,
            shopCategories: []
        };
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

    onMapLoad(map) { // This method is called when the map is loaded.
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
          self.filter(filter);
      }, 1000);
    }

    onDragStart() { // This method is called when starting to drag the map.
      this.setState({
        isDragging: true
      });
    }

    onDragEnd() { // This method is called when the user has finished to drag the map.
      var self = this;
      self.setState({
        isDragging: false
      });
      self.refreshMap();
    }

    onZoomChanged() { // This method is called when the zoom has changed.
      var self = this;
      self.refreshMap();
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

    refreshMap() { // Refresh the map : Display shops and announces.
        var self = this;
        const {t} = this.props;
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
          /*
          if (self.state.activeWidgets.includes('a')) {
            self.refs.trendingSellers.getWrappedInstance().refresh(searchShopsRequest);
          }

          if (self.state.activeWidgets.includes('b')) {
            self.refs.bestDeals.getWrappedInstance().refresh(searchProductsRequest);
          }

          if (self.state.activeWidgets.includes('c')) {
            self.refs.shopServices.getWrappedInstance().refresh(searchServicesRequest);
          }
          */
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
                              <NavLink to={"/shops/" + shop.id+ '/view/profile' }>{t('viewShop')}</NavLink>
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
            self.refs.trendingSellers.getWrappedInstance().reset();
          }

          if (self.state.activeWidgets.includes('b')) {
            self.refs.bestDeals.getWrappedInstance().reset();
          }

          if (self.state.activeWidgets.includes('c')) {
            self.refs.shopServices.getWrappedInstance().reset();
          }
        }
        /*
        if (this._isAnnounceDisplayed) {
          if (self.state.activeWidgets.includes('d')) {
            self.refs.publicAnnouncements.getWrappedInstance().refresh(searchAnnounces);
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
                        <NavLink to={"/announces/" + announce.id }>{t('viewClientService')}</NavLink>
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
            self.refs.publicAnnouncements.getWrappedInstance().reset();
          }
        }

        if (!this._isAnnounceDisplayed && !this._isShopsDisplayed) {
          self.setState({
              isSearching: false
          });
        }
        */
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
      this.refs.filterModal.getWrappedInstance().close();
      this.refreshMap();
    }

    openAddingWidgets() {
      var isAddingWidgets = !this.state.isAddingWidgets;
      this.setState({
        isAddingWidgets: isAddingWidgets
      });
    }

    toggleCategory(shopCategory) { // Toggle the category.
      var self = this;
      var cat = self.getShopCategory(shopCategory);
      if (cat === null) {
        return;
      }

      cat.isDeployed = !cat.isDeployed;
      self.setState({
        shopCategories: self.state.shopCategories
      });
    }

    toggleEye(shopCategory) { // Toggle the eye.
      var self = this;
      var category = self.getShopCategory(shopCategory);
      if (category === null) {
        return;
      }

      var isEyeOpened = !category.isEyeOpened;
      category.isEyeOpened = isEyeOpened;
      if (category.children && category.children.length > 0) {
        category.children.forEach(function(c) { c.isEyeOpened = isEyeOpened });
      }

      if (category.parent_id) {
        var parentCategory = self.state.shopCategories.filter(function(c) { return c.id === category.parent_id });
        if (parentCategory.length === 1) {
          parentCategory[0].isEyeOpened = parentCategory[0].children.filter(function(c) { return c.isEyeOpened; }).length === parentCategory[0].children.length;
        }
      }

      self.setState({
        shopCategories: self.state.shopCategories
      });
      var categoryIds = []; // Retrieve and persist the not visible shop categories.
      self.state.shopCategories.forEach(function(category) {
        if (!category.children || category.children.length === 0) {
          return;
        }

        category.children.forEach(function(subCategory) {
          if (!subCategory.isEyeOpened) {
            categoryIds.push(subCategory.id);
          }
        });
      });
      var filter = getFilter();
      filter.excludedCategories = categoryIds;
      saveFilter(filter);
    }

    toggle(propName) { // Toggle a property.
      var value = !this.state[propName];
      this.setState({
        [propName]: value
      });
    }

    toggleWidget(widgetKey) { // Toggle the widget.
      var self = this;
      var activeWidgets = self.state.activeWidgets;
      if (activeWidgets.includes(widgetKey)) {
        activeWidgets.splice(activeWidgets.indexOf(widgetKey), 1);
      } else {
        activeWidgets.push(widgetKey);
      }

      saveActiveWidgets(activeWidgets);
      self.setState({
        activeWidgets: activeWidgets
      });
    }

    getShopCategory(shopCategory) { /// Get shop category.
      var self = this;
      var category = self.getElement(shopCategory, self.state.shopCategories);
      if (category !== null) {
        return category;
      }

      var subCategory = null;
      self.state.shopCategories.forEach(function(cat) {
        if (subCategory === null) {
          subCategory = self.getElement(shopCategory, cat.children);
        }
      });

      return subCategory;
    }

    getElement(elt, arr) { // Get element from collection.
      var self = this;
      if (!arr || arr.length === 0) {
        return null;
      }

      var filtered = arr.filter(function(s) {
        return s === elt;
      });

      if (!filtered || filtered.length !== 1) {
        return null;
      }

      return filtered[0];
    }

    render() { // Render the view.
        const { t } = this.props;
        var self = this,
          internalItems = {},
          cl = "row",
          items = [ ],
          gridLayout = getLayoutFromLocalStorage() || {
                  lg: [
                      {i: widgetKeys.trendingSellers, x: 0, y: 0, w: 1, h: 1, isResizable: true},
                      {i: widgetKeys.bestDeals, x: 1, y: 0, w: 1, h: 1, isResizable: true},
                      {i: widgetKeys.shopServices, x: 2, y: 0, w: 1, h: 1, isResizable: true},
                      {i: widgetKeys.announces, x: 0, y: 1, w: 3, h: 2, minW: 2, isResizable: true}
                  ]
              },
          shopCategories = self.state.shopCategories;
        internalItems[widgetKeys.trendingSellers] = (<div key={widgetKeys.trendingSellers}><TrendingSellers ref="trendingSellers" history={self.props.history} setCurrentMarker={self.setCurrentMarker} onClose={() => { self.toggleWidget(widgetKeys.trendingSellers); }}/></div>);
        internalItems[widgetKeys.bestDeals] = (<div key={widgetKeys.bestDeals}><BestDeals ref="bestDeals" history={self.props.history} setCurrentMarker={self.setCurrentMarker} onClose={() => { self.toggleWidget(widgetKeys.bestDeals); }} /></div>);
        internalItems[widgetKeys.shopServices] = (<div key={widgetKeys.shopServices}><ShopServices ref="shopServices" history={self.props.history} setCurrentMarker={self.setCurrentMarker} onClose={() => { self.toggleWidget(widgetKeys.shopServices); }}/></div>);
        internalItems[widgetKeys.announces] = (<div key={widgetKeys.announces}><PublicAnnouncements ref="publicAnnouncements" history={self.props.history} setCurrentMarker={self.setCurrentMarker} onClose={() => { self.toggleWidget(widgetKeys.announces); }}/></div>);
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

        var shopCategoryElts = [];
        shopCategories.forEach(function(shopCategory) {
          var subShopCategoriesElts = [];
          shopCategory.children.forEach(function(subShopCategory) {
            var eyeCl = subShopCategory.isEyeOpened ? "fa fa-eye action" : "fa fa-eye-slash action";
            subShopCategoriesElts.push((<li className="sub-menu-item">
              {subShopCategory.name}
              <div className="actions">
                <i className={eyeCl} onClick={() => { self.toggleEye(subShopCategory); }}></i>
              </div>
            </li>));
          });

          var arrowCl = shopCategory.isDeployed ? "fa fa-arrow-down action": "fa fa-arrow-left action";
          var eyeCl = shopCategory.isEyeOpened ? "fa fa-eye action" : "fa fa-eye-slash action";
          shopCategoryElts.push((
            <li className="menu-item">
              <h6 className="title">{shopCategory.name}</h6>
              <div className="actions">
                <i className={eyeCl} onClick={() => { self.toggleEye(shopCategory); }}></i>
                <i className={arrowCl} onClick={() => { self.toggleCategory(shopCategory); }}></i>
              </div>
              {shopCategory.isDeployed ? (<ul>{subShopCategoriesElts}</ul>) : '' }
            </li>));
        });

        return (
            <MainLayout isHeaderDisplayed={true} isFooterDisplayed={false}>
              <div className={cl} id="widget-container">
                  {/* Vertical menu */}
                  <div id="vertical-menu-map" className={self.state.isVerticalMenuDisplayed ? "col-md-2 vertical-menu fixed" : "vertical-menu min fixed"}>
                      <div className="header"><i className="fa fa-bars" onClick={() => self.toggle('isVerticalMenuDisplayed')}></i></div>
                      {self.state.isVerticalMenuDisplayed ? (
                        <div className="content">
                          {/* Categories */}
                          <h3 className="uppercase"><img src="/images/shop.png" width="30" />Catégories</h3>
                          <ul>
                            {shopCategoryElts}
                          </ul>
                          {/* Layers */}
                          <h3 className="uppercase"><img src="/images/layers.png" width="30" />Layers</h3>
                          <ul>
                            <li className="menu-item">
                              <h6 className="title">Magasins</h6>
                              <div className="actions">
                                <i className={self.state.isShopsLayerDisplayed ? "fa fa-eye action" : "fa fa-eye-slash action"} onClick={() => self.toggle('isShopsLayerDisplayed')}></i>
                              </div>
                            </li>
                            <li className="menu-item">
                              <h6 className="title">Services</h6>
                              <div className="actions">
                                <i className={self.state.isServicesLayerDisplayed ? "fa fa-eye action" : "fa fa-eye-slash action"} onClick={() => self.toggle('isServicesLayerDisplayed')}></i>
                              </div>
                            </li>
                          </ul>
                          {/* Widgets */}
                          <h3 className="uppercase"><img src="/images/windows.png" width="30" />Windows</h3>
                          <ul>
                            <li className="menu-item">
                              <h6 className="title">{t('trendingSellersWidgetTitle')}</h6>
                              <div className="actions">
                                <i className={self.state.activeWidgets.includes(widgetKeys.trendingSellers) ? 'fa fa-eye action' : 'fa fa-eye-slash action'} onClick={() => { self.toggleWidget(widgetKeys.trendingSellers); }}></i>
                              </div>
                            </li>
                            <li className="menu-item">
                              <h6 className="title">{t('bestDealsWidgetTitle')}</h6>
                              <div className="actions">
                                <i className={self.state.activeWidgets.includes(widgetKeys.bestDeals) ? 'fa fa-eye action' : 'fa fa-eye-slash action'} onClick={() => { self.toggleWidget(widgetKeys.bestDeals); }}></i>
                              </div>
                            </li>
                            <li className="menu-item">
                              <h6 className="title">{t('bestServicesWidgetTitle')}</h6>
                              <div className="actions">
                                <i className={self.state.activeWidgets.includes(widgetKeys.shopServices) ? 'fa fa-eye action' : 'fa fa-eye-slash action'} onClick={() => { self.toggleWidget(widgetKeys.shopServices); }}></i>
                              </div>
                            </li>
                            <li className="menu-item">
                              <h6 className="title">{t('lastClientServicesWidgetTitle')}</h6>
                              <div className="actions">
                                <i className={self.state.activeWidgets.includes(widgetKeys.announces) ? 'fa fa-eye action' : 'fa fa-eye-slash action'} onClick={() => { self.toggleWidget(widgetKeys.announces); }}></i>
                              </div>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div className="content">
                          <ul>
                            <li><img src="/images/shop.png" width="30" /></li>
                            <li><img src="/images/layers.png" width="30" /></li>
                            <li><img src="/images/windows.png" width="30" /></li>
                          </ul>
                        </div>
                      )}
                  </div>
                  {/* Widgets container */}
                  <div className={self.state.isVerticalMenuDisplayed ? "col-md-6 offset-md-2 hidden-sm-down" : "col-md-6 hidden-sm-down"} style={!self.state.isVerticalMenuDisplayed ? {marginLeft: "60px"} : {}}>
                      <form className="row col-md-8" onSubmit={(e) => {
                          e.preventDefault();
                          this.refreshMap();
                      }}>
                          <select className="form-control col-md-2 col-lg-2" onChange={(e) => {
                              this.changeFilter(e);
                          }}>
                              <option data-target="name">Name</option>
                              <option data-target="tag_name">Tag</option>
                          </select>
                          <input type="text" className="form-control col-md-7 col-lg-7" name="searchValue"
                                 placeholder="Shop, product, service, etc."
                                 onChange={this.handleInputChange}
                          />
                          <button className="btn btn-default col-md-3 col-lg-3" onClick={this.refreshMap}>search</button>
                      </form>
                      <ResponsiveReactGridLayout className="layout"
                                                 layouts={gridLayout} rowHeight={300}
                                                 cols={{lg: 2, md: 2, sm: 2, xs: 1, xxs: 1}} draggableHandle=".move"
                                                 onLayoutChange={this.onLayoutChange}>
                                                 {items}
                      </ResponsiveReactGridLayout >
                  </div>
                  {/* Map container */}
                  <div className={self.state.isVerticalMenuDisplayed ? "col-md-4" : "col-sm-11 col-md-5 max"} id="map-container">
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
                  {/*
                  <div className="float-btns">
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
                  {this.state.isAddingWidgets && (div className="add-widgets">
                      <h5>{t('enableWidgetsTitle')}</h5>
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
                        <button className="btn btn-default uppercase" onClick={this.filterWidgets}>{t('update')}</button>
                      </div>
                    </div>
                    )}
                    */}
                  <NotificationSystem ref="notificationSystem" />
              </div>
            </MainLayout>
        );
    }

    componentDidMount() {
        var self = this;
        this._waitForToken = AppDispatcher.register(function (payload) { // Refresh the map when a new shop arrived.
            switch (payload.actionName) {
                case 'new-shop':
                    var shops = self.state.shops;
                    if (shops) {
                      shops.push(payload.data);
                      self.setState(shops);
                    }

                    self.refs.notificationSystem.addNotification({
                      message: 'A new shop has been added',
                      level: 'success',
                      position: 'bl'
                    });
                    break;
            }
        });

        this._searchShopsRequest = {};
        if ("geolocation" in navigator) { // Get the current location and display it.
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

        CategoryService.getParents().then(function(result) { // Display the categories.
          var categories = result['_embedded'];
          var filter = getFilter();
          categories.forEach(function(category) {
            if (category.children && category.children.length > 0) {
              category.isDeployed = false;
              category.children.forEach(function(child) { child.isEyeOpened = true; });
              if (filter.excludedCategories.length === 0) {
                category.isEyeOpened = true;
                return;
              }

              var filteredCategories = category.children.filter(function(child) { return (filter.excludedCategories.filter(function(c) { return child.id === c })).length > 0; });
              filteredCategories.forEach(function(fileredCategory) {
                fileredCategory.isEyeOpened = false;
              });
              if (filteredCategories.length === 0) {
                category.isEyeOpened = true;
              } else {
                category.isEyeOpened = false;
              }
            }
          });

          self.setState({
            shopCategories: categories
          });
        });
    }

    componentWillUnmount() { // Remove the registration.
      AppDispatcher.unregister(this._waitForToken);
    }
}


export default translate('common', { wait: process && !process.release })(withRouter(Map));
