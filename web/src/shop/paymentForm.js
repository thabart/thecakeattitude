import React, { Component } from 'react';
import { Input } from 'reactstrap';
import './paymentForm.css';

class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.previous = this.previous.bind(this);
    this.activate = this.activate.bind(this);
    this.confirm = this.confirm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      currentItem: null,
      activateCash: false,
      activateBankTransfer: false,
      activatePaypal: false
    };
  }
  activate(itemName) {
    var self = this;
    this.setState({
      [itemName]: !self.state[itemName]
    });
  }
  confirm() {
    var self = this;
    var currentItem = this.state.currentItem;
    if (!currentItem || currentItem === '') {
      self.props.onError('A payment method should be selected');
      return;
    }

    var arr = [];
    if (this.state.activateCash) {
      arr.push({method: 'cash'});
    }

    if (this.state.activateBankTransfer) {
      if (!this.state.firstIban || !this.state.secondIban || !this.state.thirdIban || !this.state.fourthIban) {
        self.props.onError('The IBAN should bee filled in');
        return;
      }

      var iban = this.state.firstIban + this.state.secondIban + this.state.thirdIban + this.state.fourthIban;
      var regex = new RegExp("^[A-Z]{2}[0-9]{2}([0-9]{4}){3}");
      if (!regex.test(iban)) {
        self.props.onError('The IBAN is not valid');
        return;
      }

      arr.push({method: 'bank_transfer', 'iban': iban});
    }

    if (this.state.activatePaypal) {
      arr.push({method: 'paypal'});
    }

    self.props.onConfirm({ payments: arr });
  }
  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  previous() {
    this.props.onPrevious();
  }
  render() {
    return (
      <div>
        <section className="col-md-12 section">
          <p>Choose one or more payment method(s)</p>
          <div className="list-group">
            <a href="#" className={this.state.activateCash ? 'list-group-item list-group-item-action active' : 'list-group-item list-group-item-action'} onClick={() => { this.activate("activateCash"); }}>
              <div className="form-group">
                <i className="fa fa-money"></i> <label>Cash</label>
              </div>
            </a>
            <a href="#" className={this.state.activateBankTransfer ? 'list-group-item list-group-item-action active' : 'list-group-item list-group-item-action'} onClick={() => { this.activate("activateBankTransfer"); }}>
              <div className="form-group">
                <i className="fa fa-credit-card-alt"></i> <label>Bank transfer</label>
                <p>Please insert your IBAN</p>
                <div className="row">
                  <div className="col-md-3">
                    <input type="text" className="form-control" maxLength="4" placeholder="BE__" name="firstIban" onChange={this.handleInputChange} />
                  </div>
                  <div className="col-md-3">
                    <input type="text" className="form-control" maxLength="4" placeholder="0000" name="secondIban"  onChange={this.handleInputChange} />
                  </div>
                  <div className="col-md-3">
                    <input type="text" className="form-control" maxLength="4" placeholder="0000" name="thirdIban"  onChange={this.handleInputChange} />
                  </div>
                  <div className="col-md-3">
                    <input type="text" className="form-control" maxLength="4" placeholder="0000" name="fourthIban"  onChange={this.handleInputChange} />
                  </div>
                </div>
              </div>
            </a>
            <a href="#" className={this.state.activatePaypal ? 'list-group-item list-group-item-action active' : 'list-group-item list-group-item-action'} onClick={() => { this.activate("activatePaypal"); }}>
              <div className="form-group">
              <i className="fa fa-paypal"></i> <label>Paypal</label>
              </div>
            </a>
          </div>
        </section>
        <section className="col-md-12 sub-section">
          <button className="btn btn-primary previous" onClick={this.previous}>Previous</button>
          <button className="btn btn-success confirm" onClick={this.confirm}>Confirm</button>
        </section>
      </div>
    )
  }
}

export default PaymentForm;
