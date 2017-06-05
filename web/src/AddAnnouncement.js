import React, {Component} from "react";
import Stepper from "react-stepper-horizontal";
import {TabContent, TabPane, Alert} from "reactstrap";
import {DescriptionAnnouncement} from "./addannouncetabs";
import {AddressForm} from "./addshoptabs";
import {withRouter} from "react-router";
import {AnnouncementsService} from "./services/index";

class AddAnnouncement extends Component {
    constructor(props) {
        super(props);
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
            errorMessage: null,
            steps: [{
                title: 'Description'
            }, {
                title: 'Address'
            }]
        };
    }

    displayError(msg) {
        this.setState({
            errorMessage: msg
        });
    }

    save(adr) {
        var self = this;
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
        AnnouncementsService.add(json).then(function () {
            self.loading(false);
            self.props.history.push('/');
        }).catch(function (e) {
            self.loading(false);
            var json = e.responseJSON;
            if (json && json.error_description) {
                self.displayError(json.error_description);
            } else {
                self.displayError('an error occured while trying to add the announce');
            }
        });
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
                <div className="mt-1 mb-1 p-1 bg-white rounded">
                    <Stepper steps={this.state.steps} activeStep={this.state.activeTab}/>
                </div>

                <Alert color="danger"
                       isOpen={this.state.errorMessage !== null}
                       toggle={this.toggleError}>{this.state.errorMessage}
                </Alert>

                <Alert color="warning"
                       isOpen={this.state.warningMessage !== null}
                       toggle={this.toggleWarning}>{this.state.warningMessage}
                </Alert>

                <TabContent activeTab={this.state.activeTab} className="white-section progressbar-content">
                    <div className={this.state.isLoading ? 'loading' : 'loading hidden'}>
                        <i className='fa fa-spinner fa-spin'></i>
                    </div>
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
                        }} onNext={(l) => {
                            this.save(l);
                        }}
                                     nextButtonLabel="Confirm"/>
                    </TabPane>
                </TabContent>
            </div>);
    }
}

export default withRouter(AddAnnouncement);
