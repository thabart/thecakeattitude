import React, { Component } from 'react';
import TrendingSellers from './widgets/trendingSellers';
import BestDeals from './widgets/bestDeals';
import PublicAnnouncements from './widgets/publicAnnouncements';
import { withGoogleMap, GoogleMap, Circle, InfoWindow } from 'react-google-maps';
import './Map.css';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={12}
    center={props.center}
  >
    {props.center && <InfoWindow position={props.center}>
        <div>{props.centerContent}</div>
    </InfoWindow>}
    <Circle
        center={props.center}
        radius={200}
        options={{
          fillColor: `red`,
          fillOpacity: 0.20,
          strokeColor: `red`,
          strokeOpacity: 1,
          strokeWeight: 1,
        }}
      />
  </GoogleMap>
));

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center : null,
      centerContent: null
    };
  }
  render() {
    return (
      <div>
        <form className="row justify-content-center search">
  				<input type="text" className="form-control col-5"/>
  				<input type="submit" className="btn btn-default" value="Search"></input>
  			</form>
        <div className="row">
          <div className="col-md-6">
            <div id="map" className="col-md-12">
              <GettingStartedGoogleMap
                center={this.state.center}
                centerContent={this.state.centerContent}
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
