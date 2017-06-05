import React, {Component} from "react";
import './editableText.css';
import './editable.css';
import TagsInput from "react-tagsinput";

class EditableTextArea extends Component {
  constructor(props) {
    super(props);
    this.onClickField = this.onClickField.bind(this);
    this.validate = this.validate.bind(this);
    this.closeEditMode = this.closeEditMode.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      isEditMode: false,
      value: props.value,
      oldValue: props.value
    };
  }
  handleInputChange(e) {
    const value = e.target.value;
    this.setState({
      oldValue: value
    });
  }
  closeEditMode() {
    this.setState({
      isEditMode: false
    });
  }
  onClickField() {
    this.setState({
      isEditMode: true
    });
  }
  validate() {
    var oldValue = this.state.oldValue;
    this.setState({
      value: oldValue,
      isEditMode: false
    });
    if (this.props.validate) this.props.validate(oldValue);
  }
  render() {
    if (!this.state.isEditMode) {
      return (<div onClick={(e) => { this.onClickField(); }} className="editable-input">
        <span className={this.props.className}>{this.state.value}</span>
      </div>);
    }

    return <form onSubmit={(e) => { e.preventDefault(); this.validate(); }} className="row col-md-12">
      <div className="editable-input-container col-md-8">
        <textarea className="form-control" onChange={this.handleInputChange}>{this.state.oldValue}</textarea>
      </div>
      <div className="editable-buttons-container col-md-4">
        <button className="btn btn-primary btn-sm" onClick={(e) => {this.validate(); }}><i className="fa fa-check"></i></button>
        <button className="btn btn-default btn-sm" onClick={(e) => {this.closeEditMode(); }}><i className="fa fa-times"></i></button>
      </div>
    </form>
  }
  componentWillMount() {
  }
}

export default EditableTextArea;
