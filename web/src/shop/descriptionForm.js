import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';

class DescriptionForm extends Component {
  constructor(props) {
    super(props);
    this.uploadBannerImage = this.uploadBannerImage.bind(this);
    this.uploadPictureImage = this.uploadPictureImage.bind(this);
    this.toggleName = this.toggleName.bind(this);
    this.toggleDescription = this.toggleDescription.bind(this);
    this.toggleErrorName = this.toggleErrorName.bind(this);
    this.toggleErrorDescription = this.toggleErrorDescription.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validate = this.validate.bind(this);
    this.state = {
      name: null,
      description: null,
      bannerImage: null,
      pictureImage: null,
      tooltip: {
        toggleName : false,
        toggleDescription: false,
        toggleErrorName: false,
        toggleErrorDescription : false
      },
      valid: {
        isNameInvalid : false,
        isDescriptionInvalid: false
      }
    };
  }
  toggleName() {
    var tooltip = this.state.tooltip;
    tooltip.toggleName = !tooltip.toggleName;
    this.setState({
      tooltip: tooltip
    });
  }
  toggleDescription() {
    var tooltip = this.state.tooltip;
    tooltip.toggleDescription = !tooltip.toggleDescription;
    this.setState({
      tooltip: tooltip
    });
  }
  toggleErrorName() {
    var tooltip = this.state.tooltip;
    tooltip.toggleErrorName = !tooltip.toggleErrorName;
    this.setState({
      tooltip: tooltip
    });
  }
  toggleErrorDescription() {
    var tooltip = this.state.tooltip;
    tooltip.toggleErrorDescription = !tooltip.toggleErrorDescription;
    this.setState({
      tooltip: tooltip
    });
  }
  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  uploadImage(e, callback) {
    e.preventDefault();
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }
  uploadBannerImage(e) {
    var self = this;
    self.uploadImage(e, function(result) {
      self.setState({
        bannerImage: result
      });
    });
  }
  uploadPictureImage(e) {
    var self = this;
    self.uploadImage(e, function(result) {
      self.setState({
        pictureImage: result
      });
    });
  }
  validate() {
    var self = this;
    var valid = self.state.valid;
    var isValid = true;
    if (!self.state.name || self.state.name.length < 1 || self.state.name.length > 15) {
      valid.isNameInvalid = true;
      isValid = false;
    } else {
      valid.isNameInvalid = false;
    }

    if (!self.state.description || self.state.description.length < 1 || self.state.description.length > 255) {
      valid.isDescriptionInvalid = true;
      isValid = false;
    } else {
      valid.isDescriptionInvalid = false;
    }

    this.setState({
      valid: valid
    });

    if (isValid) {
      this.props.onNext();
    }
  }
  render() {
    var bannerImagePreview,
      pictureImagePreview,
      nameError,
      descriptionError;
    if (this.state.bannerImage) {
      bannerImagePreview = (<div className='image-container'><img src={this.state.bannerImage} width='50' height='50' /></div>);
    }

    if (this.state.pictureImage) {
      pictureImagePreview = (<div className='image-container'><img src={this.state.pictureImage} width='100' height='100' /></div>);
    }

    if (this.state.valid.isNameInvalid) {
      nameError = (<span><i className="fa fa-exclamation-triangle validation-error" id="nameErrorToolTip"></i>
      <Tooltip placement="right" target="nameErrorToolTip" isOpen={this.state.tooltip.toggleErrorName} toggle={this.toggleErrorName}>
        Should contains 1 to 15 characters
      </Tooltip></span>);
    }

    if (this.state.valid.isDescriptionInvalid) {
      descriptionError = (<span><i className="fa fa-exclamation-triangle validation-error" id="descriptionErrorTooltip"></i>
      <Tooltip placement="right" target="descriptionErrorTooltip" isOpen={this.state.tooltip.toggleErrorDescription} toggle={this.toggleErrorDescription}>
        Should contains 1 to 255 characters
      </Tooltip></span>);
    }

    return(
      <div>
        <section className="col-md-12 section">
          <div className='form-group col-md-12'>
            <label className='control-label'>Name</label> <i className="fa fa-exclamation-circle" id="nameToolTip"></i>
            <Tooltip placement="right" target="nameToolTip" isOpen={this.state.tooltip.toggleName} toggle={this.toggleName}>
              Name displayed in the shop's profile
            </Tooltip>
             {nameError}
            <input type='text' className='form-control' name='name' onChange={this.handleInputChange} />
          </div>
          <div className='form-group col-md-12'>
            <label className='control-label'>Description</label> <i className="fa fa-exclamation-circle" id="descriptionToolTip"></i>
            <Tooltip placement="right" target="descriptionToolTip" isOpen={this.state.tooltip.toggleDescription} toggle={this.toggleDescription}>
              Description displayed in the shop's profile
            </Tooltip>
             {descriptionError}
            <textarea className='form-control' name='description' onChange={this.handleInputChange}></textarea>
          </div>
          <div className='form-group col-md-12'><label className='control-label'>Category</label></div>
          <div className='form-group col-md-12'>
            <label className='control-label'>Banner image</label>
            <div><input type='file' onChange={(e) => this.uploadBannerImage(e)} /></div>
            {bannerImagePreview}
          </div>
          <div className='form-group col-md-12'>
            <label className='control-label'>Picture</label>
            <div><input type='file' onChange={(e) => this.uploadPictureImage(e)} /></div>
            {pictureImagePreview}
          </div>
        </section>
        <section className="col-md-12 sub-section">
          <button className="btn btn-primary next" onClick={this.validate}>Next</button>
        </section>
      </div>
    );
  }
}

export default DescriptionForm;
