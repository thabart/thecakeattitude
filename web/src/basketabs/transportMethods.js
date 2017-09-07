import React, { Component } from "react";
import { Button } from "reactstrap";
import { translate } from 'react-i18next';
import { BasketStore } from '../stores/index';
import { Address, DropLocations } from '../components/index';
import { DhlService, ShopsService, UpsService, UserService } from '../services/index';
import AppDispatcher from '../appDispatcher';
import Constants from '../../Constants';
import Promise from 'bluebird';

class TransportMethods extends Component {
  constructor(props) {
    super(props);
    this._order = null;
    this._shop = null;
    this._upsMarker = null;
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.selectTransportMethod = this.selectTransportMethod.bind(this);
    this.selectTransporter = this.selectTransporter.bind(this);
    this.selectParcelType = this.selectParcelType.bind(this);
    this.selectRating = this.selectRating.bind(this);
    this.addressCorrect = this.addressCorrect.bind(this);
    this.refreshUpsRatings = this.refreshUpsRatings.bind(this);
    this.refreshDhlRatings = this.refreshDhlRatings.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.state = {
      isLoading: false,
      transportMethod: 'manual',
      parcelType: null,
      transporter: null,
      dhlRating: null,
      isDhlRatingsLoading: false,
      isUpsLoading: false,
      estimatedPrice: 0,
      dhlRatings: []
    };
  }

  previous() { // Execute when the user clicks on previous.
    if (this.props.onPrevious) {
      this.props.onPrevious();
    }
  }

  next() { // Execute when the user clicks on next.
    if (this.props.onNext) {
      var selectedOrderId = BasketStore.getSelectedOrderId();
      var orders = BasketStore.getOrders();
      var order = orders.filter(function(o) { return o.id === selectedOrderId; })[0];
      order.transport_mode = this.state.transportMethod;
      AppDispatcher.dispatch({
        actionName: Constants.events.UPDATE_BASKET_INFORMATION_ACT,
        data: orders
      });
      this.props.onNext();
    }
  }

  selectTransportMethod(transportMethod) { // Select the transport method.
    if (this.state.transportMethod === transportMethod) return;
    this.setState({
      transportMethod: transportMethod,
      parcelType: null,
      dhlRating: null,
      dhlRatings: [],
      isDhlRatingsLoading: false,
      isUpsLoading: false,
      estimatedPrice: 0,
    });
  }

  selectTransporter(transporter) { // Select a transporter.
    if (this.state.transporter === transporter) return;
    this.setState({
      transporter: transporter,
      parcelType: null,
      dhlRating: null,
      dhlRatings: [],
      isDhlRatingsLoading: false,
      isUpsLoading: false,
      estimatedPrice: 0
    });
  }

  selectParcelType(parcelType) { // Select the parcel type.
    if (this.state.parcelType === parcelType) return;
    this.state.parcelType = parcelType;
    this.setState({
      parcelType: parcelType,
      dhlRating: null,
      dhlRatings: [],
      estimatedPrice: 0
    });
    if (this.state.transporter === 'ups') {
      this.refreshUpsRatings();
      return;
    }

    this.refreshDhlRatings();
  }

  selectRating(rating) { // Select the rating.
    this.setState({
      dhlRating: rating,
      estimatedPrice: rating.price_with_tax
    });
  }

  addressCorrect(b) { // Update the drop locations.
    if (!b || !this.refs.address) return;
    var adr = this.refs.address.getWrappedInstance().getAddress();
    if (this.refs.dropLocation) this.refs.dropLocation.getWrappedInstance().setAddress(adr);
    if (this.refs.upsDropLocation) this.refs.upsDropLocation.getWrappedInstance().setAddress(adr);
  }

  refreshUpsRatings() { // Refresh ups ratings.
    var request = {};
    var self = this;
    if (!self._upsMarker) return;
    if (!self.state.parcelType) return;
    var adr = self.refs.address.getWrappedInstance().getAddress();
    var fromAdr = {
      address_line: adr.street_address,
      postal_code: adr.postal_code,
      country_code: adr.country_code,
      city: adr.locality
    };
    var altAdr = {
      address_line: self._upsMarker.address.street,
      postal_code: self._upsMarker.address.zip,
      country_code: self._upsMarker.address.country,
      city: self._upsMarker.address.city
    };
    var weight = 0;
    switch(self.state.parcelType) {
      case "SMALL":
        weight = 2;
      break;
      case "MEDIUM":
        weight = 5;
      break;
      case "LARGE":
        weight = 10;
      break;
      case "XLARGE":
        weight = 20;
      break;
    }
    var pkg = {
      height: 35,
      length: 50,
      weight: weight,
      width: 80
    };

    self.setState({
      isUpsLoading: true
    });
    Promise.all([ UserService.getPublicClaims(self._order.subject), UserService.getPublicClaims(self._shop.subject) ]).then(function(res) {
      var buyerClaims = res[0]['claims'];
      var sellerClaims = res[1]['claims'];
      var toAdr = {
        address_line: self._shop.street_address,
        postal_code: self._shop.postal_code,
        country_code: self._shop.country,
        city: self._shop.locality
      };
      var request = {
        alternate_delivery_address: {
          name: self._upsMarker.name,
          address: altAdr
        },
        shipper : {
          name: buyerClaims.name,
          address: fromAdr
        },
        ship_to: {
          name: sellerClaims.name,
          address: toAdr
        },
        ship_from: {
          name: buyerClaims.name,
          address: fromAdr
        },
        package: pkg
      };
      UpsService.searchRatings(request).then(function(r) {
        self.setState({
          isUpsLoading: false,
          estimatedPrice: r.total_price
        });
      }).catch(function() {
        self.setState({
          isUpsLoading: false,
          estimatedPrice: 0
        });
      });
    }).catch(function() {
      self.setState({
        isUpsLoading: false,
        estimatedPrice: 0
      });
    });
  }

