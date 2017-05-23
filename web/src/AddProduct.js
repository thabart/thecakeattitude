import React, {Component} from "react";
import {Alert, TabContent, TabPane} from 'reactstrap';
import {DescriptionTab, CharacteristicsTab} from './addproductabs';

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this._data = {};
    this.closeWarning = this.closeWarning.bind(this);
    this.closeError = this.closeError.bind(this);
    this.confirm = this.confirm.bind(this);
    this.state = {
      activeTab : '2',
      errorMessage: null,
      warningMessage: null,
      isLoading: false
    };
  }
  toggle(tab, json) {
    var self = this;
    if (json) {
      self._data[self.state.activeTab] = json;
    }

    if (self.state.activeTab !== tab) {
      self.setState({
        activeTab: tab
      });
    }
  }
  closeWarning() {
    this.setState({
      warningMessage: null
    });
  }
  closeError() {
    this.setState({
      errorMessage: null
    });
  }
  confirm() {

  }
  render() {
    return (<div className="container">
            <ul className="progressbar">
                <li className={(parseInt(this.state.activeTab) >= 1) ? 'active' : ''}>Description</li>
                <li className={(parseInt(this.state.activeTab) >= 2) ? 'active' : ''}>Characteristics</li>
            </ul>
            <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert>
            <Alert color="warning" isOpen={this.state.warningMessage !== null} toggle={this.closeWarning}>{this.state.warningMessage}</Alert>
            <TabContent activeTab={this.state.activeTab} className="white-section progressbar-content">
                <div className={this.state.isLoading ? 'loading' : 'loading hidden'}><i className='fa fa-spinner fa-spin'></i></div>
                <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
                  <DescriptionTab next={(json) => {this.toggle('2', json); }} />
                </TabPane>
                <TabPane tabId='2' className={this.state.isLoading ? 'hidden' : ''}>
                  <CharacteristicsTab previous={() => { this.toggle('1');}} confirm={() => { this.confirm(); }} />
                </TabPane>
            </TabContent>
      </div>);
  }
}

export default AddProduct;
