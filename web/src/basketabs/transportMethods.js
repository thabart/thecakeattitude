import React, { Component } from "react";
import { Button } from "reactstrap";
import { translate } from 'react-i18next';
import { BasketStore } from '../stores/index';
import AppDispatcher from '../appDispatcher';
import '../styles/transportMethods.css';
import Constants from '../../Constants';

class TransportMethods extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.selectTransportMethod = this.selectTransportMethod.bind(this);
    this.state = {
      transportMethod: 'manual'
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

  render() { // Display the component.
    const { t } = this.props;
    var self = this;
    return (
      <div className="container rounded">
        <p>{t('basketTransportTabDescription')} <i className="fa fa-info-circle txt-info"/></p>
        <div className="col-md-12">
          <section className="row p-1">
            <div className={this.state.transportMethod === 'manual' ? "col-md-3 text-center transport-method active" : "col-md-3 text-center transport-method"} onClick={() => { self.selectTransportMethod('manual'); }}>
              <img src="/images/agreement.png" />
              <h3>{t('handToHandTransport')}</h3>
            </div>
            <div className={this.state.transportMethod === 'packet' ? "col-md-3 offset-md-3 text-center transport-method active" : "col-md-3 offset-md-3 text-center transport-method"} onClick={() => { self.selectTransportMethod('packet'); }}>
              <img src="/images/package.png" />
              <h3>{t('receivePackage')}</h3>
            </div>
          </section>
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
