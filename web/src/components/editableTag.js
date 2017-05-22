import React, {Component} from "react";
import TagsInput from "react-tagsinput";
import './editable.css';

class EditableTag extends Component {
  constructor(props) {
    super(props);
    this.onClickField = this.onClickField.bind(this);
    this.handleTags = this.handleTags.bind(this);
    this.validate = this.validate.bind(this);
    this.closeEditMode = this.closeEditMode.bind(this);
    this.state = {
      tags: props.tags,
      oldTags: props.tags,
      isEditMode: false
    };
  }
  onClickField() {
    this.setState({
      isEditMode: true
    });
  }
  handleTags(tags) {
    this.setState({
      oldTags: tags
    });
  }
  validate() {
    var oldTags = this.state.oldTags;
    this.setState({
      tags: oldTags,
      isEditMode: false
    });
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

    return (<div>
      <div className="editable-input-container">
        <TagsInput value={this.state.oldTags} onChange={this.handleTags}/>
      </div>
      <div className="editable-buttons-container">
        <button className="btn btn-primary btn-sm" onClick={(e) => {this.validate(); }}><i className="fa fa-check"></i></button>
        <button className="btn btn-default btn-sm" onClick={(e) => {this.closeEditMode(); }}><i className="fa fa-times"></i></button>
      </div>
  </div>);
  }
}

export default EditableTag;
