import React, {Component} from "react";
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps";
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
    }

    onMapLoad(map) {
        this._googleMap = map;
    }

    refreshScore() {
        this.props.onRefreshScore();
    }

    render() {
        var self = this,
            payments = self.props.shop.payments,
            paymentsInner = [];
        if (!payments || payments.length === 0) {
            paymentsInner.push((<span className="col-md-12">No payment</span>));
        } else {
            payments.forEach(function (payment) {
                switch (payment.method) {
                    case "Cash":
                        paymentsInner.push((
                            <div className="col-md-3 contact">
                                <i className="fa fa-money fa-3"></i><br/>
                                <label>Cash</label>
                            </div>
                        ));
                        break;
                    case "BankTransfer":
                        paymentsInner.push((
                            <div className="col-md-3 contact">
                                <i className="fa fa-credit-card fa-3"></i><br/>
                                <label>Bank transfer</label><br />
                                <label>IBAN : <i>{payment.iban}</i></label>
                            </div>
                        ));
                        break;
                    case "PayPal":
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

        return ( <div>
            <section className="row white-section shop-section shop-section-padding">
                <h5 className="col-md-12">Description</h5>
                <p className="col-md-12">{this.props.shop.description}</p>
            </section>
            <section className="row white-section sub-section shop-section-padding">
                <h5 className="col-md-12">Payment methods</h5>
                <div className="row col-md-12">
                    {paymentsInner}
                </div>
            </section>
            <section className="row white-section sub-section shop-section-padding">
                <h5 className="col-md-12">Contact information</h5>
                <div className="row col-md-12">
                    <div className="col-md-3 contact">
                        <i className="fa fa-envelope fa-3"></i><br />
                        <span>{this.props.user.email}</span>
                    </div>
                    <div className="col-md-3 contact">
                        <i className="fa fa-phone fa-3"></i><br />
                        <span>{this.props.user.home_phone_number}</span>
                    </div>
                    <div className="col-md-3 contact">
                        <i className="fa fa-mobile fa-3"></i><br />
                        <span>{this.props.user.mobile_phone_number}</span>
                    </div>
                    <div className="col-md-3 contact">
                        <i className="fa fa-map-marker fa-3"></i><br />
                        <span>{this.props.shop.street_address}</span>
                    </div>
                </div>
                <div className="col-md-12 map">
                    <GettingStartedGoogleMap
                        center={this.props.shop.location}
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
            <Comment shop={self.props.shop} onRefreshScore={this.refreshScore}/>
            <BestDeals shop={self.props.shop}/>
        </div>);
    }
}

export default ShopProfile;
