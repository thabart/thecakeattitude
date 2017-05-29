import React, {Component} from "react";
import './paymentMethodsSelector.css';

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
            activateBankTransfer: false,
            activatePaypal: false
        };
    }

    activate(itemName, e) {
        e.preventDefault();
        var self = this;
        this.setState({
            [itemName]: !self.state[itemName]
        });
    }

    validate() {
      var self = this;
      if (!this.state.activateCash && !this.state.activateBankTransfer && !this.state.activatePaypal) {
        if (self.props.onError) self.props.onError('A payment method should be selected');
        return;
      }

      var arr = [];
      if (this.state.activateCash) {
        arr.push({method: 'cash'});
      }

      if (this.state.activateBankTransfer) {
        if (!this.state.firstIban || !this.state.secondIban || !this.state.thirdIban || !this.state.fourthIban) {
          if (self.props.onError) self.props.onError('The IBAN should bee filled in');
          return;
        }

        var iban = this.state.firstIban + this.state.secondIban + this.state.thirdIban + this.state.fourthIban;
        var regex = new RegExp("^[A-Z]{2}[0-9]{2}([0-9]{4}){3}");
        if (!regex.test(iban)) {
          if (self.props.onError) self.props.onError('The IBAN is not valid');
          return;
        }

        arr.push({method: 'bank_transfer', 'iban': iban});
      }

      if (this.state.activatePaypal) {
        arr.push({method: 'paypal'});
      }

      return arr;
    }

    handleInputChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render() {
      return (
        <div className="list-group">
          <a href="#"
            className={this.state.activateCash ? 'list-group-item list-group-item-action active-payment' : 'list-group-item list-group-item-action'}
              onClick={(e) => {
                this.activate("activateCash", e);
              }}>
          {this.state.activateCash ? (
            <div className="checkbox-container"><i className="fa fa-check checkbox"></i>
            </div>) : ''}
            <div className="form-group">
              <i className="fa fa-money"></i> <label>Cash</label>
            </div>
          </a>
          <a href="#"
            className={this.state.activateBankTransfer ? 'list-group-item list-group-item-action active-payment' : 'list-group-item list-group-item-action'}
              onClick={(e) => {
                this.activate("activateBankTransfer", e);
          }}>
            {this.state.activateBankTransfer ? (
              <div className="checkbox-container"><i className="fa fa-check checkbox"></i>
              </div>) : ''}
              <div className="form-group">
                <i className="fa fa-credit-card-alt"></i> <label>Bank transfer</label>
                <p>Please insert your IBAN</p>
                <div className="row">
                  <div className="col-md-3">
                    <input type="text" className="form-control" maxLength="4" placeholder="BE__"
                    name="firstIban" value={this.state.firstIban} onChange={this.handleInputChange} onClick={(e) => { e.stopPropagation();}}/>
                  </div>
                  <div className="col-md-3">
                    <input type="text" className="form-control" maxLength="4" placeholder="0000"
                    name="secondIban" value={this.state.secondIban} onChange={this.handleInputChange} onClick={(e) => { e.stopPropagation();}}/>
                  </div>
                  <div className="col-md-3">
                    <input type="text" className="form-control" maxLength="4" placeholder="0000"
                    name="thirdIban" value={this.state.thirdIban} onChange={this.handleInputChange} onClick={(e) => { e.stopPropagation();}}/>
                  </div>
                  <div className="col-md-3">
                    <input type="text" className="form-control" maxLength="4" placeholder="0000"
                    name="fourthIban" value={this.state.fourthIban} onChange={this.handleInputChange} onClick={(e) => { e.stopPropagation();}}/>
                  </div>
                </div>
              </div>
          </a>
          <a href="#"
             className={this.state.activatePaypal ? 'list-group-item list-group-item-action active-payment' : 'list-group-item list-group-item-action'}
             onClick={(e) => {
               this.activate("activatePaypal", e);
          }}>
            {this.state.activatePaypal ? (
              <div className="checkbox-container"><i className="fa fa-check checkbox"></i>
              </div>) : ''}
              <div className="form-group">
                <i className="fa fa-paypal"></i> <label>Paypal</label>
              </div>
          </a>
        </div>);
    }

    componentDidMount() {
      if (!this.props.payments || !(this.props.payments instanceof Array)) {
        return;
      }

      var activatePaypal = false,
        activateBankTransfer = false,
        activateCash = false,
        firstIban = null,
        secondIban = null,
        thirdIban = null,
        fourthIban = null;
      this.props.payments.forEach(function(payment) {
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
            console.log(payment.iban);
            break;
          case "PayPal":
          case "paypal":
              activatePaypal = true;
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
        fourthIban: fourthIban
      });
    }
}

export default PaymentMethodsSelector;
