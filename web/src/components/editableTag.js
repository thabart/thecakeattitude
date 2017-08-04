import React, {Component} from "react";
import { translate } from 'react-i18next';
import TagsSelector from './tagsSelector';
import '../styles/editable.css';

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

  onClickField() { // Enable the edit mode.
    this.setState({
      isEditMode: true
    });
  }

  validate() { // Validate tags.
    this.setState({
      tags: this._tagsSelector.getTags(),
      isEditMode: false
    });
    if (this.props.validate) this.props.validate(this._tagsSelector.getTags());
  }

  closeEditMode() { // Close the edit mode.
    this.setState({
      isEditMode: false
    });
  }

  render() { // Display the view.
    const {t} = this.props;
    if (!this.state.isEditMode) {
      var tags = [],
        self = this;
      if (self.state.tags && self.state.tags.length > 0) {
        self.state.tags.forEach(function (tag) {
          tags.push((<li>{tag}</li>));
        });
      }
      return (<div className="editable-input" onClick={(e) => { this.onClickField(); }}>
        {tags.length > 0 ? (
          <ul className="tags no-padding">
            {tags}
          </ul>
        ) : (
          <div><i>{t('noTags')}</i></div>
        )}
      </div>);
    }

    return (<div className="row">
        <div className="editable-input-container col-md-8">
          <TagsSelector ref={(elt) => {
            this._tagsSelector = elt;
          }} tags={this.state.tags} />
        </div>
        <div className="editable-buttons-container col-md-4">
          <button className="btn btn-default" onClick={(e) => {this.validate(); }}>{t('ok')}</button>
          <button className="btn btn-default" onClick={(e) => {this.closeEditMode(); }} style={{marginLeft: "5px"}}>{t('cancel')}</button>
        </div>
      </div>);
  }
}

export default translate('common', { wait: process && !process.release })(EditableTag);
