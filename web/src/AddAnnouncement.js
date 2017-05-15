import React, {Component} from "react";
import {TabContent, TabPane, Alert} from "reactstrap";
import {DescriptionAnnouncement} from './addannouncetabs';
import {AddressForm} from "./addshoptabs";

class AddAnnouncement extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleWarning = this.toggleWarning.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.loading = this.loading.bind(this);
    this.state = {
        activeTab: '1',
        errorMessage: null,
        warningMessage: null,
        isLoading: false
    };
  }
  toggle(tab, json) {
    var self = this;
    if (json) {
      self.data[self.state.activeTab] = json;
    }

    if (self.state.activeTab !== tab) {
      self.setState({
        activeTab: tab
      });
    }

    if (tab === '2') {
      self.refs.adrAnnouncement.display();
    }
  }
  toggleError() {
    this.setState({
      errorMessage: null
    });
  }
  loading(isLoading) {
    this.setState({
      isLoading: isLoading
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
                <li className={(parseInt(this.state.activeTab) >= 1) ? 'active' : ''}>Description</li>
                <li className={(parseInt(this.state.activeTab) >= 2) ? 'active' : ''}>Address</li>
            </ul>
            <Alert color="danger" isOpen={this.state.errorMessage !== null}
                   toggle={this.toggleError}>{this.state.errorMessage}</Alert>
            <Alert color="warning" isOpen={this.state.warningMessage !== null}
                   toggle={this.toggleWarning}>{this.state.warningMessage}</Alert>
            <TabContent activeTab={this.state.activeTab} className="white-section progressbar-content">
                <div className={this.state.isLoading ? 'loading' : 'loading hidden'}><i
                    className='fa fa-spinner fa-spin'></i></div>
                <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
                  <DescriptionAnnouncement onNext={(json) => {
                      this.toggle('2', json);
                    }}/>
                </TabPane>
                <TabPane tabId='2' className={this.state.isLoading ? 'hidden' : ''}>
                  <AddressForm ref="adrAnnouncement" onPrevious={() => {
                      this.toggle('1');
                  }} onLoading={(l) => {
                      this.loading(l);
                  }}/>
                </TabPane>
            </TabContent>
        </div>);
  }
}

export default AddAnnouncement;
