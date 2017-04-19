import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { TabContent, TabPane } from 'reactstrap';
import { withGoogleMap, GoogleMap, InfoWindow, Circle } from 'react-google-maps';
import SearchBox from 'react-google-maps/lib/places/SearchBox'
import { MAP } from 'react-google-maps/lib/constants';
import $ from 'jquery';
import './AddShop.css';
const INPUT_STYLE = {
  boxSizing: `border-box`,
  MozBoxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  marginTop: `5px`,
  padding: `0 12px`,
  borderRadius: `1px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
};


const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={12}
    center={props.center}
    ref={props.onMapLoad}
  >
    <SearchBox
        ref={props.onSearchBoxCreated}
        bounds={props.bounds}
        onPlacesChanged={props.onPlacesChanged}
        inputPlaceholder="Enter your address" controlPosition={window.google.maps.ControlPosition.TOP_LEFT} inputStyle={INPUT_STYLE}
      />
      {props.center && <InfoWindow position={props.center}>
          <div>{props.centerContent}</div>
      </InfoWindow>}
      {props.center && <Circle
          center={props.center}
          radius={200}
          options={{
            fillColor: `red`,
            fillOpacity: 0.20,
            strokeColor: `red`,
            strokeOpacity: 1,
            strokeWeight: 1,
          }}
        />}
  </GoogleMap>
));
class AddShop extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.onSearchBoxCreated = this.onSearchBoxCreated.bind(this);
    this.onPlacesChanged = this.onPlacesChanged.bind(this);
    this.search = this.search.bind(this);
    this.googleMap = null;
    this.state = {
      activeTab: '1',
      center: null,
      centerContent: null,
      bounds: null
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
  search() {

  }
  onMapLoad(map) {
    this._googleMap = map;
  }
  onSearchBoxCreated() {

  }
  onPlacesChanged() {

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
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId='1'>
            <section className="row section">
              <div className='form-group col-md-12'><label className='control-label'>Name</label><input type='text' className='form-control' name='name'/></div>
              <div className='form-group col-md-12'><label className='control-label'>Description</label><textarea className='form-control' name='description'></textarea></div>
							<div className='form-group col-md-12'><label className='control-label'>Category</label></div>
							<div className='form-group col-md-12'><label className='control-label'>Banner image</label><div><input type='file' /></div></div>
              <div className='form-group col-md-12'><label className='control-label'>Picture</label><div><input type='file' /></div></div>
            </section>
  					<section className="row sub-section section-description">
  						<button className="btn btn-primary next" onClick={() => { this.toggle('2'); }}>Next</button>
  					</section>
          </TabPane>
          <TabPane tabId='2'>
            <section className="row section">
              <div className="col-md-6">
                <div className='form-group col-md-12'><label className='control-label'>Street address</label><input type='text' className='form-control' name='street_address' /></div>
                <div className='form-group col-md-12'><label className='control-label'>Postal code</label><input type='text' className='form-control' name='postal_code' /></div>
                <div className='form-group col-md-12'><label className='control-label'>Locality</label><input type='text' className='form-control' name='locality' /></div>
                <div className='form-group col-md-12'><label className='control-label'>Country</label><input type='text' className='form-control' name='country' /></div>
                <div className='form-group col-md-12'><input type='checkbox' /> Use current location</div>
              </div>
              <div className="col-md-6">
                  <GettingStartedGoogleMap
                    ref={(i) => this.googleMap = i }
                    center={this.state.center}
                    centerContent={this.state.centerContent}
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
    				<section className="row sub-section section-description">
    					<button className="btn btn-primary previous" onClick={() => { this.toggle('1'); }}>Previous</button>
              <button className="btn btn-primary previous" onClick={() => {this.search(); }}>Search</button>
      				<button className="btn btn-primary next" onClick={() => {this.toggle('3'); }}>Next</button>
    				</section>
          </TabPane>
          <TabPane tabId='3'>
            <section className="row section">
              <div className='form-group col-md-12'><label className='control-label'>Email</label><input type='text' className='form-control' name='email' readOnly /></div>
              <div className='form-group col-md-12'><label className='control-label'>Phone</label><input type='text' className='form-control' name='phone_number' readOnly /></div>
            </section>
            <section className="row sub-section section-description">
    					<button className="btn btn-primary previous" onClick={() => { this.toggle('2'); }}>Previous</button>
      				<button className="btn btn-primary next" onClick={() => { this.toggle('4'); }}>Next</button>
            </section>
          </TabPane>
          <TabPane tabId='4'>
            <section className="row section">
            </section>
            <section className="row sub-section section-description">
    					<button className="btn btn-primary previous" onClick={() => { this.toggle('3'); }}>Previous</button>
      				<button className="btn btn-primary next" onClick={() => { this.toggle('5'); }}>Next</button>
            </section>
          </TabPane>
          <TabPane tabId='5'>
            <section className="row section">
              <button type='button' className='btn btn-success'><span className='fa fa-plus glyphicon-align-left'></span> Add product</button>
            </section>
            <section className="row sub-section section-description">
    					<button className="btn btn-primary previous" onClick={() => { this.toggle('4'); }}>Previous</button>
      				<button className="btn btn-primary next" onClick={() => { this.toggle('6'); }}>Next</button>
            </section>
          </TabPane>
          <TabPane tabId='6'>
            <section className="row section">
              <div className='input-group'><span className='input-group-addon'><input type='radio' /></span><span className='form-control'>Card</span></div>
							<div className='input-group'><span className='input-group-addon'><input type='radio' /></span><span className='form-control'>Cash</span></div>
							<div className='input-group'><span className='input-group-addon'><input type='radio' /></span><span className='form-control'>Bank transfer</span></div>
							<div className='input-group'><span className='input-group-addon'><input type='radio' /></span><span className='form-control'>Paypal</span></div>
            </section>
            <section className="row sub-section section-description">
    					<button className="btn btn-primary previous" onClick={() => { this.toggle('5'); }}>Previous</button>
      				<button className="btn btn-success confirm">Confirm</button>
            </section>
          </TabPane>
        </TabContent>
      </div>
    );
  }
  componentDidMount() {
    var self = this;
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

export default AddShop;
