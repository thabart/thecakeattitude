import React, {Component} from "react";
import { translate } from 'react-i18next';
import { PrintOrderLabelStore, ApplicationStore } from '../stores/index';
import { OrdersService } from '../services/index';
import { withRouter } from "react-router";
import Constants from '../../Constants';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.previous = this.previous.bind(this);
    this.display = this.display.bind(this);
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
    this.state = {
      shippingPrice: 0,
      isConfirmLoading: false,
      isCancelLoading: false
    };
  }

  previous() { // Execute when the user clicks on previous.
    if (this.props.onPrevious) {
      this.props.onPrevious();
    }
  }

  display() { // Display the shipping price.    
    var order = PrintOrderLabelStore.getOrder();
    console.log(order);
    this.setState({
      shippingPrice: order.shipping_price
    });
  }

  confirm() { // Confirm the payment.
    var self = this;
    const {t} = self.props;
    var payment = PrintOrderLabelStore.getPayment();
    var order = PrintOrderLabelStore.getOrder();
    self.setState({
      isConfirmLoading: true
    });
    ApplicationStore.displayLoading({
      display: true,
      message: t('confirmOrderLabelPurchaseSpinnerMessage')
    });
    OrdersService.confirmLabel(order.id, {
      payer_id: payment.payer_id,
      transaction_id: payment.payment_id
    }).then(function() {
      self.setState({
        isConfirmLoading: false
      });
      ApplicationStore.displayLoading({
        display: false,
      });
      self.props.history.push('/orders/' + order.id);
    }).catch(function(e) {
      var errorMsg = t('orderPurchaseLabelError');
      if (e.responseJSON && e.responseJSON.error_description) {
        errorMsg = e.responseJSON.error_description;
      }

      self.setState({
        isConfirmLoading: false
      });
      ApplicationStore.sendMessage({
        message: errorMsg,
        level: 'error',
        position: 'tr'
      });
      ApplicationStore.displayLoading({
        display: false,
      });
    });
  }

  cancel() { // Cancel the label.
    var self = this;
    const {t} = self.props;
    var order = PrintOrderLabelStore.getOrder();
    self.setState({
      isCancelLoading: true
    });
    ApplicationStore.displayLoading({
      display: true,
      message: t('cancelOrderLabelPurchaseSpinnerMessage')
    });
    OrdersService.cancelLabel(order.id).then(function() {
      self.setState({
        isCancelLoading: false
      });
      ApplicationStore.displayLoading({
        display: false
      });
      self.props.history.push('/orders/' + order.id);
    }).catch(function(e) {
      var errorMsg = t('orderCancelLabelError');
      if (e.responseJSON && e.responseJSON.error_description) {
        errorMsg = e.responseJSON.error_description;
      }

      self.setState({
        isCancelLoading: false
      });
      ApplicationStore.displayLoading({
        display: false
      });
      ApplicationStore.sendMessage({
        message: errorMsg,
        level: 'error',
        position: 'tr'
      });
    });
  }

  render() { // Display the component.
    const { t } = this.props;
    return (<div>
      <div style={{padding: "10px"}}>
        <p>{t('confirmPurchaseLabel').replace('{0}', this.state.shippingPrice)}</p>
      </div>
      <div>
        <button className="btn btn-default" onClick={this.previous}>{t('previous')}</button>
        <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={this.confirm} disabled={this.state.isConfirmLoading && 'disabled'}>{t('confirm')}</button>
        <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={this.cancel} disabled={this.state.isCancelLoading && 'disabled'}>{t('cancel')}</button>
      </div>
    </div>);
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(Payment);
