import React, {Component} from "react";
import { Button } from "reactstrap";
import { PaymentMethodsSelector } from "../components";
import { translate } from 'react-i18next';

class PaymentForm extends Component {
    constructor(props) {
        super(props);
        this.previous = this.previous.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    confirm() { // Executes when the user clicks on "confirm".
        if (this.props.onConfirm) this.props.onConfirm();
    }

    previous() { // Executes when the user clicks on "previous".
        this.props.onPrevious();
    }

    render() { // Renders the view.
        const {t} = this.props;
        return (
            <div className="container bg-white rounded">
                <div className="col-md-12">
                    <section className="row p-1">
                        <p>
                            <i className="fa fa-exclamation-circle txt-info"/>{' '}
                            {t('paypalPaymentDescription')}
                        </p>
                    </section>
                    <section className="row p-1">
                        <Button color="default" onClick={this.previous}>{t('previous')}</Button>
                        <Button color="default" style={{marginLeft: "5px"}} onClick={this.confirm}>{t('confirm')}</Button>
                    </section>
                </div>
            </div>
        )
    }
}

export default translate('common', { wait: process && !process.release })(PaymentForm);
