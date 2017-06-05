import React, {Component} from "react";
import {Button} from "reactstrap";
import {PaymentMethodsSelector} from "../components";

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
            <div className="container bg-white rounded">
                <div className="col-md-12">
                    <section className="row p-1">
                        <p>
                            <i className="fa fa-exclamation-circle text-info"/>{' '}
                            Choose one or more payment method(s)
                        </p>
                        <PaymentMethodsSelector ref="selector" onError={this.props.onError}/>
                    </section>
                    <section className="row p-1">
                        <Button outline color="info" onClick={this.previous}>Previous</Button>
                        <Button outline color="info" onClick={this.confirm}>Confirm</Button>
                    </section>
                </div>
            </div>
        )
    }
}

export default PaymentForm;
