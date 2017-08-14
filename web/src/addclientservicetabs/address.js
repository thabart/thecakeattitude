import React, {Component} from "react";
import { Button } from "reactstrap";
import { Address } from "../components";
import { translate } from 'react-i18next';

class AddressForm extends Component {
    constructor(props) {
        super(props);
        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
        this.setAddressCorrect = this.setAddressCorrect.bind(this);
        this.state = {
            isAddressCorrect: false
        };
    }

    setAddressCorrect(c) { // Set the state "isAddressCorrect" : enable or disable the next button.
        this.setState({
            isAddressCorrect: c
        });
    }

    previous() { // Actions executes when the user clicks on the "previous" button.
        this.props.onPrevious();
    }

    next() { // Action executes when the user clicks on the "next" button.
        var json = this.refs.address.getWrappedInstance().getAddress();
        this.props.onNext(json);
    }

    display() { // Display the map.
        this.refs.address.getWrappedInstance().display();
    }

    render() { // Render the view.
        const {t} = this.props;
        return (
            <div className="container bg-white rounded">
                <section className="row p-1">
                    <div className="col-md-12"><p><i className="fa fa-exclamation-triangle txt-info"></i>{t('clientServiceAddressDescription')}</p></div>
                    <Address ref="address"
                             onLoading={(e) => {
                                 this.props.onLoading(e);
                             }}
                             onWarning={(e) => {
                                 this.props.onWarning(e);
                             }}
                             onError={(e) => {
                                 this.props.onError(e);
                             }}
                             addressCorrect={(e) => {
                                 this.setAddressCorrect(e);
                             }}/>
                </section>
                <section className="row p-1">
                    <Button color="default" onClick={this.previous}>{t('previous')}</Button>
                    <Button color="default"
                            style={{marginLeft: "5px"}}
                            disabled={!this.state.isAddressCorrect}
                            onClick={this.next}>{this.props.nextButtonLabel ? this.props.nextButtonLabel : t('next')}</Button>
                </section>
            </div>
        );
    }
}

export default translate('common', { wait: process && !process.release, withRef: true })(AddressForm);
