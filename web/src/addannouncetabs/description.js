import React, {Component} from "react";
import {TabContent, TabPane, Alert, Tooltip} from "reactstrap";
import {CategoryService} from "../services/index";

class DescriptionAnnouncement extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validate = this.validate.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.selectSubCategory = this.selectSubCategory.bind(this);
    this.state = {
      name: null,
      description: null,
      price: null,
      subCategoryIdSelected: null,
      isCategoryLoading: false,
      isSubCategoryLoading: false,
      tooltip: {
        toggleName: false,
        toggleDescription: false,
        togglePrice: false
      },
      categories: [],
      subCategories: [],
      valid: {
        isNameInvalid: false,
        isDescriptionInvalid: false,
        isPriceInvalid: false
      }
    };
  }
  handleInputChange(e) {
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }
  selectCategory(e) {
    this.displaySubCategory(e.target.value);
  }
  selectSubCategory(e) {
    this.setState({
      subCategoryIdSelected: e.target.value
    })
  }
  displaySubCategory(categoryId) {
      var self = this;
      if (!categoryId || categoryId === null || categoryId === '') {
        var subCategories = [{id: null, name: null}];
        self.setState({
            subCategories: subCategories
        });
        return;
      }

      self.setState({
          isSubCategoryLoading: true
      });
      CategoryService.get(categoryId).then(function (r) {
          var children = r['_embedded']['children'];
          var subCategories = [];
          children.forEach(function (child) {
              subCategories.push({id: child.id, name: child.name});
          });
          self.setState({
              subCategories: subCategories,
              isSubCategoryLoading: false
          });
      }).catch(function () {
          self.setState({
              isSubCategoryLoading: false
          });
      });
  }
  toggleTooltip(name) {
      var tooltip = this.state.tooltip;
      tooltip[name] = !tooltip[name];
      this.setState({
          tooltip: tooltip
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

    // Check priceTooltip
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
      category_id: this.state.subCategoryIdSelected,
      price: this.state.price
    };
    this.props.onNext(json);
  }
  render() {
    var categories = [],
      subCategories = [],
      nameError = this.buildErrorTooltip('isNameInvalid', 'Should contains 1 to 15 characters'),
      descriptionError = this.buildErrorTooltip('isDescriptionInvalid', 'Should contains 1 to 255 characters'),
      priceError = this.buildErrorTooltip('isPriceInvalid', 'the price should be a number > 0');

    if (this.state.categories) {
      this.state.categories.forEach(function (category) {
        categories.push(<option value={category.id}>{category.name}</option>);
      });
    }

    if (this.state.subCategories) {
      this.state.subCategories.forEach(function (category) {
        subCategories.push(<option value={category.id}>{category.name}</option>);
      });
    }

    return (
    <div>
      <section className="row">
        <div className="form-group col-md-12">
          <label className='control-label'>Name</label> <i className="fa fa-exclamation-circle" id="nameTooltip"></i>
          <Tooltip placement="right" target="nameTooltip" isOpen={this.state.tooltip.toggleName} toggle={() => { this.toggleTooltip('toggleName'); }}>
            Displayed name
          </Tooltip>
           {nameError}
          <input type='text' className='form-control' name='name' onChange={this.handleInputChange}/>
        </div>
        <div className="form-group col-md-12">
          <label className='control-label'>Description</label> <i className="fa fa-exclamation-circle" id="descriptionTooltip"></i>
          <Tooltip placement="right" target="descriptionTooltip" isOpen={this.state.tooltip.toggleDescription} toggle={() => { this.toggleTooltip('toggleDescription'); }}>
            Description of your announce
          </Tooltip>
           {descriptionError}
          <textarea className='form-control' name='description' onChange={this.handleInputChange}></textarea>
        </div>
        <div className="form-group col-md-12 row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="control-label">Categories</label>
              <div className={this.state.isCategoryLoading ? 'loading' : 'hidden'}><i className='fa fa-spinner fa-spin'></i></div>
              <select className={this.state.isCategoryLoading ? 'hidden' : 'form-control'} onChange={this.selectCategory}>
                {categories}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="control-label">Sub categories</label>
              <div className={this.state.isSubCategoryLoading ? 'loading' : 'hidden'}><i className='fa fa-spinner fa-spin'></i></div>
              <select className={this.state.isSubCategoryLoading ? 'hidden' : 'form-control'} onChange={this.selectSubCategory}>
                {subCategories}
              </select>
            </div>
          </div>
        </div>
        <div className="form-group col-md-12">
          <label className="control-label">Price</label> <i className="fa fa-exclamation-circle" id="priceTooltip"></i>
          <Tooltip placement="right" target="priceTooltip" isOpen={this.state.tooltip.togglePrice} toggle={() => { this.toggleTooltip('togglePrice'); }}>
            Your price estimation
          </Tooltip>
           {priceError}
          <div className="input-group">
            <span className="input-group-addon">€</span>
            <input type="number" className="form-control" name="price" onChange={this.handleInputChange} />
          </div>
        </div>
      </section>
      <section className="col-md-12 sub-section">
          <button className="btn btn-primary next" onClick={this.validate}>Next</button>
      </section>
    </div>);
  }
  componentDidMount() {
      var self = this;
      self.setState({
          isCategoryLoading: true,
          isSubCategoryLoading: true
      });
    CategoryService.getParents().then(function (result) {
        var categories = result['_embedded'];
        var result = [{id: null, name: null}];
        categories.forEach(function (category) {
            result.push({id: category.id, name: category.name});
        });
        self.setState({
            isCategoryLoading: false,
            isSubCategoryLoading: false,
            categories: result
        });
        self.displaySubCategory(result[0].id);
    }).catch(function () {
        self.setState({
            isCategoryLoading: false,
            isSubCategoryLoading: false
        });
    });
  }
}

export default DescriptionAnnouncement;
