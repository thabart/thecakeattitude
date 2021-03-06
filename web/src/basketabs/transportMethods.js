import React, { Component } from "react";
import { Button, Alert } from "reactstrap";
import { translate } from 'react-i18next';
import { BasketStore } from '../stores/index';
import { Address, DropLocations } from '../components/index';
import { DhlService, ShopsService, UpsService, UserService } from '../services/index';
import { ApplicationStore } from '../stores/index';
import { UncontrolledTooltip } from 'reactstrap';
import AppDispatcher from '../appDispatcher';
import Constants from '../../Constants';
import Promise from 'bluebird';

const mappingUpsServiceCode = {
  "011": "ups_standard",
  "070": "ups_accesspoint_economy"
};

class TransportMethods extends Component {
  constructor(props) {
    super(props);
    this._order = null;
    this._shop = null;
    this._upsMarker = null;
    this._dhlMarker = null;
    this._buyer = null;
    this._seller = null;
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.selectTransportMethod = this.selectTransportMethod.bind(this);
    this.selectTransporter = this.selectTransporter.bind(this);
    this.selectParcelType = this.selectParcelType.bind(this);
    this.selectDhlRating = this.selectDhlRating.bind(this);
    this.addressCorrect = this.addressCorrect.bind(this);
    this.refreshUpsRatings = this.refreshUpsRatings.bind(this);
    this.refreshDhlRatings = this.refreshDhlRatings.bind(this);
    this.onUpsMarkerClick = this.onUpsMarkerClick.bind(this);
    this.onDhlMarkerClick = this.onDhlMarkerClick.bind(this);
    this.displayUpsServices = this.displayUpsServices.bind(this);
    this.selectUpsService = this.selectUpsService.bind(this);
    this.state = {
      isLoading: false,
      transportMethod: 'manual',
      parcelType: null,
      transporter: null,
      dhlRating: null,
      isDhlRatingsLoading: false,
      isUpsLoading: false,
      estimatedPrice: 0,
      dhlRatings: [],
      isNextBtnEnabled: true,
      isUpsServicesLoading: false,
      upsServices: [],
      selectedUpsService: null
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
      if (order.transport_mode === 'packet') {
        var adr = this.refs.address.getWrappedInstance().getAddress();
        var fromAdr = {
          address_line: adr.street_address,
          city: adr.locality,
          postal_code: adr.postal_code,
          country_code: adr.country_code
        };
        var toAdr = {
          address_line: this._shop.street_address,
          city: this._shop.locality,
          postal_code: this._shop.postal_code,
          country_code: this._shop.country,
        };
        var estimatedPrice = this.state.estimatedPrice;
        var parcelShop = null;
        if (this.state.transporter === 'dhl' && this.state.dhlRating.code === 'PS') {
          var addressLine = [];
          var dhlMarkerAdr = this._dhlMarker.address;
          if (dhlMarkerAdr) {
            if (dhlMarkerAdr.number) {
              addressLine.push(dhlMarkerAdr.number);
            }

            if (dhlMarkerAdr.street) {
              addressLine.push(dhlMarkerAdr.street);
            }
          }

          parcelShop = {
            id: this._dhlMarker.id,
            name: this._dhlMarker.name,
            location: this._dhlMarker.location,
            address: {
              address_line: addressLine.join(' '),
              city: dhlMarkerAdr.city,
              postal_code: dhlMarkerAdr.zip,
              country_code: dhlMarkerAdr.country
            }
          };
        } else if (this.state.transporter === 'ups') {
          parcelShop = {
            id: this._upsMarker.id,
            name: this._upsMarker.name,
            location: this._upsMarker.location,
            address: {
              address_line: this._upsMarker.address.street,
              city: this._upsMarker.address.city,
              postal_code: this._upsMarker.address.zip,
              country_code: this._upsMarker.address.country
            }
          };
        }

        order.package = {
          buyer: {
            name: this._buyer.name,
            address: fromAdr
          },
          seller: {
            name: this._seller.name,
            address: toAdr
          },
          parcel_shop: parcelShop,
          estimated_price: estimatedPrice,
          transporter: this.state.transporter
        };

        if (this.state.transporter === 'ups') {
          order.package.ups_service = this.state.selectedUpsService;
        }
      }
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
      transporter: null,
      dhlRatings: [],
      isDhlRatingsLoading: false,
      isUpsLoading: false,
      estimatedPrice: 0,
      isNextBtnEnabled: transportMethod === 'manual'
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
      estimatedPrice: 0,
      isNextBtnEnabled: false,
      selectedUpsService: null,
      upsServices: [],
      isUpsServicesLoading: false
    });
    if (transporter === 'ups') {
      this.displayUpsServices();
    }
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

  selectDhlRating(rating) { // Select the rating.
    this.setState({
      dhlRating: rating,
      estimatedPrice: rating.price_with_tax
    });
  }

