import React, {Component} from "react";
import { UncontrolledTooltip, FormFeedback, FormGroup, Label } from 'reactstrap';
import { TagsSelector, ImagesUploader } from '../components';
import { translate } from 'react-i18next';

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

  toggleTooltip(name) { // Toggle tooltip.
      var tooltip = this.state.tooltip;
      tooltip[name] = !tooltip[name];
      this.setState({
          tooltip: tooltip
      });
  }

  handleInputChange(e) { // Handle input change.
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }

  buildErrorTooltip(validName, description) { // Build error tooltip.
      var result;
      if (this.state.valid[validName]) {
          result = (
            <span>
              {description}
            </span> );
      }

      return result;
  }

  validate() { // Validate the form.
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

  render() { // Display the component.
    const {t} = this.props;
    var nameError = this.buildErrorTooltip('isNameInvalid', t('contains1To50CharsError')),
      descriptionError = this.buildErrorTooltip('isDescriptionInvalid', t('contains1To255CharsError')),
      priceError = this.buildErrorTooltip('isPriceInvalid', t('priceInvalid'));
    const feedbackName = nameError ? "danger" : undefined;
    const feedbackDescription = descriptionError ? "danger": undefined;
    const feedbackPrice = priceError ? "danger": undefined;
    return (<div className="container bg-white rounded">
      <section className="row p-1">
        <div className="col-md-12">
          { /* Name */ }
          <FormGroup color={feedbackName}>
            <Label className="col-form-label">{t('name')}</Label> <i className="fa fa-info-circle txt-info" id="nameTooltip"></i>
            <UncontrolledTooltip placement="right" target="nameTooltip" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleName} toggle={() => { this.toggleTooltip('toggleName'); }}>
              {t('addShopServiceNameTooltip')}
            </UncontrolledTooltip>
            <input type='text' className='form-control' name='name' onChange={this.handleInputChange}/>
            <FormFeedback>{nameError}</FormFeedback>
          </FormGroup>
          { /* Description */ }
          <FormGroup color={feedbackDescription}>
            <Label className="col-form-label">{t('description')}</Label> <i className="fa fa-info-circle txt-info" id="descriptionTooltip"></i>
            <UncontrolledTooltip placement="right" target="descriptionTooltip" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleDescription} toggle={() => { this.toggleTooltip('toggleDescription'); }}>
              {t('addShopServiceDescriptionTooltip')}
            </UncontrolledTooltip>
            <textarea type='text' className='form-control' name='description' onChange={this.handleInputChange}></textarea>
            <FormFeedback>{descriptionError}</FormFeedback>
          </FormGroup>
          { /* Tags */ }
          <FormGroup>
            <Label className="col-form-label">{t('tags')}</Label> <i className="fa fa-info-circle txt-info" id="tagsTooltip"></i>
            <UncontrolledTooltip placement="right" target="tagsTooltip" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleTags} toggle={() => { this.toggleTooltip('toggleTags'); }}>
              {t('addShopServiceTagsTooltip')}
            </UncontrolledTooltip>
            <TagsSelector ref="tagsSelector" />
          </FormGroup>
          { /* Price */}
          <FormGroup color={feedbackPrice}>
            <Label className="col-form-label">{t('price')}</Label> <i className="fa fa-info-circle txt-info" id="priceTooltip"></i>
            <UncontrolledTooltip placement="right" target="priceTooltip" className="red-tooltip-inner" isOpen={this.state.tooltip.togglePrice} toggle={() => { this.toggleTooltip('togglePrice'); }}>
              {t('addShopServicePriceTooltip')}
            </UncontrolledTooltip>
            <div className="input-group">
              <span className="input-group-addon">€</span>
              <input type="number" className="form-control" name="price" onChange={this.handleInputChange} />
            </div>
            <FormFeedback>{priceError}</FormFeedback>
          </FormGroup>
          { /* Images */ }
          <FormGroup>
            <Label className="col-form-label">{t('images')}</Label> <i className="fa fa-info-circle txt-info" id="imagesTooltip"></i>
            <UncontrolledTooltip placement="right" target="imagesTooltip" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleImages} toggle={() => { this.toggleTooltip('toggleImages'); }}>
              {t('addShopServiceImagesTooltip')}
            </UncontrolledTooltip>
            <ImagesUploader ref="imagesUploader" />
          </FormGroup>
        </div>
      </section>
      <section className="row p-1">
          <button className="btn btn-default" onClick={this.validate}>{t('next')}</button>
      </section>
  </div>);
  }
}

export default translate('common', { wait: process && !process.release })(DescriptionTab);
