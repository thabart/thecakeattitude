import React, { Component } from 'react';
import TrendingSellers from './widgets/trendingSellers';
import BestDeals from './widgets/bestDeals';
import PublicAnnouncements from './widgets/publicAnnouncements';

class Map extends Component {
  render() {
    return (
      <div>
        <form className="row justify-content-center">
  				<input type="text" className="form-control col-5"/>
  				<input type="submit" className="btn btn-default" value="Search"></input>
  			</form>
        <div className="row">
          <div className="col-md-6">
            <div id="map" className="col-md-12"></div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-5 cell">
                <TrendingSellers />
              </div>
              <div className="col-md-5 cell">
                <BestDeals />
              </div>
              <div className="col-md-10 cell">
                <PublicAnnouncements />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
