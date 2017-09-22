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
    this.confirm = this.confirm.bind(this);
  }

  previous() { // Execute when the user clicks on previous.
    if (this.props.onPrevious) {
      this.props.onPrevious();
    }
  }

  confirm() { // Confirm the payment.
    var self = this;
    const {t} = self.props;
    var payment = PrintOrderLabelStore.getPayment();
    var order = PrintOrderLabelStore.getOrder();
    ApplicationStore.displayLoading({
      display: true,
      message: t('confirmOrderLabelPurchaseSpinnerMessage')
    });
    OrdersService.confirmLabel(order.id, {
      payer_id: payment.payer_id,
      transaction_id: payment.payment_id
    }).then(function() {
      self.setState({
        isPaypalLoading: false
      });
      ApplicationStore.displayLoading({
        display: false,
      });
      self.props.history.push('/orders/' + order.id);
    }).catch(function(e) {
      console.log(e);
      var errorMsg = t('orderPurchaseLabelError');
      if (e.responseJSON && e.responseJSON.error_description) {
        errorMsg = e.responseJSON.error_description;
      }

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

  render() { // Display the component.
    const { t } = this.props;
    return (<div>
      <div style={{padding: "10px"}}>
      </div>
      <div>
        <button className="btn btn-default" onClick={this.previous}>{t('previous')}</button>
        <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={this.confirm}>{t('confirm')}</button>
      </div>
    </div>);
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(Payment));
