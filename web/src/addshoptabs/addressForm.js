import React, {Component} from "react";
import {Address} from '../components';

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
            <div>
                <section className="row section">
                  <Address ref="address" onLoading={(e) => { this.props.onLoading(e); }}
                      onWarning={(e) => { this.props.onWarning(e);}} onError={(e) => {this.props.onError(e); }}
                      addressCorrect={(e) => {this.setAddressCorrect(e); }}/>
                </section>
                <section className="col-md-12 sub-section">
                    <button className="btn btn-primary previous" onClick={this.previous}>Previous</button>
                    <button className={this.props.nextButtonClass ? this.props.nextButtonClass : 'btn btn-primary next'} disabled={!this.state.isAddressCorrect}
                            onClick={this.next}>
                            {this.props.nextButtonLabel ? this.props.nextButtonLabel : 'Next'}
                    </button>
                </section>
            </div>
        );
    }
}

export default AddressForm;
