import React, { Component } from "react";
import { TabContent, TabPane, Alert } from "reactstrap";
import { DescriptionClientService, AddressClientService } from "./addclientservicetabs";
import { withRouter } from "react-router";
import { ClientService } from "./services/index";
import { ApplicationStore } from './stores';
import { translate } from 'react-i18next';
import MainLayout from './MainLayout';

class AddClientService extends Component {
    constructor(props) {
        super(props);
        this._commonId = null;
        this._waitForToken = null;
        this.toggle = this.toggle.bind(this);
        this.toggleWarning = this.toggleWarning.bind(this);
        this.toggleError = this.toggleError.bind(this);
        this.loading = this.loading.bind(this);
        this.displayError = this.displayError.bind(this);
        this.save = this.save.bind(this);
        this.data = {};
        this.state = {
            activeTab: '1',
            errorMessage: null,
            warningMessage: null,
            isLoading: false,
            errorMessage: null
        };
    }

    displayError(msg) { // Display error message.
        this.setState({
            errorMessage: msg
        });
    }

    save(adr) { // Save the client service.
        var self = this;
        const {t} = this.props;
        var firstTabJson = self.data['1'];
        var json = {
            name: firstTabJson.name,
            description: firstTabJson.description,
            category_id: firstTabJson.category_id,
            price: firstTabJson.price,
            location: adr.location,
            place_id: adr.google_place_id,
            street_address: adr.street_address
        };
        self.loading(true);
        ClientService.add(json).then(function () {
            self.loading(false);
            self.props.history.push('/map');
        }).catch(function (e) {
            self.loading(false);
            var json = e.responseJSON;
            if (json && json.error_description) {
                ApplicationStore.sendMessage({
                    message: json.error_description,
                    level: 'error',
                    position: 'tr'
                });
            } else {
                ApplicationStore.sendMessage({
                    message: t('errorSaveClientService'),
                    level: 'error',
                    position: 'tr'
                });
            }
        });
    }

    toggle(tab, json) { // Toggle the tab content.
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
            self.refs.adrAnnouncement.getWrappedInstance().display();
        }
    }

    toggleError() { // Toggle error message.
        this.setState({
            errorMessage: null
        });
    }

    loading(isLoading) { // Display loading spinner.
        this.setState({
            isLoading: isLoading
        });
    }

    toggleWarning() { // Toggle warning message.
        this.setState({
            warningMessage: null
        });
    }

    render() {
        const {t} = this.props;
        return (
            <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
              <div className="container">
                { /* Navigation */ }
                <div className="mt-1 mb-1 p-1 bg-white rounded">
                    <ul className="progressbar progressbar-with-counter" style={{width: "100%"}}>
                      <li className="col-6 active"><div className="counter-rounded">1</div>{t('description')}</li>
                      <li className={this.state.activeTab >= '2' ? "col-6 active" : "col-6"}><div className="counter-rounded">2</div>{t('address')}</li>
                    </ul>
                </div>
                { /* Display error message */ }
                <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert>
                { /* Display warning message */ }
                <Alert color="warning" isOpen={this.state.warningMessage !== null} toggle={this.toggleWarning}>{this.state.warningMessage}</Alert>
                { /* Display tab content */ }
                <TabContent activeTab={this.state.activeTab}>
                  <div className={this.state.isLoading ? 'loading' : 'loading hidden'}><i className='fa fa-spinner fa-spin'></i></div>
                  { /* Description tab */ }
                  <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
                    <DescriptionClientService onNext={(json) => { this.toggle('2', json); }}/>
                  </TabPane>
                  { /* Address tab */ }
                  <TabPane tabId='2' className={this.state.isLoading ? 'hidden' : ''}>
                    <AddressClientService ref="adrAnnouncement" onPrevious={() => { this.toggle('1'); }}
                      onLoading={(l) => { this.loading(l); }} onNext={(l) => { this.save(l); }} nextButtonLabel="Confirm" />
                  </TabPane>
                 </TabContent>
              </div>
            </MainLayout>
        );
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(AddClientService));
