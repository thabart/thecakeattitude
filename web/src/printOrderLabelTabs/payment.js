import React, {Component} from "react";
import { translate } from 'react-i18next';
import Cards from 'react-credit-cards';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.state = {
      number: '',
      name: '',
      exp: '',
      cvc: '',
      focused: ''
    }
  }

  previous() { // Execute when the user clicks on previous.
    if (this.props.onPrevious) {
      this.props.onPrevious();
    }
  }

  next() { // Execute when the user clicks on next.
    if (this.props.onNext) {
      this.props.onNext();
    }
  }

  handleInputChange(e) { // Execute to handle the changes.
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }

  handleInputFocus(e) { // Handle input focus.
    const target = e.target;
    this.setState({
      focused: target.name,
    });
  };

  render() { // Display the component.
    const { t } = this.props;
    const { name, number, expiry, cvc, focused } = this.state;
    return (<div>
      <div className="row" style={{padding: "10px"}}>
        { /* Display card */ }
        <div className="col-md-6">
          <Cards
              number={number}
              name={name}
              expiry={expiry}
              cvc={cvc}
              focused={focused} />
        </div>
        { /* Display form */ }
        <div className="col-md-6">
          <div className="form-group">
            <label>{t('cardNumber')}</label>
            <input type="text" className="form-control" name="number" onKeyUp={this.handleInputChange} onFocus={this.handleInputFocus} />
          </div>
          <div className="form-group">
            <label>{t('name')}</label>
            <input type="text" className="form-control" name="name" onKeyUp={this.handleInputChange} onFocus={this.handleInputFocus} />
          </div>
          <div className="form-group row">
            <div className="col-md-6">
              <label>{t('validity')}</label>
              <input type="text" className="form-control" name="expiry" onKeyUp={this.handleInputChange} onFocus={this.handleInputFocus} />
            </div>
            <div className="col-md-6">
              <label>{t('cvc')}</label>
              <input type="text" className="form-control" name="cvc" placeholder="CVC" onKeyUp={this.handleInputChange} onFocus={this.handleInputFocus} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <button className="btn btn-default" onClick={this.previous}>{t('previous')}</button>
        <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={this.next}>{t('next')}</button>
      </div>
    </div>);
  }
}

export default translate('common', { wait: process && !process.release })(Payment);
