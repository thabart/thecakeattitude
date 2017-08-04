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
      isInvalid: false,
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
    var oldValue = this.state.oldValue;
    if (oldValue.length < this.props.minLength || oldValue.length > this.props.maxLength) {
      this.setState({
        isInvalid: true
      });
      return;
    }

    this.setState({
      value: oldValue,
      isEditMode: false,
      isInvalid: false
    });
    if (this.props.validate) this.props.validate(oldValue);
  }

  render() { // Render the view.
    if (!this.state.isEditMode) {
      return (<div onClick={(e) => { this.onClickField(); }} className="editable-input">
        <span className={this.props.className}>{this.state.value}</span>
      </div>);
    }

    const {t} = this.props;
    var feedbackName = null;
    var errorMessage = null;
    if (this.state.isInvalid) {
      errorMessage = t('shouldContainsCharacters').replace('{0}', this.props.minLength).replace('{1}', this.props.maxLength);
      feedbackName = "danger";
    }

    return <form onSubmit={(e) => { e.preventDefault(); this.validate(); }} className="row">
      <div className="editable-input-container col-md-8">
        <Input type="text" className="form-control" state={feedbackName} value={this.state.oldValue} onChange={this.handleInputChange} minLength={this.props.minLength} maxLength={this.props.maxLength} />
        <FormFeedback>{errorMessage}</FormFeedback>
      </div>
      <div className="editable-buttons-container col-md-4">
        <button className="btn btn-default" onClick={(e) => {this.validate(); }}>{t('ok')}</button>
        <button className="btn btn-default" onClick={(e) => {this.closeEditMode(); }} style={{marginLeft: "5px"}}>{t('cancel')}</button>
      </div>
    </form>
  }
}

export default translate('common', { wait: process && !process.release })(EditableText);
