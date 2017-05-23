import React, {Component} from "react";
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert} from "reactstrap";
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import {Address, EditableTextArea, EditableCategory, PaymentMethodsSelector} from '../components';
import {NavLink} from "react-router-dom";
import Comment from "./comment";
import BestDeals from "./bestDeals";
import "./profile.css";

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
        this.refreshScore = this.refreshScore.bind(this);
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
          shop : props.shop,
          user: props.user,
          isEditable: props.isEditable,
          errorMessagePaymentMethods: null,
          errorMessageAddress: null
        };
    }

    onMapLoad(map) {
        this._googleMap = map;
    }

    refreshScore() {
        this.props.onRefreshScore();
    }

    closeModalAddress() {
      this.setState({
        isModalAddressOpened: false
      });
    }

    closeModalPayments() {
      this.setState({
        isModalPaymentsOpened: false
      });
    }

    closePaymentMethodsError() {
      this.setState({
        errorMessagePaymentMethods: null
      });
    }

    closeAddressError() {
      this.setState({
        errorMessageAddress: null
      });
    }

    openModalAddress() {
      this.setState({
        isModalAddressOpened: true
      });
    }

    openModalPayments() {
      this.setState({
        isModalPaymentsOpened: true
      });
    }

    updateAddress() {
      var address = this.refs.address.getAddress();
      var shop = this.state.shop;
      shop.street_address = address.street_address;
      this.setState({
        shop: shop,
        isModalAddressOpened: false
      });
    }

    updatePaymentMethods() {
      var arr = this.refs.paymentMethods.validate();
      if (!arr || arr === null) {
        return;
      }

      var shop = this.state.shop;
      shop.payments = arr;
      this.setState({
        isModalPaymentsOpened: false,
        shop: shop
      });
    }

    render() {
        var self = this,
            payments = self.state.shop.payments,
            paymentsInner = [];
        if (!payments || payments.length === 0) {
            paymentsInner.push((<span className="col-md-12">No payment</span>));
        } else {
            payments.forEach(function (payment) {
                switch (payment.method) {
                    case "Cash":
                    case "cash":
                        paymentsInner.push((
                            <div className="col-md-3 contact">
                                <i className="fa fa-money fa-3"></i><br/>
                                <label>Cash</label>
                            </div>
                        ));
                        break;
                    case "BankTransfer":
                    case "bank_transfer":
                        paymentsInner.push((
                            <div className="col-md-3 contact">
                                <i className="fa fa-credit-card fa-3"></i><br/>
                                <label>Bank transfer</label><br />
                                <label>IBAN : <i>{payment.iban}</i></label>
                            </div>
                        ));
                        break;
                    case "PayPal":
                    case "paypal":
                        paymentsInner.push((
                            <div className="col-md-3 contact">
                                <i className="fa fa-paypal fa-3"></i><br/>
                                <label>Paypal</label>
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
            <section className="row white-section shop-section shop-section-padding">
                <h5 className="col-md-12">Description</h5>
                {this.state.isEditable ? (<EditableTextArea value={this.state.shop.description} />) : (
                  <p className="col-md-12">{this.state.shop.description}</p>
                )}
            </section>
            <section className="row white-section sub-section shop-section-padding">
              <h5 className="col-md-12">Category</h5>
              {this.state.isEditable ? (<EditableCategory value={categoryName} />) : (
                <p className="col-md-12">{categoryName}</p>
              )}
            </section>
            <section className="row white-section sub-section shop-section-padding">
                <h5>Payment methods</h5>
                { this.state.isEditable && (<Button outline color="secondary" size="sm" onClick={this.openModalPayments}><i className="fa fa-pencil"></i></Button>) }
                <div className="row col-md-12">
                  {paymentsInner}
                </div>
            </section>
            <section className="row white-section sub-section shop-section-padding">
                <h5>Contact information</h5>
                { this.state.isEditable && (<NavLink to="/manage/profile" className="btn btn-outline-secondary btn-sm"><i className="fa fa-pencil"></i></NavLink>) }
                <div className="row col-md-12">
                    <div className="col-md-3 contact">
                        <i className="fa fa-envelope fa-3"></i><br />
                        <span>{this.state.user.email}</span>
                    </div>
                    <div className="col-md-3 contact">
                        <i className="fa fa-phone fa-3"></i><br />
                        <span>{this.state.user.home_phone_number}</span>
                    </div>
                    <div className="col-md-3 contact">
                        <i className="fa fa-mobile fa-3"></i><br />
                        <span>{this.state.user.mobile_phone_number}</span>
                    </div>
                    <div className="col-md-3 contact">
                        {this.state.isEditable ? (<button className="btn btn-default" onClick={() => { this.openModalAddress(); }}><i className="fa fa-map-marker fa-3"></i></button>) :
                          (<i className="fa fa-map-marker fa-3"></i>
                        )}<br />
                        <span>{this.state.shop.street_address}</span>
                    </div>
                </div>
                <div className="col-md-12 map">
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
            <Comment shop={self.state.shop} onRefreshScore={this.refreshScore}/>
            <BestDeals shop={self.state.shop}/>
            {/* Modal window for the address */}
            <Modal size="lg" isOpen={this.state.isModalAddressOpened}>
                <ModalHeader toggle={() => { self.closeModalAddress();}}>Update address</ModalHeader>
                <ModalBody>
                  <Alert color="danger" isOpen={this.state.errorMessageAddress !== null} toggle={this.closeAddressError}>{this.state.errorMessageAddress}</Alert>
                  <Address ref="address" onError={(m) => {
                    self.setState({
                      errorMessageAddress: m
                    });
                  }} />
                </ModalBody>
                <ModalFooter>
                  <button className="btn btn-success" onClick={() => {self.updateAddress(); }}>Validate</button>
                  <button className="btn btn-default" onClick={self.closeModalAddress}>Cancel</button>
                </ModalFooter>
            </Modal>
            {/* Modal window for the payment methods */}
            <Modal size="lg" isOpen={this.state.isModalPaymentsOpened}>
              <ModalHeader toggle={() => { self.closeModalPayments(); }}>Update payment methods</ModalHeader>
              <ModalBody>
                <Alert color="danger" isOpen={this.state.errorMessagePaymentMethods !== null} toggle={this.closePaymentMethodsError}>{this.state.errorMessagePaymentMethods}</Alert>
                <PaymentMethodsSelector ref="paymentMethods"  onError={(m) => {
                  self.setState({
                    errorMessagePaymentMethods: m
                  });
                }} />
              </ModalBody>
              <ModalFooter>
                <button className="btn btn-success" onClick={(r) => {self.updatePaymentMethods(r); }}>Validate</button>
                <button className="btn btn-default" onClick={self.closeModalPayments}>Cancel</button>
              </ModalFooter>
            </Modal>
        </div>);
    }
}

export default ShopProfile;
