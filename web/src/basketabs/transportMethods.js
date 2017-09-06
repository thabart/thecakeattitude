import React, { Component } from "react";
import { Button } from "reactstrap";
import { translate } from 'react-i18next';
import { BasketStore } from '../stores/index';
import { Address, DropLocations } from '../components/index';
import AppDispatcher from '../appDispatcher';
import '../styles/transportMethods.css';
import Constants from '../../Constants';

class TransportMethods extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.selectTransportMethod = this.selectTransportMethod.bind(this);
    this.selectTransporter = this.selectTransporter.bind(this);
    this.state = {
      transportMethod: 'manual',
      transporter: null
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

  render() { // Display the component.
    const { t } = this.props;
    var self = this;
    return (
      <div className="container rounded">
        <p>{t('basketTransportTabDescription')} <i className="fa fa-info-circle txt-info"/></p>
        <div>
          <section className="row p-1">
            <div className="col-md-3 text-center" onClick={() => { self.selectTransportMethod('manual'); }}>
              <div className={this.state.transportMethod === 'manual' ? "transport-method active" : "transport-method"}>
                <img src="/images/agreement.png" />
                <h3>{t('handToHandTransport')}</h3>
              </div>
            </div>
            <div className="col-md-3 offset-md-3 text-center" onClick={() => { self.selectTransportMethod('packet'); }}>
              <div className={this.state.transportMethod === 'packet' ? "transport-method active" : "transport-method"} >
                <img src="/images/package.png" />
                <h3>{t('receivePackage')}</h3>
              </div>
            </div>
          </section>
          { this.state.transportMethod === 'packet' && (
            <section className="section" style={{padding: "5px"}}>
              <h5>Your address</h5>
              <Address />
              <h5>Choose a transporter</h5>
              <div className="row">
                <div className='col-md-3 text-center' onClick={() => self.selectTransporter('ups') }>
                  <div className={this.state.transporter === 'ups' ? 'transport-method active' : 'transport-method'}>
                    <img src="/images/UPS.png" width="100" />
                    <h3>UPS</h3>
                  </div>
                </div>
                <div className="col-md-3 offset-md-3 text-center" onClick={() => self.selectTransporter('dhl') }>
                  <div className={this.state.transporter === 'dhl' ? 'transport-method active' : 'transport-method'}>
                    <img src="/images/DHL.png" width="100" />
                    <h3><a href="https://my.dhlparcel.be/#/" style={{color: "inherit"}}>DHL PARCEL</a></h3>
                  </div>
                </div>
              </div>
              { /* Deliver to a pick-up point */ }
              { this.state.transporter === 'dhl' && ( <section><h5>Choose a Pick-up point</h5><DropLocations /></section> ) }
              { /* Deliver directly at home */ }
              <h4>Total price</h4>
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
