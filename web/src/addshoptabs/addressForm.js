import React, {Component} from "react";
import {Button} from "reactstrap";
import {Address} from "../components";

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

    setAddressCorrect(c) {
        this.setState({
            isAddressCorrect: c
        });
    }

    previous() {
        this.props.onPrevious();
    }

    next() {
        var json = this.refs.address.getAddress();
        this.props.onNext(json);
    }

    display() {
        this.refs.address.display();
    }

    render() {
        return (
            <div className="container bg-white rounded">
                <section className="row p-1">
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
                    <Button outline color="info" onClick={this.previous}>Previous</Button>
                    <Button outline color="info"
                            disabled={!this.state.isAddressCorrect}
                            onClick={this.next}>{this.props.nextButtonLabel ? this.props.nextButtonLabel : 'Next'}</Button>
                </section>
            </div>
        );
    }
}

export default AddressForm;
