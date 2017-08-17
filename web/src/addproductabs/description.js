import React, {Component} from "react";
import { Tooltip, FormGroup, UncontrolledTooltip, Input, Label, FormFeedback } from 'reactstrap';
import { withRouter } from "react-router";
import { ShopsService } from '../services/index';
import { TagsSelector, ImagesUploader } from '../components';
import { AddProductStore } from '../stores';
import { translate } from 'react-i18next';

class DescriptionTab extends Component {
  constructor(props) {
    super(props);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.next = this.next.bind(this);
    this.toggleUnlimited = this.toggleUnlimited.bind(this);
    this.state = {
      name: null,
      description: null,
      price: null,
      unitOfMeasure: "piece",
      quantity: 0,
      unlimited: true,
      availableInStock: 0,
      productCategories: [],
      tooltip: {
        toggleName: false,
        toggleDescription: false,
        toggleImages: false,
        togglePrice: false,
        toggleUnitOfMeasure: false,
        toggleQuantity: false,
        toggleInStock: false,
        toggleProductCategory: false,
        toggleProductTags: false
      },
      valid: {
        isNameInvalid: false,
        isDescriptionInvalid: false,
        isPriceInvalid: false,
        isQuantityInvalid: false,
        isInStockInvalid: false
      }
    };
  }

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

  handleInputChange(e) { // Handle input change.
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }

  toggleTooltip(name) { // Toggle the tooltip.
      var tooltip = this.state.tooltip;
      tooltip[name] = !tooltip[name];
      this.setState({
          tooltip: tooltip
      });
  }

