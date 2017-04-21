import React, { Component } from 'react';
import { Input } from 'reactstrap';
import './paymentForm.css';

class PaymentForm extends Component {
  constructor(props) {
    super(props);
    this.previous = this.previous.bind(this);
  }
  handleRib() {
    // regex : ^[A-Z]{2}[0-9]{2}([0-9]{4}){3}
  }
  previous() {
    this.props.onPrevious();
  }
  render() {
    return (
      <div>
        <section className="col-md-12 section">
          <div className='input-group'><span className='input-group-addon'><input type='radio' /></span><span className='form-control'>Card</span></div>
          <div className='input-group'><span className='input-group-addon'><input type='radio' /></span><span className='form-control'>Cash</span></div>
          <div className="row payment-choice">
            <div className="col-md-1 radio">
              <input type='radio' />
            </div>
            <div className="col-md-11">
              <div className="form-group">
                <i className="fa fa-credit-card-alt"></i> <label>Bank transfer</label>
                <Input placeholder="BE__ ____ ____ ____" />
              </div>
            </div>
          </div>
          <div className='input-group'><span className='input-group-addon'><input type='radio' /></span><span className='form-control'>Paypal</span></div>
        </section>
        <section className="col-md-12 sub-section">
          <button className="btn btn-primary previous" onClick={this.onPrevious}>Previous</button>
          <button className="btn btn-success confirm">Confirm</button>
        </section>
      </div>
    )
  }
}

export default PaymentForm;
