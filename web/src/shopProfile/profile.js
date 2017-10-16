import React, {Component} from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert,Tooltip } from "reactstrap";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { Address, EditableTextArea, PaymentMethodsSelector } from '../components';
import { NavLink } from "react-router-dom";
import { translate } from 'react-i18next';
import AppDispatcher from '../appDispatcher';
import Constants from '../../Constants';
import Comment from "./comment";
import BestDeals from "./bestDeals";
const shopOpts = {
    url: '/images/shop-pin.png',
    scaledSize: new window.google.maps.Size(34, 38)
};

const GettingStartedGoogleMap = withGoogleMap(props => {
    return (
        <GoogleMap
            ref={props.onMapLoad}
            center={props.center}
            defaultZoom={12}
        >
            <Marker
                icon={shopOpts}
                position={props.center}/>
        </GoogleMap>
    );
});

class ShopProfile extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.onMapLoad = this.onMapLoad.bind(this);
        this.closeModalAddress = this.closeModalAddress.bind(this);
        this.closeModalPayments = this.closeModalPayments.bind(this);
        this.closePaymentMethodsError = this.closePaymentMethodsError.bind(this);
        this.closeAddressError = this.closeAddressError.bind(this);
        this.openModalAddress = this.openModalAddress.bind(this);
        this.openModalPayments = this.openModalPayments.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.updatePaymentMethods = this.updatePaymentMethods.bind(this);
        this.state = {
            isModalAddressOpened: false,
            isModalPaymentsOpened: false,
            shop: props.shop,
            user: props.user,
            isEditable: props.isEditable,
            errorMessagePaymentMethods: null,
            errorMessageAddress: null,
            isAdrValidateEnabled: true,
            isEditShopAddressTooltipOpened: false, // Tooltip visibility.
            isEditContactInformationTooltipOpened: false,
            isEditPaymentMethodsTooltipOpened: false
        };
    }

    toggle(name) { // Toggle the tooltip.
        var value = !this.state[name];
        this.setState({
            [name]: value
        });
    }

    onMapLoad(map) { // Store google map reference.
        this._googleMap = map;
    }

    closeModalAddress() { // Close modal address.
        this.setState({
            isModalAddressOpened: false
        });
    }

    closeModalPayments() { // Close modal payment.
        this.setState({
            isModalPaymentsOpened: false
        });
    }

    closePaymentMethodsError() { // Close error in modal payment.
        this.setState({
            errorMessagePaymentMethods: null
        });
    }

    closeAddressError() { // Close error in modal address.
        this.setState({
            errorMessageAddress: null
        });
    }

    openModalAddress() { // Open modal address.
        this.setState({
            isModalAddressOpened: true
        });
    }

    openModalPayments() { // Open modal payment.
        this.setState({
            isModalPaymentsOpened: true
        });
    }

    updateAddress() { // Update the address.
        var address = this.refs.address.getWrappedInstance().getAddress();
        var shop = this.state.shop;
        shop.street_address = address.street_address;
        shop.location = {
            lng: address.location.lng(),
            lat: address.location.lat()
        };
        this.setState({
            shop: shop,
            isModalAddressOpened: false
        });
        AppDispatcher.dispatch({
            actionName: Constants.events.UPDATE_SHOP_INFORMATION_ACT,
            data: address
        });
    }

    updatePaymentMethods() { // Update payment methods.
        var arr = this.refs.paymentMethods.getWrappedInstance().validate();
        if (!arr || arr === null) {
            return;
        }

        var shop = this.state.shop;
        shop.payments = arr;
        this.setState({
            isModalPaymentsOpened: false,
            shop: shop
        });
        AppDispatcher.dispatch({
            actionName: Constants.events.UPDATE_SHOP_INFORMATION_ACT,
            data: { payments: arr }
        });
    }

    render() { // Display the view.
        var self = this,
            payments = self.state.shop.payments,
            paymentsInner = [];
        const {t} = this.props;
        if (!payments || payments.length === 0) {
            paymentsInner.push((<span className="col-md-12">{t('noPaymentMethod')}</span>));
        } else {
            payments.forEach(function (payment) {
                switch (payment.method) {
                    case "Cash":
                    case "cash":
                        paymentsInner.push((
                            <div className="col-md-3 shop-badge">
                                <i className="fa fa-money fa-3 icon"></i><br/>
                                <label>{t('cash')}</label>
                            </div>
                        ));
                        break;
                    case "BankTransfer":
                    case "bank_transfer":
                        paymentsInner.push((
                            <div className="col-md-3 shop-badge">
                                <i className="fa fa-credit-card fa-3 icon"></i><br/>
                                <label>{t('bankTransfer')}</label><br />
                                <label>IBAN : <i>{payment.iban}</i></label>
                            </div>
                        ));
                        break;
                    case "PayPal":
                    case "paypal":
                        paymentsInner.push((
                            <div className="col-md-3 shop-badge">
                                <i className="fa fa-paypal fa-3 icon"></i><br/>
                                <label>{t('paypal')}</label><br />
                                <label>{payment.paypal_account}</label>
                            </div>
                        ));
                        break;
                }
            });
        }

        var categoryName = null;
        if (this.state.shop && this.state.shop.category) {
            categoryName = this.state.shop.category.name;
        }

        return ( <div>
            { /*General information */ }
            <section className="section row" style={{marginTop: "20px"}}>
              { /* Owner */ }
              <div className="col-md-12" style={{paddingTop: "20px"}}>
                <h5>{t('owner')}</h5>
                <NavLink to={"/users/" + this.state.shop.subject} className="no-decoration red">{t('visitTheProfile')}</NavLink>
              </div>
              { /* Description */ }
              <div className="col-md-12" style={{paddingTop: "20px"}}>
                <h5>{t('description')}</h5>
                {this.state.isEditable ? (<EditableTextArea value={this.state.shop.description}
                                                            minLength={1}
                                                            maxLength={255}
                                                            validate={(i) => {
                                                                AppDispatcher.dispatch({
                                                                    actionName: Constants.events.UPDATE_SHOP_INFORMATION_ACT,
                                                                    data: {description: i}
                                                                });
                                                            }}/>) : (
                    <p>{this.state.shop.description}</p>
                )}
              </div>
              <div className="section-separation"></div>
              { /* Category */ }
              <div className="col-md-12" style={{paddingTop: "20px"}}>
                <h5>{t('category')}</h5>
                <p><NavLink to={"/shopcategories/" + this.state.shop.category_id} className="no-decoration red">{categoryName}</NavLink></p>
              </div>
              <div className="section-separation"></div>
              { /* Payment methods */ }
              <div className="col-md-12" style={{paddingTop: "20px"}}>
                  <h5>{t('paymentMethods')}</h5>
                  { this.state.isEditable && (
                      <div>
                        <Button id="edit-payment-methods" outline color="secondary" size="sm" className="btn-icon with-border" onClick={this.openModalPayments}>
                          <i className="fa fa-pencil"></i>
                        </Button>
                        <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isEditPaymentMethodsTooltipOpened} target="edit-payment-methods" toggle={() => this.toggle('isEditPaymentMethodsTooltipOpened')}>
                            {t('editPaymentMethodsTooltip')}
                        </Tooltip>
                      </div>) }
                  <div className="row col-md-12">
                      {paymentsInner}
                  </div>
              </div>
            </section>
            { /* Contact information & Address */ }
            <section className="section row" style={{marginTop: "20px", paddingTop: "20px"}}>
              <div className="col-md-12">
                <h5>{t('contactInformation')}</h5>
                { this.state.isEditable && (
                  <div>
                    <NavLink id="edit-profile-information" to="/manage/profile" className="btn btn-outline-secondary btn-sm btn-icon with-border">
                      <i className="fa fa-pencil"></i>
                    </NavLink>
                    <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isEditContactInformationTooltipOpened} target="edit-profile-information" toggle={() => this.toggle('isEditContactInformationTooltipOpened')}>
                        {t('editShopContactInformationTooltip')}
                    </Tooltip>
                  </div>)
                }
                <div className="row">
                  { /* Email */ }
                  <div className="col-md-3 shop-badge">
                    <i className="fa fa-envelope fa-3 icon"></i><br />
                    <span>{this.state.user.email}</span>
                  </div>
                  { /* Home phone */ }
                  <div className="col-md-3 shop-badge">
                    <i className="fa fa-phone fa-3 icon"></i><br />
                    <span>{this.state.user.home_phone_number}</span>
                  </div>
                  { /* Mobile phone */ }
                  <div className="col-md-3 shop-badge">
                    <i className="fa fa-mobile fa-3 icon"></i><br />
                    <span>{this.state.user.mobile_phone_number}</span>
                  </div>
                  { /* Address */ }
                  <div className="col-md-3 shop-badge">
                    {this.state.isEditable ? (
                      <div className="editable">
                        <Button id="edit-shop-address" className="btn btn-outline-secondary btn-sm btn-icon with-border edit-icon" onClick={this.openModalAddress}><i className="fa fa-pencil"></i></Button>
                        <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isEditShopAddressTooltipOpened} target="edit-shop-address" toggle={() => this.toggle('isEditShopAddressTooltipOpened')}>
                            {t('editShopAddressTooltip')}
                        </Tooltip>
                        <i className="fa fa-map-marker fa-3 icon"></i>
                      </div>
                    ) : (<i className="fa fa-map-marker fa-3 icon"></i>)
                    }
                    <br />
                    <span>{this.state.shop.street_address}</span>
                  </div>
                </div>
              </div>
              <div className="col-md-12" style={{marginBottom : "20px", width: "300px", height: "300px"}}>
                <GettingStartedGoogleMap
                  center={this.state.shop.location}
                  onMapLoad={this.onMapLoad}
                  containerElement={
                    <div style={{height: `100%`}}/>
                  }
                  mapElement={
                    <div style={{height: `100%`}}/>
                  }>
                </GettingStartedGoogleMap>
              </div>
            </section>
            { /* Comments */ }
            <section className="section row" style={{marginTop: "20px", paddingTop: "20px"}}>
              <div className="col-md-12">
                <Comment shop={self.state.shop}/>
              </div>
            </section>
            { /* Best deals */ }
            <section className="section row" style={{marginTop: "20px", paddingTop: "20px"}}>
              <div className="col-md-12">
                <BestDeals shop={self.state.shop}/>
              </div>
            </section>
            {/* Modal window for the address */}
            <Modal size="lg" isOpen={this.state.isModalAddressOpened}>
                <ModalHeader toggle={() => {
                    self.closeModalAddress();
                }}>{t('updateShopAddressModalTitle')}</ModalHeader>
                <ModalBody>
                    <Alert color="danger" isOpen={this.state.errorMessageAddress !== null}
                           toggle={this.closeAddressError}>{this.state.errorMessageAddress}</Alert>
                    <Address ref="address" onError={(m) => {
                        self.setState({
                            errorMessageAddress: m
                        });
                    }} position={this.state.shop.location} addressCorrect={(m) => {
                        self.setState({
                            isAdrValidateEnabled: m
                        });
                    }}/>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-default" onClick={() => {
                        self.updateAddress();
                    }} disabled={!this.state.isAdrValidateEnabled}>{t('update')}
                    </button>
                    <button className="btn btn-default" onClick={self.closeModalAddress}>{t('cancel')}</button>
                </ModalFooter>
            </Modal>
            {/* Modal window for the payment methods */}
            <Modal size="lg" isOpen={this.state.isModalPaymentsOpened}>
                <ModalHeader toggle={() => {
                    self.closeModalPayments();
                }}>{t('updatePaymentMethodsModalTitle')}</ModalHeader>
                <ModalBody>
                    <Alert color="danger" isOpen={this.state.errorMessagePaymentMethods !== null}
                           toggle={this.closePaymentMethodsError}>{this.state.errorMessagePaymentMethods}</Alert>
                    <PaymentMethodsSelector ref="paymentMethods" onError={(m) => {
                        self.setState({
                            errorMessagePaymentMethods: m
                        });
                    }} payments={self.state.shop.payments}/>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-default" onClick={(r) => {
                        self.updatePaymentMethods(r);
                    }}>{t('update')}
                    </button>
                    <button className="btn btn-default" onClick={self.closeModalPayments}>{t('cancel')}</button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

export default translate('common', { wait: process && !process.release })(ShopProfile);
