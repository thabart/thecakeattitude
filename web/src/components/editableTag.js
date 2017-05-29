import React, {Component} from "react";
import TagsInput from "react-tagsinput";
import TagsSelector from './tagsSelector';
import './editable.css';

class EditableTag extends Component {
  constructor(props) {
    super(props);
    this._tagsSelector = null;
    this.onClickField = this.onClickField.bind(this);
    this.validate = this.validate.bind(this);
    this.closeEditMode = this.closeEditMode.bind(this);
    this.state = {
      tags: props.tags,
      isEditMode: false
    };
  }
  onClickField() {
    this.setState({
      isEditMode: true
    });
  }
  validate() {
    this.setState({
      tags: this._tagsSelector.getTags(),
      isEditMode: false
    });
    if (this.props.validate) this.props.validate(this._tagsSelector.getTags());
  }
  closeEditMode() {
    this.setState({
      isEditMode: false
    });
  }
  render() {
    if (!this.state.isEditMode) {
      var tags = [],
        self = this;
      if (self.state.tags && self.state.tags.length > 0) {
        self.state.tags.forEach(function (tag) {
          tags.push((<li>{tag}</li>));
        });
      }
      return (<div className="editable-input" onClick={(e) => { this.onClickField(); }}>
        <ul className="tags no-padding">
          {tags}
        </ul>
      </div>);
    }

    return (<div className="row">
      <div className="editable-input-container col-md-8">
        <TagsSelector ref={(elt) => {
          this._tagsSelector = elt;
        }} tags={this.state.tags} />
      </div>
      <div className="editable-buttons-container col-md-4">
        <button className="btn btn-primary btn-sm" onClick={(e) => {this.validate(); }}><i className="fa fa-check"></i></button>
        <button className="btn btn-default btn-sm" onClick={(e) => {this.closeEditMode(); }}><i className="fa fa-times"></i></button>
      </div>
  </div>);
  }
}

export default EditableTag;
