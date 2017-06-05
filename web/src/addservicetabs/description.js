import React, {Component} from "react";
import {Tooltip} from 'reactstrap';
import {TagsSelector, ImagesUploader} from '../components';

class DescriptionTab extends Component {
  constructor(props) {
    super(props);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validate = this.validate.bind(this);
    this.state = {
      name: null,
      description: null,
      price: 0,
      tooltip: {
        toggleName: false,
        toggleDescription: false,
        toggleTags: false,
        togglePrice: false,
        toggleImages: false
      },
      valid: {
        isNameInvalid: false,
        isDescriptionInvalid: false,
        isPriceInvalid: false
      }
    };
  }
  toggleTooltip(name) {
      var tooltip = this.state.tooltip;
      tooltip[name] = !tooltip[name];
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
  buildErrorTooltip(validName, description) {
      var result;
      if (this.state.valid[validName]) {
          result = (
            <span>
              <i className="fa fa-exclamation-triangle validation-error" id={validName}></i>
              <Tooltip placement="right" target={validName} isOpen={this.state.tooltip[validName]} toggle={() => {
                  this.toggleTooltip(validName);
              }}>
                {description}
              </Tooltip>
            </span> );
      }

      return result;
  }
  validate() {
    var self = this,
      valid = self.state.valid,
      isValid = true;
    // Check name
    if (!self.state.name || self.state.name.length < 1 || self.state.name.length > 15) {
        valid.isNameInvalid = true;
        isValid = false;
    } else {
        valid.isNameInvalid = false;
    }

    // Check description
    if (!self.state.description || self.state.description.length < 1 || self.state.description.length > 255) {
        valid.isDescriptionInvalid = true;
        isValid = false;
    } else {
        valid.isDescriptionInvalid = false;
    }

    // Check price
    if (self.state.price && self.state.price !== null && (isNaN(parseFloat(self.state.price)) || !isFinite(self.state.price) || parseFloat(self.state.price) < 0)) {
      valid.isPriceInvalid = true;
      isValid = false;
    } else {
      valid.isPriceInvalid = false;
    }

    this.setState({
      valid: valid
    });

    if (!isValid) {
      return;
    }

    var json = {
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      images: this.refs.imagesUploader.getImages(),
      tags : this.refs.tagsSelector.getTags()
    };
    if (this.props.onNext) this.props.onNext(json);
  }
  render() {
    var nameError = this.buildErrorTooltip('isNameInvalid', 'Should contains 1 to 15 characters'),
      descriptionError = this.buildErrorTooltip('isDescriptionInvalid', 'Should contains 1 to 255 characters'),
      priceError = this.buildErrorTooltip('isPriceInvalid', 'the price should be a number > 0');
    return (<div>
      <section className="row">
        <div className="form-group col-md-12">
          <label className="form-label">Name</label> <i className="fa fa-exclamation-circle" id="nameTooltip"></i>
          <Tooltip placement="right" target="nameTooltip" isOpen={this.state.tooltip.toggleName} toggle={() => { this.toggleTooltip('toggleName'); }}>
            Displayed name
          </Tooltip> {nameError}
         <input type='text' className='form-control' name='name' onChange={this.handleInputChange}/>
        </div>
        <div className="form-group col-md-12">
          <label className="form-label">Description</label> <i className="fa fa-exclamation-circle" id="descriptionTooltip"></i>
          <Tooltip placement="right" target="descriptionTooltip" isOpen={this.state.tooltip.toggleDescription} toggle={() => { this.toggleTooltip('toggleDescription'); }}>
            Description of your service
          </Tooltip> {descriptionError}
          <textarea type='text' className='form-control' name='description' onChange={this.handleInputChange}></textarea>
        </div>
        <div className="form-group col-md-12">
          <label className="form-label">Tags</label> <i className="fa fa-exclamation-circle" id="tagsTooltip"></i>
          <Tooltip placement="right" target="tagsTooltip" isOpen={this.state.tooltip.toggleTags} toggle={() => { this.toggleTooltip('toggleTags'); }}>
            Add some tags
          </Tooltip>
          <TagsSelector ref="tagsSelector" />
        </div>
        <div className="form-group col-md-12">
          <label className="form-label">Price</label> <i className="fa fa-exclamation-circle" id="priceTooltip"></i>
          <Tooltip placement="right" target="priceTooltip" isOpen={this.state.tooltip.togglePrice} toggle={() => { this.toggleTooltip('togglePrice'); }}>
            Give a price to your service
          </Tooltip> {priceError}
         <div className="input-group">
           <span className="input-group-addon">€</span>
           <input type="number" className="form-control" name="price" onChange={this.handleInputChange} />
          </div>
        </div>
        <div className="form-group col-md-12">
          <label className="control-label">Images</label> <i className="fa fa-exclamation-circle" id="imagesTooltip"></i>
          <Tooltip placement="right" target="imagesTooltip" isOpen={this.state.tooltip.toggleImages} toggle={() => { this.toggleTooltip('toggleImages'); }}>
            Add one or more images
          </Tooltip>
          <ImagesUploader ref="imagesUploader" />
        </div>
      </section>
      <section className="col-md-12 sub-section">
          <button className="btn btn-primary next" onClick={this.validate}>Next</button>
      </section>
  </div>);
  }
}

export default DescriptionTab;
