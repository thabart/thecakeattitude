import React, { Component } from 'react';
import { TabContent, TabPane } from 'reactstrap';
import { withGoogleMap, GoogleMap} from 'react-google-maps';
import './AddShop.css';

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={3}
    defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
  >
  </GoogleMap>
));
class AddShop extends Component {
  constructor(props) {
    super(props);
    this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      center: null
    };
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
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
                    center={this.state.center}
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
}

export default AddShop;