  refreshDhlRatings() { // Refresh dhl ratings
    var self = this;
    self.setState({
      isDhlRatingsLoading: true
    });
    var adr = this.refs.address.getWrappedInstance().getAddress();
    DhlService.searchCapabalities({ parcel_type: self.state.parcelType, to_zip_code: adr.country_code }).then(function(r) {
      self.setState({
        isDhlRatingsLoading: false,
        dhlRatings: r['ratings'],
        dhlRating: null
      });
    }).catch(function() {
      self.setState({
        isDhlRatingsLoading: false,
        dhlRatings: [],
        dhlRating: null
      });
    });
  }

  onMarkerClick(location) { // Execute when the user clicks on the marker (UPS).
    this._upsMarker = location;
    this.refreshUpsRatings();
  }

  render() { // Display the component.
    const { t } = this.props;
    var self = this;
    var ratings = [];
    var currentAdr = {};
    if (this.state.dhlRatings) {
      this.state.dhlRatings.forEach(function(rating) {
        ratings.push((
          <li className="list-group-item list-group-item-action" onClick={() => self.selectRating(rating)}>
            { self.state.dhlRating === rating && (
               <div className="checkbox-container">
                   <i className="fa fa-check checkbox txt-info"/>
               </div>) }
              <div className="col-md-2">
                { rating.code === 'PS' && ( <img src="/images/shop.png" /> ) }
                { rating.code === 'DOOR' && ( <img src="/images/postman.png" /> ) }
              </div>
              <div className="col-md-7">
                { rating.code === 'PS' && (
                  <div>
                    <h5>{t('dhlParcelShop')}</h5>
                    <p>{t('dhlParcelShopDescription')}</p>
                  </div>
                ) }
                { rating.code === 'DOOR' && (
                  <div>
                    <h5>{t('atYourRecipientsHome')}</h5>
                    <p>{t('atYourRecipientsHomeDescription')}</p>
                  </div>
                )}
              </div>
              <div className="col-md-3">
                <h5>€ {rating.price_with_tax}</h5>
              </div>
          </li>
        ));
      });
    }

    if (this.refs.address) {
      currentAdr = this.refs.address.getWrappedInstance().getAddress();
    }

    return (
      <div className="container rounded">
        { this.state.isLoading ? (<i className='fa fa-spinner fa-spin'/>) : (
          <div>
            <p>{t('basketTransportTabDescription')} <i className="fa fa-info-circle txt-info"/></p>
            <div>
              <section className="row p-1">
                <div className="col-md-3 text-center" onClick={() => { self.selectTransportMethod('manual'); }}>
                  <div className={this.state.transportMethod === 'manual' ? "choice active" : "choice"}>
                    <img src="/images/agreement.png" />
                    <h3>{t('handToHandTransport')}</h3>
                  </div>
                </div>
                <div className="col-md-3 offset-md-3 text-center" onClick={() => { self.selectTransportMethod('packet'); }}>
                  <div className={this.state.transportMethod === 'packet' ? "choice active" : "choice"} >
                    <img src="/images/package.png" />
                    <h3>{t('receivePackage')}</h3>
                  </div>
                </div>
              </section>
              { this.state.transportMethod === 'packet' && (
                <section className="section" style={{padding: "5px"}}>
                  <h5>{t('yourAddress')}</h5>
                  <Address ref="address" addressCorrect={this.addressCorrect} />
                  <h5>{t('destinationAddress')}</h5>
                  <Address position={this._shop.location} searchEnabled={false} />
                  <h5>{t('chooseTransporter')}</h5>
                  { /* Choose a transporter */ }
                  <div className="row">
                    <div className='col-md-3 text-center' onClick={() => self.selectTransporter('ups') }>
                      <div className={this.state.transporter === 'ups' ? 'choice active' : 'choice'}  style={{height: "140px"}}>
                        <div style={{height: "100px"}}><img src="/images/UPS.png" width="100" /></div>
                        <h3>{t('ups')}</h3>
                      </div>
                    </div>
                    <div className="col-md-3 offset-md-3 text-center" onClick={() => self.selectTransporter('dhl') }>
                      <div className={this.state.transporter === 'dhl' ? 'choice active' : 'choice'}  style={{height: "140px"}}>
                        <div style={{height: "100px"}}><img src="/images/DHL.png" width="100" /></div>
                        <h3><a href="https://my.dhlparcel.be/#/" style={{color: "inherit"}}>{t('dhlParcel')}</a></h3>
                      </div>
                    </div>
                  </div>
                  { /* Display different package size */ }
                  <h5>{t('chooseTheoricalPacketSize')}</h5>
                  <section className="row">
                    <label className="col-md-3 text-center">
                      <div className={this.state.parcelType === 'SMALL' ? 'choice active' : 'choice'} onClick={() => self.selectParcelType('SMALL')}>
                        <img src="/images/parcel-small.png" width="50" />
                        <h3>0 - 2kg</h3>
                      </div>
                    </label>
                    <label className="col-md-3 text-center">
                      <div className={this.state.parcelType === 'MEDIUM' ? 'choice active' : 'choice'} onClick={() => self.selectParcelType('MEDIUM')}>
                        <img src="/images/parcel-medium.png" width="50" />
                        <h3>2 - 5kg</h3>
                      </div>
                    </label>
                    <label className="col-md-3 text-center">
                      <div className={this.state.parcelType === 'LARGE' ? 'choice active' : 'choice'} onClick={() => self.selectParcelType('LARGE')}>
                        <img src="/images/parcel-large.png" width="50" />
                        <h3>5 - 10kg</h3>
                      </div>
                    </label>
                    <label className="col-md-3 text-center">
                      <div className={this.state.parcelType === 'XLARGE' ? 'choice active' : 'choice'} onClick={() => self.selectParcelType('XLARGE')}>
                        <img src="/images/parcel-xlarge.png" width="50" />
                        <h3>10 - 20kg</h3>
                      </div>
                    </label>
                  </section>
                  { /* Display the DHL */ }
                  { this.state.transporter === 'dhl' && this.state.isDhlRatingsLoading && (<i className='fa fa-spinner fa-spin'></i>) }
                  { this.state.transporter === 'dhl' && !this.state.isDhlRatingsLoading && (
                    <div>
                      { /* Display the different transport method */ }
                      <section>
                        { ratings.length === 0 && (<span>{t('noRating')}</span>) }
                        { ratings.length > 0 && (
                          <div className="list-group-default clickable">
                            {ratings}
                          </div>
                        ) }
                      </section>
                      { /* Display pick-up points */}
                      { this.state.dhlRating && this.state.dhlRating.code === 'PS' && (
                        <section style={{marginTop: "10px"}}>
                          <h5>{t('selectParcelShop')}</h5>
                          <DropLocations ref="dropLocation" transporter="dhl" address={currentAdr} />
                        </section>
                        ) }
                    </div>
                  )}
                  { /* Display UPS */ }
                  { this.state.transporter === 'ups' && this.state.isUpsLoading && (<i className='fa fa-spinner fa-spin'></i>) }
                  { this.state.transporter === 'ups' && (
                    <DropLocations ref="upsDropLocation" onMarkerClick={this.onMarkerClick} transporter="ups" address={currentAdr} />
                  )}
                  { /* Display total price */}
                  <section style={{marginTop: "10px"}}>
                    <h4>{t('estimatedPrice').replace('{0}', this.state.estimatedPrice)}</h4>
                  </section>
                </section>
              ) }
              <section className="row p-1">
                <Button color="default" onClick={this.previous}>{t('previous')}</Button>
                <Button color="default" onClick={this.next} style={{marginLeft:"5px"}}>{t('next')}</Button>
              </section>
            </div>
          </div>
        )}
      </div>
    );
  }

  display() { // Display the tab.
    var self = this;
    self.setState({
      isLoading: true,
      transportMethod: 'manual',
      parcelType: null,
      transporter: null,
      dhlRating: null,
      isDhlRatingsLoading: false,
      isUpsLoading: false,
      estimatedPrice: 0,
      dhlRatings: []
    });
    var orders = BasketStore.getOrders();
    var selectedOrderId = BasketStore.getSelectedOrderId();
    var order = orders.filter(function(o) { return o.id === selectedOrderId })[0];
    self._order = order;
    ShopsService.get(order.shop_id).then(function(shop) {
      self._shop = shop['_embedded'];
      self.setState({
        isLoading: false
      });
    }).catch(function() {
      self.setState({
        isLoading: false
      });
    });
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(TransportMethods);
