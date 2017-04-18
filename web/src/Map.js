import React, { Component } from 'react';
import TrendingSellers from './widgets/trendingSellers';
import BestDeals from './widgets/bestDeals';
import PublicAnnouncements from './widgets/publicAnnouncements';
import './Map.css';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';

class Map extends Component {
  render() {
    return (
      <div>
        <form className="row justify-content-center search">
  				<input type="text" className="form-control col-5"/>
  				<input type="submit" className="btn btn-default" value="Search"></input>
  			</form>
        <div className="row">
          <div className="col-md-6">
            <div id="map" className="col-md-12"></div>
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
    $(this.widgetContainer).sortable({
      handle: '.card-header',
      opacity: 0.4,
      placeholder: 'placeholder',
      forcePlaceholderSize: true,
      cursor: 'move'
    });
  }
}

export default Map;
