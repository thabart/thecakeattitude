import React, {Component} from "react";
import {PaymentMethodsSelector} from '../components';

class PaymentForm extends Component {
    constructor(props) {
        super(props);
        this.previous = this.previous.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    confirm() {
      var result = this.refs.selector.validate();
      if (result && result !== null) {
        if (this.props.onConfirm) this.props.onConfirm({payments: result});
      }
    }

    previous() {
        this.props.onPrevious();
    }

    render() {
        return (
            <div>
                <section className="col-md-12 section">
                    <p><i className="fa fa-exclamation-circle"></i> Choose one or more payment method(s)</p>
                    <PaymentMethodsSelector ref="selector" onError={this.props.onError}/>
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
