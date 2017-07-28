import React, {Component} from "react";
import {TabContent, TabPane, Alert} from "reactstrap";
import {withRouter} from "react-router";
import {DescriptionForm, ContactInfoForm, PaymentForm, AddressForm, ProductForm} from "./addshoptabs";
import {ShopsService} from "./services/index";
import { translate } from 'react-i18next';
import $ from "jquery";
import MainLayout from './MainLayout';

class AddShop extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.displayError = this.displayError.bind(this);
        this.toggleWarning = this.toggleWarning.bind(this);
        this.toggleError = this.toggleError.bind(this);
        this.save = this.save.bind(this);
        this._googleMap = null;
        this._searchBox = null;
        this.data = {};
        this.state = {
            activeTab: '2',
            errorMessage: null,
            warningMessage: null,
            isAddressCorrect: false,
            isLoading: false
        };
    }

    toggle(tab, json) { // Change tab.
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
            self.refs.addressForm.display();
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

    save(json) {
        var content = json,
            self = this;
        if (!this.data || !this.data['1'] || !this.data['2']) {
            this.displayError('The request cannot be saved because the information are not complete');
            return;
        }

        for (var key in this.data) {
            $.extend(content, this.data[key]);
        }

        self.loading(true);
        ShopsService.add(content).then(function () {
            self.loading(false);
            self.props.history.push('/');
        }).catch(function (e) {
            self.loading(false);
            var json = e.responseJSON;
            if (json && json.error_description) {
                self.displayError(json.error_description);
            } else {
                self.displayError('an error occurred while trying to add the shop');
            }
        });
    }

    render() {
      const {t} = this.props;
        return (
            <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
              <div className="container">
                  <div className="mt-1 mb-1 p-1 bg-white rounded">
                      <ul className="progressbar progressbar-with-counter" style={{width: "100%"}}>
                        <li className="col-2 active"><div className="counter-rounded">1</div>{t('description')}</li>
                        <li className={this.state.activeTab >= 2 ? "col-2 active" : "col-2"}><div className="counter-rounded">2</div>{t('address')}</li>
                        <li className={this.state.activeTab >= 3 ? "col-2 active" : "col-2"}><div className="counter-rounded">3</div>{t('contact')}</li>
                        <li className={this.state.activeTab >= 4 ? "col-2 active" : "col-2"}><div className="counter-rounded">4</div>{t('products')}</li>
                        <li className={this.state.activeTab === 5 ? "col-2 active" : "col-2"}><div className="counter-rounded">5</div>{t('payment')}</li>
                      </ul>
                  </div>
                  <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>
                      {this.state.errorMessage}
                  </Alert>
                  <Alert color="warning" isOpen={this.state.warningMessage !== null} toggle={this.toggleWarning}>
                      {this.state.warningMessage}
                  </Alert>
                  <TabContent activeTab={this.state.activeTab}>
                      <div className={this.state.isLoading ? 'loading' : 'loading hidden'}>
                          <i className='fa fa-spinner fa-spin'/>
                      </div>
                      <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
                          <DescriptionForm onNext={(json) => {
                              this.toggle('2', json);
                          }} onLoading={(l) => {
                              this.loading(l);
                          }} onError={(msg) => {
                              this.displayError(msg);
                          }}/>
                      </TabPane>
                      <TabPane tabId='2' className={this.state.isLoading ? 'hidden' : ''}>
                          <AddressForm ref="addressForm" onPrevious={() => {
                              this.toggle('1');
                          }} onNext={(json) => {
                              this.toggle('3', json);
                          }} onLoading={(l) => {
                              this.loading(l);
                          }} onWarning={(msg) => {
                              this.displayWarning(msg);
                          }} onError={(msg) => {
                              this.displayError(msg);
                          }}/>
                      </TabPane>
                      <TabPane tabId='3' className={this.state.isLoading ? 'hidden' : ''}>
                          <ContactInfoForm onError={(msg) => {
                              this.displayError(msg);
                          }} onPrevious={() => {
                              this.toggle('2');
                          }} onNext={() => {
                              this.toggle('4');
                          }}/>
                      </TabPane>
                      <TabPane tabId='4' className={this.state.isLoading ? 'hidden' : ''}>
                          <ProductForm onPrevious={() => {
                              this.toggle('3');
                          }} onNext={(json) => {
                              this.toggle('5', json);
                          }}/>
                      </TabPane>
                      <TabPane tabId='5' className={this.state.isLoading ? 'hidden' : ''}>
                          <PaymentForm onError={(msg) => {
                              this.displayError(msg);
                          }} onPrevious={() => {
                              this.toggle('4');
                          }} onConfirm={ (json) => {
                              this.save(json);
                          }}/>
                      </TabPane>
                  </TabContent>
              </div>
            </MainLayout>
        );
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(AddShop));