  addressCorrect(b) { // Update the drop locations.
    if (!b || !this.refs.address) return;
    var adr = this.refs.address.getWrappedInstance().getAddress();
    if (this.refs.dhlDropLocation) {
      this.refs.dhlDropLocation.getWrappedInstance().setAddress(adr);
    }

    if (this.refs.upsDropLocation) {
      this.refs.upsDropLocation.getWrappedInstance().setAddress(adr);
      this._upsMarker = null;
      this.setState({
        selectedUpsService: null
      });
      this.displayUpsServices();
    }

    this.setState({
      isNextBtnEnabled: false
    });
  }

  refreshUpsRatings() { // Refresh ups ratings.
    var request = {};
    var self = this;
    if (!self._upsMarker) return;
    if (!self.state.parcelType) return;
    if (!self.state.selectedUpsService) return;
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
      height: Constants.maxPackageSize.height,
      length: Constants.maxPackageSize.length,
      weight: weight,
      width: Constants.maxPackageSize.width
    };

    self.setState({
      isUpsLoading: true,
      isNextBtnEnabled: false
    });
    const {t} = this.props;
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
        name: self._buyer.name,
        address: fromAdr
      },
      ship_to: {
        name: self._seller.name,
        address: toAdr
      },
      ship_from: {
        name: self._buyer.name,
        address: fromAdr
      },
      package: pkg,
      ups_service: self.state.selectedUpsService
    };
    UpsService.searchRatings(request).then(function(r) {
      self.setState({
        isUpsLoading: false,
        estimatedPrice: r.total_price,
        isNextBtnEnabled: true
      });
    }).catch(function(e) {
      var errorMsg = t('retrieveRatingError');
      if (e.responseJSON && e.responseJSON.error_description) {
        errorMsg = e.responseJSON.error_description;
      }

      self.setState({
        isUpsLoading: false,
        estimatedPrice: 0
      });
      ApplicationStore.sendMessage({
          message: errorMsg,
          level: 'error',
          position: 'tr'
      });
    });
  }

  refreshDhlRatings() { // Refresh dhl ratings
    var self = this;
    self.setState({
      isDhlRatingsLoading: true
    });
    var adr = this.refs.address.getWrappedInstance().getAddress();
    const {t} = this.props;
    DhlService.searchCapabalities({ parcel_type: self.state.parcelType, to_zip_code: adr.country_code }).then(function(r) {
      self.setState({
        isDhlRatingsLoading: false,
        dhlRatings: r['ratings'],
        dhlRating: null
      });
    }).catch(function(e) {
      var errorMsg = t('retrieveRatingError');
      if (e.responseJSON && e.responseJSON.error_description) {
        errorMsg = e.responseJSON.error_description;
      }
      
      self.setState({
        isDhlRatingsLoading: false,
        dhlRatings: [],
        dhlRating: null
      });
      ApplicationStore.sendMessage({
          message: errorMsg,
          level: 'error',
          position: 'tr'
      });
    });
  }

  onUpsMarkerClick(location) { // Execute when the user clicks on the marker (UPS).
    this._upsMarker = location;
    this.refreshUpsRatings();
  }

  onDhlMarkerClick(location) { // Execute when the user clicks on the marker (DHL)
    this._dhlMarker = location;
  }

  displayUpsServices() { // Display the UPS services.
    if (!this.refs.address) return;
    var self = this;
    var adr = self.refs.address.getWrappedInstance().getAddress();
    self.setState({
      isUpsServicesLoading: true
    });
    const {t} = this.props;
    UpsService.getServices(adr.country_code).then(function(services) {
      self.setState({
        isUpsServicesLoading: false,
        upsServices: services
      });
    }).catch(function(e) {
      var errorMsg = t('retrieveUpsServicesError');
      if (e.responseJSON && e.responseJSON.error_description) {
        errorMsg = e.responseJSON.error_description;
      }
      
      ApplicationStore.sendMessage({
          message: errorMsg,
          level: 'error',
          position: 'tr'
      });
      self.setState({
        isUpsServicesLoading: false,
        upsServices: []
      });
    });
  }

  selectUpsService(service) { // Select the UPS service.
    if (this.state.selectUpsService === service) return;
    this.state.selectedUpsService = service;
    this.setState({
      selectedUpsService: service
    });
    this.refreshUpsRatings();
  }

  render() { // Display the component.
    const { t } = this.props;
    var self = this;
    var ratings = [];
    var upsServices = [];
    var currentAdr = {};
    if (this.state.dhlRatings) {
      this.state.dhlRatings.forEach(function(rating) {
        ratings.push((
          <li className="list-group-item list-group-item-action" onClick={() => self.selectDhlRating(rating)}>
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

    if (this.state.upsServices) {
      this.state.upsServices.forEach(function(upsService) {
        var code = mappingUpsServiceCode[upsService.service];
        if (!code) {
          return;
        }

        upsServices.push(
          <label className="col-md-3 text-center" onClick={() => self.selectUpsService(upsService.service)}>
            <div className={self.state.selectedUpsService === upsService.service ? "choice active" : "choice"} style={{minHeight:"100px"}}>
              <h3 style={{paddingTop:"30px"}}>{t(code)}</h3>
            </div>
          </label>
        );
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
                  { /* Your address */ }
                  <h5>
                    {t('yourAddress')} <i className="fa fa-info-circle txt-info" id="yourAddressTooltip"/>
                    <UncontrolledTooltip placement="right" target="yourAddressTooltip" className="red-tooltip-inner">{t('yourAddressTooltipInformation')}</UncontrolledTooltip>
                  </h5>
                  <Address ref="address" addressCorrect={this.addressCorrect} />
                  { /* Shop address */ }
                  <h5>
                    {t('shopAddress')} <i className="fa fa-info-circle txt-info" id="shopAddressTooltip"/>
                    <UncontrolledTooltip placement="right" target="shopAddressTooltip" className="red-tooltip-inner">{t('shopAddressTooltipInformation')}</UncontrolledTooltip>
                  </h5>
                  <Address position={this._shop.location} searchEnabled={false} />
                  { /* Choose a transporter */ }
                  <h5>{t('chooseTransporter')}</h5>
                  <div className="row">
                    <div className='col-md-3 text-center' onClick={() => self.selectTransporter('ups') }>
                      <div className={this.state.transporter === 'ups' ? 'choice active' : 'choice'}  style={{height: "140px"}}>
                        <div style={{height: "100px"}}><img src="/images/UPS.png" width="50" /></div>
                        <h3>{t('ups')}</h3>
                      </div>
                    </div>
                    <div className="col-md-3 offset-md-3 text-center" onClick={() => self.selectTransporter('dhl') }>
                      <div className={this.state.transporter === 'dhl' ? 'choice active' : 'choice'}  style={{height: "140px"}}>
                        <div style={{height: "100px"}}><img src="/images/DHL.png" width="100" /></div>
                        <h3>{t('dhl')}</h3>
                      </div>
                    </div>
                  </div>
                  { /* Display different package size */ }
                  <h5>
                    {t('chooseTheoricalPacketSize')}  <i className="fa fa-info-circle txt-info" id="chooseTheoricalPacketSizeTooltip"/>
                    <UncontrolledTooltip placement="right" target="chooseTheoricalPacketSizeTooltip" className="red-tooltip-inner">{t('chooseTheoricalPacketSizeTooltipInformation')}</UncontrolledTooltip>
                  </h5>
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
                      <Alert color="danger" isOpen={true}>{t('notYetSupported')}</Alert>
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
                          <DropLocations ref="dhlDropLocation" onMarkerClick={this.onDhlMarkerClick} transporter="dhl" address={currentAdr} />
                        </section>
                        ) }
                    </div>
                  )}
                  { /* Display UPS */ }
                  { this.state.transporter === 'ups' && this.state.isUpsLoading && (<i className='fa fa-spinner fa-spin'></i>) }
                  { this.state.transporter === 'ups' && (
                    <section>
                      <h5>{t('upsServices')} <a href="https://www.ups.com/worldshiphelp/WS16/ENU/AppHelp/Codes/UPS_Service_Codes.htm" className="no-decoration red" target="_blank"><i className="fa fa-link"></i></a></h5>
                      { this.state.isUpsServicesLoading && (<i className='fa fa-spinner fa-spin'></i>) }
                      { !this.state.isUpsServicesLoading && (
                        <section className="row">
                          {upsServices}
                        </section>
                      ) }
                      <DropLocations ref="upsDropLocation" onMarkerClick={this.onUpsMarkerClick} transporter="ups" address={currentAdr} />
                    </section>
                  )}
                  { /* Display total price */}
                  <section style={{marginTop: "10px"}}>
                    <h4>{t('estimatedPrice').replace('{0}', this.state.estimatedPrice)}</h4>
                  </section>
                </section>
              ) }
              <section className="row p-1">
                <Button color="default" onClick={this.previous}>{t('previous')}</Button>
                <Button color="default" onClick={this.next} style={{marginLeft:"5px"}} disabled={!this.state.isNextBtnEnabled}>{t('next')}</Button>
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
    const {t} = this.props;
    var orders = BasketStore.getOrders();
    var selectedOrderId = BasketStore.getSelectedOrderId();
    var order = orders.filter(function(o) { return o.id === selectedOrderId })[0];
    self._order = order;
    ShopsService.get(order.shop_id).then(function(shop) {
      self._shop = shop['_embedded'];
      Promise.all([ UserService.getPublicClaims(self._order.subject), UserService.getPublicClaims(self._shop.subject) ]).then(function(res) {
        self._buyer = res[0]['claims'];
        self._seller = res[1]['claims'];
        self.setState({
          isLoading: false
        });
      }).catch(function() {
        self.setState({
          isLoading: false
        });
        ApplicationStore.sendMessage({
            message: t('retrieveUserInformationError'),
            level: 'error',
            position: 'tr'
        });
      });
    }).catch(function() {
      self.setState({
        isLoading: false
      });
      ApplicationStore.sendMessage({
          message: t('shopDoesntExistError'),
          level: 'error',
          position: 'tr'
      });
    });
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(TransportMethods);
