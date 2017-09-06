import React, { Component } from "react";
import { Button } from "reactstrap";
import { translate } from 'react-i18next';
import { BasketStore } from '../stores/index';
import { Address, DropLocations } from '../components/index';
import { DhlService } from '../services/index';
import AppDispatcher from '../appDispatcher';
import Constants from '../../Constants';

class TransportMethods extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.selectTransportMethod = this.selectTransportMethod.bind(this);
    this.selectTransporter = this.selectTransporter.bind(this);
    this.selectParcelType = this.selectParcelType.bind(this);
    this.selectRating = this.selectRating.bind(this);
    this.addressCorrect = this.addressCorrect.bind(this);
    this.state = {
      transportMethod: 'manual',
      parcelType: null,
      transporter: null,
      dhlRating: null,
      isDhlRatingsLoading: false,
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
    this.setState({
      transportMethod: transportMethod
    });
  }

  selectTransporter(transporter) { // Select a transporter.
    this.setState({
      transporter: transporter
    });
  }

  selectParcelType(parcelType) { // Select the parcel type.
    var self = this;
    self.setState({
      isDhlRatingsLoading: true,
      parcelType: parcelType
    });
    var adr = this.refs.address.getWrappedInstance().getAddress();
    DhlService.searchCapabalities({ parcel_type: parcelType, to_zip_code: adr.country_code }).then(function(r) {
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

  selectRating(rating) { // Select the rating.
    this.setState({
      dhlRating: rating,
      estimatedPrice: rating.price_with_tax
    });
  }

  addressCorrect(b) { // Update the drop locations.
    if (!b || !this.refs.dropLocation || !this.refs.address) return;
    var adr = this.refs.address.getWrappedInstance().getAddress();
    this.refs.dropLocation.getWrappedInstance().setAddress(adr);
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

    if (this.state.transportMethod === 'packet' && this.state.transporter === 'dhl' && this.state.dhlRating && this.state.dhlRating.code === 'PS' && this.refs.address) {
      currentAdr = this.refs.address.getWrappedInstance().getAddress();
    }

    return (
      <div className="container rounded">
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
              { /* Display the DHL */ }
              { this.state.transporter === 'dhl' && (
                <div>
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
                  { /* Display the different transport method */ }
                  <section>
                    { this.state.isDhlRatingsLoading && (<i className='fa fa-spinner fa-spin'></i>) }
                    { !this.state.isDhlRatingsLoading && ratings.length === 0 && (<span>{t('noRating')}</span>) }
                    { !this.state.isDhlRatingsLoading && ratings.length > 0 && (
                      <div className="list-group-default clickable">
                        {ratings}
                      </div>
                    ) }
                  </section>
                  { /* Display pick-up points */}
                  { this.state.dhlRating && this.state.dhlRating.code === 'PS' && (
                    <section style={{marginTop: "10px"}}>
                      <h5>{t('selectParcelShop')}</h5>
                      <DropLocations ref="dropLocation" address={currentAdr} />
                    </section>
                    ) }
                </div>
              ) }
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
    );
  }
}

export default translate('common', { wait: process && !process.release })(TransportMethods);