  next() { // Execute when the user clicks on next.
    var self = this,
      valid = self.state.valid,
      isValid = true;
    // Check name
    if (!self.state.name || self.state.name.length < 1 || self.state.name.length > 50) {
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

    // Check the Price
    if (!self.state.price || self.state.price < 0) {
      valid.isPriceInvalid = true;
      isValid = false;
    } else {
      valid.isPriceInvalid = false;
    }

    // Check the quantity
    if (!self.state.quantity || self.state.quantity < 0) {
      valid.isQuantityInvalid = true;
      isValid = false;
    } else {
      valid.isQuantityInvalid = false;
    }

    // Check available in stock
    if (!self.state.unlimited && (!self.state.availableInStock || self.state.availableInStock < 0)) {
      valid.isInStockInvalid = true;
      isValid = false;
    } else {
      valid.isInStockInvalid = false;
    }

    this.setState({
      valid: valid
    });

    if (!isValid) {
      return;
    }

    var json = {
      name: self.state.name,
      description: self.state.description,
      price: self.state.price,
      new_price: self.state.price,
      unit_of_measure: self.state.unitOfMeasure,
      quantity: self.state.quantity,
      shop_id: self.props.match.params.id,
      images : self.refs.imagesUploader.getImages(),
      tags: self.refs.productTags.getTags()
    };

    if (self.state.productCategory && self.state.productCategory !== null) {
      json['category_id'] = self.state.productCategory;
    }

    if (!self.state.unlimited) {
      json['available_in_stock'] = self.state.availableInStock;
    }

    this.props.next(json);
  }

  toggleUnlimited() { // Toggle unlimited checkbox.
    var unlimited = this.state.unlimited;
    this.setState({
      unlimited: !unlimited
    });
  }

  render() { // Display the tab.
    const {t} = this.props;
    var nameError = this.buildErrorTooltip('isNameInvalid', t('contains1To50CharsError')),
      descriptionError = this.buildErrorTooltip('isDescriptionInvalid', t('contains1To255CharsError')),
      priceError = this.buildErrorTooltip('isPriceInvalid', t('priceInvalid')),
      quantityError = this.buildErrorTooltip('isQuantityInvalid', t('quantityError')),
      inStockError = this.buildErrorTooltip('isInStockInvalid', t('stockError')),
      productCategories = [(<option></option>)],
      self = this;
    const feedbackName = nameError ? "danger" : undefined;
    const feedbackDescription = descriptionError ? "danger": undefined;
    const feedbackPrice = priceError ? "danger": undefined;
    const feedbackQuantity = quantityError ? "danger" : undefined;
    const feedbackStock = inStockError ? "danger": undefined;
    if (this.state.productCategories && this.state.productCategories.length > 0) {
      this.state.productCategories.forEach(function(productCategory) {
        productCategories.push((<option value={productCategory.id}>{productCategory.name}</option>));
      });
    }

    return (
      <div className="container rounded">
        <section className="row p-1">
         {/* Left side */ }
          <div className="col-md-6">
            { /* Name */ }
            <FormGroup color={feedbackName}>
              <Label className='col-form-label'>{t('name')}  <i className="fa fa-info-circle txt-info" id="nameTooltip"></i></Label>
              <UncontrolledTooltip placement="right" target="nameTooltip" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleName} toggle={() => { this.toggleTooltip('toggleName'); }}>
                {t('productNameTooltip')}
              </UncontrolledTooltip>
              <Input type='text' state={feedbackName} className='form-control' name='name' onChange={this.handleInputChange}/>
              <FormFeedback>{nameError}</FormFeedback>
            </FormGroup>
            { /* Description */ }
            <FormGroup color={feedbackDescription}>
              <Label className="col-form-label">{t('description')} <i className="fa fa-info-circle txt-info" id="descriptionToolTip"></i></Label>
              <UncontrolledTooltip placement="right" target="descriptionToolTip" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleDescription} toggle={() => { this.toggleTooltip('toggleDescription'); }}>
                {t('productDescriptionTooltip')}
              </UncontrolledTooltip>
              <Input type="textarea" state={feedbackDescription} className='form-control' name='description' onChange={this.handleInputChange} />
              <FormFeedback>{descriptionError}</FormFeedback>
            </FormGroup>
            { /* Product category */ }
            <FormGroup>
              <Label className="col-form-label">{t('chooseProductCategory')}  <i className="fa fa-info-circle txt-info" id="productCategory"></i></Label>
              <UncontrolledTooltip placement="right" target="productCategory" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleProductCategory} toggle={() => { this.toggleTooltip('toggleProductCategory'); }}>
                {t('chooseProductCategoryTooltip')}
              </UncontrolledTooltip>
              <select name="productCategory" onChange={this.handleInputChange} className="form-control">{productCategories}</select>
            </FormGroup>
            { /* Tags */ }
            <FormGroup>
              <Label className="col-form-label">{t('tags')} <i className="fa fa-info-circle txt-info" id="productTags"></i></Label>
              <UncontrolledTooltip placement="right" target="productTags" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleProductTags} toggle={() => { this.toggleTooltip('toggleProductTags'); }}>
                {t('productTagsTooltip')}
              </UncontrolledTooltip>
              <TagsSelector ref="productTags"/>
            </FormGroup>
            { /* Images */ }
            <FormGroup>
              <Label className="col-form-label">{t('images')} <i className="fa fa-info-circle txt-info" id="imagesTooltip"></i></Label>
              <Tooltip placement="right" target="imagesTooltip" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleImages} toggle={() => { this.toggleTooltip('toggleImages'); }}>
                {t('productImagesTooltip')}
              </Tooltip>
              <ImagesUploader ref="imagesUploader" />
            </FormGroup>
          </div>
          { /* Right side */ }
          <div className="col-md-6">
            { /* Price */ }
            <FormGroup color={feedbackPrice}>
              <Label className="col-form-label">{t('price')} <i className="fa fa-info-circle txt-info" id="priceTooltip"></i></Label>
              <UncontrolledTooltip placement="right" target="priceTooltip" className="red-tooltip-inner" isOpen={this.state.tooltip.togglePrice} toggle={() => { this.toggleTooltip('togglePrice'); }}>
                {t('productPriceTooltip')}
              </UncontrolledTooltip>
              <div className="input-group">
                <span className="input-group-addon">€</span>
                <Input state={feedbackPrice} className="form-control" type="number" name="price" onChange={this.handleInputChange} />
              </div>
              <FormFeedback>{priceError}</FormFeedback>
            </FormGroup>
            { /* Unit of measure */ }
            <FormGroup>
              <Label className="col-form-label">{t('productUnitOfMeasure')} <i className="fa fa-info-circle txt-info" id="unitOfMeasureTooltip"></i></Label>
              <UncontrolledTooltip placement="right" target="unitOfMeasureTooltip" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleUnitOfMeasure} toggle={() => { this.toggleTooltip('toggleUnitOfMeasure'); }}>
                {t('productUnitOfMeasureTooltip')}
              </UncontrolledTooltip>
              <select className="form-control" name="unitOfMeasure" onChange={(e) => { this.handleInputChange(e); }}>
                <option value="piece">{t('piece')}</option>
                <option value="kg">{t('kg')}</option>
                <option value="l">{t('l')}</option>
              </select>
            </FormGroup>
            { /* Quantity */ }
            <FormGroup color={feedbackQuantity}>
              <Label className="col-form-label">{t('productQuantity')} <i className="fa fa-info-circle txt-info" id="quantity"></i></Label>
              <UncontrolledTooltip placement="right" target="quantity" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleQuantity} toggle={() => { this.toggleTooltip('toggleQuantity'); }}>
                {t('productQuantityTooltip')}
              </UncontrolledTooltip>
              <Input state={feedbackQuantity} className="form-control" type="number" name="quantity" onChange={this.handleInputChange} />
              <FormFeedback>{quantityError}</FormFeedback>
            </FormGroup>
            { /* Unlimited stock */ }
            <FormGroup>
              <input type="checkbox" onChange={this.toggleUnlimited} checked={this.state.unlimited} /><label className="control-label">{t('unlimitedStock')}</label>
            </FormGroup>
            { /* In stock */ }
            { this.state.unlimited === false && (
              <FormGroup color={feedbackStock}>
                <Label className="col-form-label">{t('productStock')} <i className="fa fa-info-circle txt-info" id="inStock"></i></Label>
                <UncontrolledTooltip placement="right" target="inStock" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleInStock} toggle={() => { this.toggleTooltip('toggleInStock'); }}>
                  {t('productStockTooltip')}
                </UncontrolledTooltip>
                <Input state={feedbackStock} className="form-control" type="number" name="availableInStock" onChange={this.handleInputChange} />
                <FormFeedback>{inStockError}</FormFeedback>
              </FormGroup>
            ) }
          </div>
      </section>
      <section className="row p-1">
          <button className="btn btn-default" onClick={this.next}>Next</button>
      </section>
    </div>);
  }

  componentWillMount() { // Execute before the render.
    var self = this;
    AddProductStore.addChangeListener(function() {
      var shop = AddProductStore.getShop();
      self.setState({
        productCategories: shop.product_categories
      });
    });
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(DescriptionTab));
