import React, {Component} from "react";
import { translate } from 'react-i18next';
import { PrintOrderLabelStore } from '../stores/index';
import { FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import Cards from 'react-credit-cards';
import Pay from 'payment';
import AppDispatcher from '../appDispatcher';
import Constants from '../../Constants';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.buildErrorTooltip = this.buildErrorTooltip.bind(this);
    this.state = {
      number: '',
      name: '',
      exp: '',
      cvc: '',
      focused: '',
      valid: {
        isNumberValid: true,
        isNameValid: true,
        isExpiryValid: true,
        isCvcValid: true
      }
    }
  }

  previous() { // Execute when the user clicks on previous.
    if (this.props.onPrevious) {
      this.props.onPrevious();
    }
  }

  next() { // Execute when the user clicks on next.
    var self = this,
      valid = self.state.valid,
      isValid = true;
    if (!self.state.number || !Pay.fns.validateCardNumber(self.state.number)) { // Check the number.
      valid.isNumberValid = true;
      isValid = false;
    } else {
      valid.isNumberValid = false;
    }

    if (!self.state.name || self.state.name.length <= 0 || self.state.name.length > 50) { // Check the name.
      valid.isNameValid = true;
      isValid = false;
    } else {
      valid.isNameValid = false;
    }

    if (!self.state.exp || !Pay.fns.validateCardExpiry(self.state.exp)) { // Check the expiry.
      valid.isExpiryValid = true;
      isValid = false;
    } else {
      valid.isExpiryValid = false;
    }

    if (!self.state.cvc || !Pay.fns.validateCardCVC(self.state.cvc)) { // Check the CVC.
      valid.isCvcValid = true;
      isValid = false;
    } else {
      valid.isCvcValid = false;
    }

    self.setState({
      valid: valid
    });

    if (!isValid) {
      return;
    }

    var order = PrintOrderLabelStore.getOrder();
    order.package.card = {
      number: self.state.number,
      name: self.state.name,
      expiration: self.state.exp,
      cvc: self.state.cvc
    };
    AppDispatcher.dispatch({
      actionName: Constants.events.UPDATE_ORDER_LABEL_ACT,
      data: order
    });
    if (this.props.onNext) {
      this.props.onNext();
    }
  }

  handleInputChange(e) { // Execute to handle the changes.
    const target = e.target;
    if (target.name === 'number') {
      this.setState({
        [target.name]: target.value.replace(/ /g, ''),
      });
    }
    else if (target.name === 'expiry') {
      this.setState({
        [target.name]: target.value.replace(/ |\//g, ''),
      });
    }
    else {
      this.setState({
        [target.name]: target.value,
      });
    }
  }

  handleInputFocus(e) { // Handle input focus.
    const target = e.target;
    this.setState({
      focused: target.name,
    });
  };

  buildErrorTooltip(validName, description) { // Build the error tooltip.
    var result;
    if (this.state.valid[validName]) {
      result = (
        <span>
          {description}
        </span> );
    }

    return result;
  }

  render() { // Display the component.
    const { t } = this.props;
    const { name, number, expiry, cvc, focused } = this.state;
    var numberError = this.buildErrorTooltip('isNumberValid', t('valueShouldContains').replace('{0}', '16')),
      nameError = this.buildErrorTooltip('isNameValid', t('valueShouldBeInRange').replace('{0}', '1').replace('{1}', '50')),
      expiryError = this.buildErrorTooltip('isExpiryValid', t('expiryInvalid')),
      cvcError = this.buildErrorTooltip('isCvcValid', t('valueShouldContains').replace('{0}', '4'));
    const feedbackNumber = numberError ? "danger" : undefined;
    const feedbackName = nameError ? "danger": undefined;
    const feedbackExpiry = expiryError ? "danger": undefined;
    const feedbackCvc = cvcError ? "danger" : undefined;

    return (<div>
      <div style={{padding: "10px"}}>
        <p>{t('packagingPaymentDescription')}</p>
        <div className="row">
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
            <FormGroup color={feedbackNumber}>
              <Label className="col-form-label">{t('cardNumber')}</Label>
              <Input type="tel" state={feedbackNumber} className="form-control" name="number" onKeyUp={this.handleInputChange} onFocus={this.handleInputFocus} />
              <FormFeedback>{numberError}</FormFeedback>
            </FormGroup>
            <FormGroup color={feedbackName}>
              <Label className="col-form-label">{t('name')}</Label>
              <Input type="text" state={feedbackName} className="form-control" name="name" onKeyUp={this.handleInputChange} onFocus={this.handleInputFocus} />
              <FormFeedback>{nameError}</FormFeedback>
            </FormGroup>
            <div className="row">
              <div className="col-md-6">
                <FormGroup color={feedbackExpiry}>
                  <Label className="col-form-label">{t('validity')}</Label>
                  <Input type="tel" state={feedbackExpiry} className="form-control" name="exp" onKeyUp={this.handleInputChange} onFocus={this.handleInputFocus} />
                  <FormFeedback>{expiryError}</FormFeedback>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup color={feedbackCvc}>
                  <Label className="col-form-label">{t('cvc')}</Label>
                  <Input type="tel" state={feedbackCvc} className="form-control" name="cvc" onKeyUp={this.handleInputChange} onFocus={this.handleInputFocus} />
                  <FormFeedback>{cvcError}</FormFeedback>
                </FormGroup>
              </div>
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

  componentDidMount() {
    Pay.formatCardNumber(document.querySelector('[name="number"]'));
    Pay.formatCardExpiry(document.querySelector('[name="exp"]'));
    Pay.formatCardCVC(document.querySelector('[name="cvc"]'));
  }
}

export default translate('common', { wait: process && !process.release })(Payment);
