import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { TabContent, TabPane, Alert } from 'reactstrap';
import Constants from '../Constants';
import { DescriptionForm, ContactInfoForm, PaymentForm, AddressForm } from './shop';
import $ from 'jquery';
import './AddShop.css';

class AddShop extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.displayError = this.displayError.bind(this);
    this.toggleWarning = this.toggleWarning.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this._googleMap = null;
    this._searchBox = null;
    this.state = {
      activeTab: '2',
      errorMessage: null,
      warningMessage: null,
      isAddressCorrect: false,
      isLoading: false
    };
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  displayError(msg) {
    this.setState({
      errorMessage: msg
    });
  }
  displayWarning(msg) {
    this.setState({
      warningMessage: msg
    });
  }
  loading(isLoading) {
    this.setState({
      isLoading: isLoading
    });
  }
  toggleError() {
    this.setState({
      errorMessage: null
    });
  }
  toggleWarning() {
    this.setState({
      warningMessage: null
    });
  }
  render() {
    return (
      <div className="container">
        <ul className="progressbar">
          <li className={(parseInt(this.state.activeTab) >= 1) ?'active' : ''}>Description</li>
          <li className={(parseInt(this.state.activeTab) >= 2) ?'active' : ''}>Address</li>
          <li className={(parseInt(this.state.activeTab) >= 3) ?'active' : ''}>Contact</li>
          <li className={(parseInt(this.state.activeTab) >= 4) ?'active' : ''}>Products</li>
          <li className={(parseInt(this.state.activeTab) >= 5) ?'active' : ''}>Payment</li>
        </ul>
        <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert>
        <Alert color="warning" isOpen={this.state.warningMessage !== null} toggle={this.toggleWarning}>{this.state.warningMessage}</Alert>
        <TabContent activeTab={this.state.activeTab} className="progressbar-content">
          <div className={this.state.isLoading ? 'loading': 'loading hidden'}><i className='fa fa-spinner fa-spin'></i></div>
          <TabPane tabId='1' className={this.state.isLoading ? 'hidden': ''}>
            <DescriptionForm onNext={() => { this.toggle('2'); }}/>
          </TabPane>
          <TabPane tabId='2' className={this.state.isLoading ? 'hidden': ''}>
            <AddressForm onPrevious={() => { this.toggle('1'); }} onNext={() => { this.toggle('3'); }} onLoading={(l) => {this.loading(l); }} onWarning={(msg) => { this.displayWarning(msg); }} onError={(msg) => { this.displayError(msg); }}/>
          </TabPane>
          <TabPane tabId='3' className={this.state.isLoading ? 'hidden': ''}>
            <ContactInfoForm onError={(msg) => { this.displayError(msg); }} onPrevious={() => { this.toggle('2'); }} onNext={() => { this.toggle('4'); }}/>
          </TabPane>
          <TabPane tabId='4' className={this.state.isLoading ? 'hidden': ''}>
            <section className="col-md-12 section">
              <button type='button' className='btn btn-success'><span className='fa fa-plus glyphicon-align-left'></span> Add product</button>
            </section>
            <section className="col-md-12 sub-section">
    					<button className="btn btn-primary previous" onClick={() => { this.toggle('3'); }}>Previous</button>
      				<button className="btn btn-primary next" onClick={() => { this.toggle('5'); }}>Next</button>
            </section>
          </TabPane>
          <TabPane tabId='5' className={this.state.isLoading ? 'hidden': ''}>
            <PaymentForm onError={(msg) => { this.displayError(msg); }}  onPrevious={() => { this.toggle('4'); }} />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default AddShop;
