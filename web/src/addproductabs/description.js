import React, {Component} from "react";
import {Tooltip} from 'reactstrap';
import {withRouter} from "react-router";
import {ShopsService} from '../services/index';
import {TagsSelector} from '../components';
import './description.css';

class DescriptionTab extends Component {
  constructor(props) {
    super(props);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.next = this.next.bind(this);
    this.uploadProductImage = this.uploadProductImage.bind(this);
    this.toggleUnlimited = this.toggleUnlimited.bind(this);
    this.state = {
      name: null,
      description: null,
      images: [],
      price: null,
      unitOfMeasure: "piece",
      quantity: 0,
      unlimited: true,
      availableInStock: 0,
      productCategories: [],
      isLoadingProductCategories: false,
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
  handleInputChange(e) {
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }
  toggleTooltip(name) {
      var tooltip = this.state.tooltip;
      tooltip[name] = !tooltip[name];
      this.setState({
          tooltip: tooltip
      });
  }
  next() {
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
      images : self.state.images,
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
  buildErrorTooltip(validName, description) {
      var result;
      if (this.state.valid[validName]) {
          result = (<span><i className="fa fa-exclamation-triangle validation-error" id={validName}></i>
    <Tooltip placement="right" target={validName} isOpen={this.state.tooltip[validName]} toggle={() => {
        this.toggleTooltip(validName);
    }}>
      {description}
    </Tooltip></span>);
      }

      return result;
  }
  uploadProductImage(e) {
    e.preventDefault();
    var self = this;
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
      var images = self.state.images;
      images.push(reader.result);
      self.setState({
        images: images
      });
    };
    reader.readAsDataURL(file);
  }
  toggleUnlimited() {
    var unlimited = this.state.unlimited;
    this.setState({
      unlimited: !unlimited
    });
  }
  render() {
    var nameError = this.buildErrorTooltip('isNameInvalid', 'Should contains 1 to 15 characters'),
      descriptionError = this.buildErrorTooltip('isDescriptionInvalid', 'Should contains 1 to 255 characters'),
      priceError = this.buildErrorTooltip('isPriceInvalid', 'the price must be more than 0'),
      quantityError = this.buildErrorTooltip('isQuantityInvalid', 'the quantity must be more than 0'),
      inStockError = this.buildErrorTooltip('isInStockInvalid', 'the stock must be more or equal to 0'),
      images = [],
      productCategories = [(<option></option>)],
      self = this;
    if (this.state.images && this.state.images.length > 0) {
      this.state.images.forEach(function(image) {
        images.push((<div className="col-md-2 product-image-container">
            <div className="close" onClick={() => {
              var imgs = self.state.images;
              var index = imgs.indexOf(image);
              if (index === -1) {
                return;
              }

              imgs.splice(index, 1);
              self.setState({
                images: imgs
              });
            }}><i className="fa fa-times"></i></div>
            <img src={image} width="50" height="50" />
        </div>));
      });
    }

    if (this.state.productCategories && this.state.productCategories.length > 0) {
      this.state.productCategories.forEach(function(productCategory) {
        productCategories.push((<option value={productCategory.id}>{productCategory.name}</option>));
      });
    }

    return (<div>
        <section className="row section">
          <div className="col-md-6 row">
            <div className="form-group col-md-12">
              <label className='control-label'>Name</label> <i className="fa fa-exclamation-circle" id="nameTooltip"></i>
              <Tooltip placement="right" target="nameTooltip" isOpen={this.state.tooltip.toggleName} toggle={() => { this.toggleTooltip('toggleName'); }}>
                Product name
              </Tooltip>
               {nameError}
              <input type='text' className='form-control' name='name' onChange={this.handleInputChange}/>
            </div>
            <div className="form-group col-md-12">
              <label className="control-label">Description</label> <i className="fa fa-exclamation-circle" id="descriptionToolTip"></i>
              <Tooltip placement="right" target="descriptionToolTip" isOpen={this.state.tooltip.toggleDescription} toggle={() => { this.toggleTooltip('toggleDescription'); }}>
                Describe the product in some words
              </Tooltip>
               {descriptionError}
              <textarea className='form-control' name='description' onChange={this.handleInputChange}></textarea>
            </div>
            <div className="form-group col-md-12">
              <label className="control-label">Product category</label> <i className="fa fa-exclamation-circle" id="productCategory"></i>
              <Tooltip placement="right" target="productCategory" isOpen={this.state.tooltip.toggleProductCategory} toggle={() => { this.toggleTooltip('toggleProductCategory'); }}>
                Choose a category
              </Tooltip>
              {this.state.isLoadingProductCategories && (<i className='fa fa-spinner fa-spin'></i>) }
              {!this.state.isLoadingProductCategories && (<select name="productCategory" onChange={this.handleInputChange} className="form-control">{productCategories}</select>) }
            </div>
            <div className="form-group col-md-12">
              <label className="control-label">Tags</label> <i className="fa fa-exclamation-circle" id="productTags"></i>
              <Tooltip placement="right" target="productTags" isOpen={this.state.tooltip.toggleProductTags} toggle={() => { this.toggleTooltip('toggleProductTags'); }}>
                Assign one or more tags
              </Tooltip>
              <TagsSelector ref="productTags"/>
            </div>
            <div className="form-group col-md-12">
              <label className="control-label">Images</label> <i className="fa fa-exclamation-circle" id="imagesTooltip"></i>
              <Tooltip placement="right" target="imagesTooltip" isOpen={this.state.tooltip.toggleImages} toggle={() => { this.toggleTooltip('toggleImages'); }}>
                Images
              </Tooltip>
              <div><input type='file' accept='image/*' onChange={(e) => this.uploadProductImage(e)}/></div>
              <div className="row">
                {images}
              </div>
            </div>
          </div>
          <div className="col-md-6 row">
            <div className="form-group col-md-12">
              <label className="control-label">Price</label> <i className="fa fa-exclamation-circle" id="priceTooltip"></i>
              <Tooltip placement="right" target="priceTooltip" isOpen={this.state.tooltip.togglePrice} toggle={() => { this.toggleTooltip('togglePrice'); }}>
                Price per portion
              </Tooltip>
               {priceError}
              <div className="input-group">
                <span className="input-group-addon">€</span>
                <input className="form-control" type="number" name="price" onChange={this.handleInputChange} />
              </div>
            </div>
            <div className="form-group col-md-12">
              <label className="control-label">Unit of measure</label> <i className="fa fa-exclamation-circle" id="unitOfMeasureTooltip"></i>
              <Tooltip placement="right" target="unitOfMeasureTooltip" isOpen={this.state.tooltip.toggleUnitOfMeasure} toggle={() => { this.toggleTooltip('toggleUnitOfMeasure'); }}>
                Unit of measure
              </Tooltip>
              <select className="form-control" name="unitOfMeasure" onChange={(e) => { this.handleInputChange(e); }}>
                <option value="piece">Piece</option>
                <option value="kg">KG</option>
                <option value="l">L</option>
              </select>
            </div>
            <div className="form-group col-md-12">
              <label className="control-label">Quantity</label> <i className="fa fa-exclamation-circle" id="quantity"></i>
              <Tooltip placement="right" target="quantity" isOpen={this.state.tooltip.toggleQuantity} toggle={() => { this.toggleTooltip('toggleQuantity'); }}>
                Quantity in the portion
              </Tooltip>
               {quantityError}
              <input className="form-control" type="number" name="quantity" onChange={this.handleInputChange} />
            </div>
            <div className="form-roup col-md-12">
              <input type="checkbox" onChange={this.toggleUnlimited} checked={this.state.unlimited} /><label className="control-label">Unlimited stock</label>
            </div>
            { this.state.unlimited === false && (
            <div className="form-group col-md-12">
              <label className="control-label">Available in your stocks</label> <i className="fa fa-exclamation-circle" id="inStock"></i>
              <Tooltip placement="right" target="inStock" isOpen={this.state.tooltip.toggleInStock} toggle={() => { this.toggleTooltip('toggleInStock'); }}>
                Number of portions available in your stocks
              </Tooltip>
               {inStockError}
              <input className="form-control" type="number" name="availableInStock" onChange={this.handleInputChange} />
            </div> )}
          </div>
      </section>
      <section className="col-md-12 sub-section">
          <button className="btn btn-primary next" onClick={this.next}>Next</button>
      </section>
    </div>);
  }
  componentWillMount() {
    var self = this;
    self.setState({
      isLoadingProductCategories: true
    });
    ShopsService.get(this.props.match.params.id).then(function(s) {
      var productCategories = s['_embedded'].product_categories;
      self.setState({
        isLoadingProductCategories: false,
        productCategories: productCategories
      });
    }).catch(function() {
      self.setState({
        isLoadingProductCategories: false
      });
    });
  }
}

export default withRouter(DescriptionTab);
