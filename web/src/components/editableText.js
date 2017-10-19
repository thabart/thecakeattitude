import React, {Component} from "react";
import { translate } from 'react-i18next';
import { Input, FormFeedback } from "reactstrap";
import '../styles/editable.css';

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.onClickField = this.onClickField.bind(this);
    this.validate = this.validate.bind(this);
    this.closeEditMode = this.closeEditMode.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      isLengthInvalid: false,
      isEmailInvalid: false,
      isPhoneInvalid: false,
      isEditMode: false,
      value: props.value,
      oldValue: props.value
    };
  }

  handleInputChange(e) { // Handle the input change.
    const value = e.target.value;
    this.setState({
      oldValue: value
    });
  }

  closeEditMode() { // Close the edit mode.
    this.setState({
      isEditMode: false
    });
  }

  onClickField() { // Enable edit mode.
    this.setState({
      isEditMode: true
    });
  }

  validate() { // Validate the text.
    var self = this;
    var oldValue = self.state.oldValue;
    var type = self.props.type || 'txt';
    switch(type) {
      case 'txt': // Validate length.
        if (oldValue.length < this.props.minLength || oldValue.length > this.props.maxLength) {
          self.setState({
            isLengthInvalid: true
          });
          return;
        }
      break;
      case 'email': // Validate email.
        var regex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$");
        if (!regex.test(oldValue)) {
          self.setState({
            isEmailInvalid: true
          });
          return;
        }
      break;
      case 'phone': // Validate phone.
        var regex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
        if (!regex.test(oldValue)) {
          self.setState({
            isPhoneInvalid: true
          });
          return;
        }
      break;
      case 'number': // Validate the number.
        var min = self.props.min || 0;
        var max = self.props.max || Number.MAX_VALUE;
        if (oldValue < min || oldValue > max) {
          self.setState({
            isNumberInvalid: true
          });
          return;
        }
      break;
    }

    self.setState({
      value: oldValue,
      isEditMode: false,
      isInvalid: false
    });
    if (self.props.validate) self.props.validate(oldValue);
  }

  render() { // Render the view.
    const {t} = this.props;
    var self = this;
    if (!this.state.isEditMode) {
      var val = this.state.value;
      if (val === null || val === '') {
        val = t('unknown');
      }

      return (<div onClick={(e) => { this.onClickField(); }} className="editable-input">
        { self.props.label ? (<span className={this.props.className}>{self.props.label} {val}</span>) :
          (<span className={this.props.className}>{val}</span>)
        }
      </div>);
    }

    var feedbackName = null;
    var errorMessage = null;
    if (this.state.isLengthInvalid) {
      errorMessage = t('shouldContainsCharacters').replace('{0}', this.props.minLength).replace('{1}', this.props.maxLength);
      feedbackName = "danger";
    } else if (this.state.isEmailInvalid) {
      errorMessage = t('notValidEmail');
      feedbackName = 'danger';
    } else if (this.state.isPhoneInvalid) {
      errorMessage = t('notValidPhone');
      feedbackName = 'danger';
    } else if (this.state.isNumberInvalid) {
      errorMessage = t('notValidNumber').replace('{0}', this.props.min || 0).replace('{1}', this.props.max || Number.MAX_VALUE);
      feedbackName = 'danger';
    }

    var type = "text";
    var propType = this.props.type || 'txt';
    switch(propType) {
      case "email":
        type = "email";
      break;
      case "phone":
        type = "tel";
      break;
      case "number":
        type = "number";
      break;
    }
    return <form onSubmit={(e) => { e.preventDefault(); this.validate(); }} className="row">
      <div className="editable-input-container col-md-8">
        <Input type={type} className="form-control" state={feedbackName}
          value={this.state.oldValue}
          min={this.props.min}
          max={this.props.max}
          onChange={this.handleInputChange}
          minLength={this.props.minLength}
          maxLength={this.props.maxLength} />
        <FormFeedback>{errorMessage}</FormFeedback>
      </div>
      <div className="editable-buttons-container col-md-4">
        <button className="btn btn-default" onClick={(e) => {this.validate(); }}  style={{marginRight: "1px"}}>{t('ok')}</button>
        <button className="btn btn-default" onClick={(e) => {this.closeEditMode(); }}>{t('cancel')}</button>
      </div>
    </form>
  }
}

export default translate('common', { wait: process && !process.release })(EditableText);
