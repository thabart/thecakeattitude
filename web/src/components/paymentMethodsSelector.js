import React, {Component} from "react";
import { translate } from 'react-i18next';

class PaymentMethodsSelector extends Component {
    constructor(props) {
        super(props);
        this.activate = this.activate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            firstIban: null,
            secondIban: null,
            thirdIban: null,
            fourthIban: null,
            currentItem: null,
            activateCash: false,
            paypalAccount: null,
            activateBankTransfer: false,
            activatePaypal: false,
        };
    }

    activate(itemName, e) { // Enable / Disable payment method.
        e.preventDefault();
        var self = this;
        this.setState({
            [itemName]: !self.state[itemName]
        });
    }

    validate() { // Execute when the user click on "validate"
        var self = this;
        const {t} = this.props;
        if (!this.state.activateCash && !this.state.activateBankTransfer && !this.state.activatePaypal) {
            if (self.props.onError) self.props.onError(t('noPaymentSelectedError'));
            return;
        }

        var arr = [];
        if (this.state.activateCash) {
            arr.push({method: 'cash'});
        }

        if (this.state.activateBankTransfer) {
            if (!this.state.firstIban || !this.state.secondIban || !this.state.thirdIban || !this.state.fourthIban) {
                if (self.props.onError) self.props.onError(t('mandatoryIbanError'));
                return;
            }

            var iban = this.state.firstIban + this.state.secondIban + this.state.thirdIban + this.state.fourthIban;
            var regex = new RegExp("^[A-Z]{2}[0-9]{2}([0-9]{4}){3}");
            if (!regex.test(iban)) {
                if (self.props.onError) self.props.onError(t('notValidIbanError'));
                return;
            }

            arr.push({method: 'bank_transfer', 'iban': iban});
        }

        if (this.state.activatePaypal) {
            if (!this.state.paypalAccount) {
              if (self.props.onError) self.props.onError(t('mandatoryPaypalAccountError'));
              return;
            }

            var regex = new RegExp("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
            if (!regex.test(this.state.paypalAccount)) {
                if (self.props.onError) self.props.onError(t('notValidPaypalAccountError'));
                return;
            }

            arr.push({method: 'paypal', paypal_account: this.state.paypalAccount});
        }

        return arr;
    }

    handleInputChange(e) { // Handle the input change.
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render() { // Display the view.
        const {t} = this.props;
        return (
            <div className="list-group-default clickable">
                {/* Cash */}
                <li
                   className={this.state.activateCash ? 'list-group-item list-group-item-action active-payment' : 'list-group-item list-group-item-action'}
                   onClick={(e) => {
                       this.activate("activateCash", e);
                   }}>
                    {this.state.activateCash ? (
                        <div className="checkbox-container">
                            <i className="fa fa-check checkbox txt-info"/>
                        </div>) : ''}
                    <div className="form-group">
                        <i className="fa fa-money txt-info"/> <label>{t('cash')}</label>
                    </div>
                </li>
                {/* Bank transfer */}
                <li
                   className={this.state.activateBankTransfer ? 'list-group-item list-group-item-action active-payment' : 'list-group-item list-group-item-action'}
                   onClick={(e) => {
                       this.activate("activateBankTransfer", e);
                   }}>
                    {this.state.activateBankTransfer ? (
                        <div className="checkbox-container"><i className="fa fa-check checkbox txt-info"/>
                        </div>) : ''}
                    <div className="form-group">
                        <i className="fa fa-credit-card-alt txt-info"/> <label>{t('bankTransfer')}</label>
                        <p>{t('pleaseInsertIban')}</p>
                        <div className="row">
                            <div className="col-md-3">
                                <input type="text" className="form-control" maxLength="4" placeholder="BE__"
                                       name="firstIban" value={this.state.firstIban} onChange={this.handleInputChange} onClick={(e) => {
                                    e.stopPropagation();
                                }}/>
                            </div>
                            <div className="col-md-3">
                                <input type="text" className="form-control" maxLength="4" placeholder="0000"
                                       name="secondIban" value={this.state.secondIban} onChange={this.handleInputChange} onClick={(e) => {
                                    e.stopPropagation();
                                }}/>
                            </div>
                            <div className="col-md-3">
                                <input type="text" className="form-control" maxLength="4" placeholder="0000"
                                       name="thirdIban" value={this.state.thirdIban} onChange={this.handleInputChange} onClick={(e) => {
                                    e.stopPropagation();
                                }}/>
                            </div>
                            <div className="col-md-3">
                                <input type="text" className="form-control" maxLength="4" placeholder="0000"
                                       name="fourthIban" value={this.state.fourthIban} onChange={this.handleInputChange} onClick={(e) => {
                                    e.stopPropagation();
                                }}/>
                            </div>
                        </div>
                    </div>
                </li>
                {/* Paypal */}
                <li
                   className={this.state.activatePaypal ? 'list-group-item list-group-item-action active-payment' : 'list-group-item list-group-item-action'}
                   onClick={(e) => {
                       this.activate("activatePaypal", e);
                   }}>
                    {this.state.activatePaypal ? (
                        <div className="checkbox-container"><i className="fa fa-check checkbox txt-info"></i>
                        </div>) : ''}
                    <div className="form-group">
                        <i className="fa fa-paypal txt-info"/> <label>{t('paypal')}</label>
                        <p>{t('paypalDescription')}</p>
                        <input type="text" onChange={this.handleInputChange} name="paypalAccount" value={this.state.paypalAccount} className="form-control" onClick={(e) => { e.stopPropagation(); }} />
                    </div>
                </li>
            </div>
        );
    }

    componentDidMount() { // Execute after the view is rendered.
        if (!this.props.payments || !(this.props.payments instanceof Array)) {
            return;
        }

        var activatePaypal = false,
            activateBankTransfer = false,
            activateCash = false,
            firstIban = null,
            secondIban = null,
            thirdIban = null,
            fourthIban = null,
            paypalAccount = null;
        this.props.payments.forEach(function (payment) {
            switch (payment.method) {
                case "Cash":
                case "cash":
                    activateCash = true;
                    break;
                case "BankTransfer":
                case "bank_transfer":
                    activateBankTransfer = true;
                    firstIban = payment.iban.substring(0, 4);
                    secondIban = payment.iban.substring(4, 8);
                    thirdIban = payment.iban.substring(8, 12);
                    fourthIban = payment.iban.substring(12, 16);
                    break;
                case "PayPal":
                case "paypal":
                    activatePaypal = true;
                    paypalAccount = payment.paypal_account;
                    break;
            }
        });

        this.setState({
            activateCash: activateCash,
            activateBankTransfer: activateBankTransfer,
            activatePaypal: activatePaypal,
            firstIban: firstIban,
            secondIban: secondIban,
            thirdIban: thirdIban,
            fourthIban: fourthIban,
            paypalAccount: paypalAccount
        });
    }
}

export default translate('common', { wait: process && !process.release, withRef: true })(PaymentMethodsSelector);
