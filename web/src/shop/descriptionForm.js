import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import CategoryService from '../services/Category';
import Game from '../game/game';
import Constants from '../../Constants';
import $ from 'jquery';

class DescriptionForm extends Component {
  constructor(props) {
    super(props);
    this.uploadBannerImage = this.uploadBannerImage.bind(this);
    this.uploadPictureImage = this.uploadPictureImage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.validate = this.validate.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.selectSubCategory = this.selectSubCategory.bind(this);
    this.onHouseSelected = this.onHouseSelected.bind(this);
    this.state = {
      name: null,
      description: null,
      place: null,
      bannerImage: null,
      pictureImage: null,
      isCategoryLoading: false,
      isSubCategoryLoading: false,
      categories: [],
      subCategories: [],
      tooltip: {
        toggleName : false,
        toggleDescription: false,
        toggleChoosePlace: false,
        toggleErrorName: false,
        toggleErrorDescription : false,
        toggleErrorPlace: false
      },
      valid: {
        isNameInvalid : false,
        isDescriptionInvalid: false,
        isPlaceInvalid: false
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

    // Check at least one place is selected.
    if (!self.state.place || self.state.place === null) {
      valid.isPlaceInvalid = true;
      isValid = false;
    } else {
      valid.isPlaceInvalid = false;
      
    }

    this.setState({
      valid: valid
    });

    if (isValid) {
      this.props.onNext();
    }
  }
  selectCategory(e) {
    this.displaySubCategory(e.target.value);
  }
  selectSubCategory(e) {
    this.displayMap(e.target.value);
  }
  displayMap(categoryId) {
    var self = this;
    $.get(Constants.apiUrl + categoryId).then(function(r) {
      self.refs.game.loadMap(r['_embedded'])
    });
  }
  displaySubCategory(categoryId) {
    var self = this;
    self.setState({
      isSubCategoryLoading: true
    });
    CategoryService.get(categoryId).then(function(r) {
      var links = r['_links']['items'];
      var subCategories = [];
      links.forEach(function(link) {
        subCategories.push({ id: link.href, name: link.name });
      });
      self.setState({
        subCategories: subCategories,
        isSubCategoryLoading: false
      });
      self.displayMap(subCategories[0].id);
    }).catch(function() {
      self.setState({
        isSubCategoryLoading: false
      });
    });
  }
  onHouseSelected(place) {
    this.setState({
      place: place
    });
  }
  buildErrorTooltip(validName, description) {
    var result;
    if (this.state.valid[validName]) {
      result = (<span><i className="fa fa-exclamation-triangle validation-error" id={validName}></i>
      <Tooltip placement="right" target={validName} isOpen={this.state.tooltip[validName]} toggle={() => { this.toggleTooltip(validName); }}>
        {description}
      </Tooltip></span>);
    }

    return result;
  }
  render() {
    var bannerImagePreview,
      pictureImagePreview,
      nameError = this.buildErrorTooltip('isNameInvalid', 'Should contains 1 to 15 characters'),
      descriptionError = this.buildErrorTooltip('isDescriptionInvalid', 'Should contains 1 to 255 characters'),
      placeError = this.buildErrorTooltip('isPlaceInvalid', 'A place should be selected'),
      categories = [],
      subCategories = [];
    if (this.state.bannerImage) {
      bannerImagePreview = (<div className='image-container'><img src={this.state.bannerImage} width='50' height='50' /></div>);
    }

    if (this.state.pictureImage) {
      pictureImagePreview = (<div className='image-container'><img src={this.state.pictureImage} width='100' height='100' /></div>);
    }

    this.state.categories.forEach(function(category) {
      categories.push(<option value={category.id}>{category.name}</option>);
    });

    this.state.subCategories.forEach(function(category) {
      subCategories.push(<option value={category.id}>{category.name}</option>);
    });
    return(
      <div>
        <section className="row section">
          <div className="col-md-6">
            <div className='form-group col-md-12'>
              <label className='control-label'>Name</label> <i className="fa fa-exclamation-circle" id="nameToolTip"></i>
              <Tooltip placement="right" target="nameToolTip" isOpen={this.state.tooltip.toggleName} toggle={() => { this.toggleTooltip('toggleName'); }}>
                Name displayed in the shop's profile
              </Tooltip>
               {nameError}
              <input type='text' className='form-control' name='name' onChange={this.handleInputChange} />
            </div>
            <div className='form-group col-md-12'>
              <label className='control-label'>Description</label> <i className="fa fa-exclamation-circle" id="descriptionToolTip"></i>
              <Tooltip placement="right" target="descriptionToolTip" isOpen={this.state.tooltip.toggleDescription} toggle={() => { this.toggleTooltip('toggleDescription'); }}>
                Description displayed in the shop's profile
              </Tooltip>
               {descriptionError}
              <textarea className='form-control' name='description' onChange={this.handleInputChange}></textarea>
            </div>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label className='control-label'>Categories</label>
                  <div className={this.state.isCategoryLoading ? 'loading' : 'hidden'}><i className='fa fa-spinner fa-spin'></i></div>
                  <select className={this.state.isCategoryLoading ? 'hidden' : 'form-control'} onChange={this.selectCategory}>
                    {categories}
                  </select>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label className='control-label'>Sub categories</label>
                  <div className={this.state.isSubCategoryLoading ? 'loading' : 'hidden'}><i className='fa fa-spinner fa-spin'></i></div>
                  <select className={this.state.isSubCategoryLoading ? 'hidden' : 'form-control'} onChange={this.selectSubCategory}>
                    {subCategories}
                  </select>
                </div>
              </div>
            </div>
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
          </div>
          <div className="col-md-6">
            <label className="control-label">Choose a place</label> <i className="fa fa-exclamation-circle" id="choosePlaceToolTip"></i>
            <Tooltip placement="right" target="choosePlaceToolTip" isOpen={this.state.tooltip.toggleChoosePlace} toggle={() => { this.toggleTooltip('toggleChoosePlace'); }}>
              Placement in the game
            </Tooltip>
             {placeError}
            <Game ref="game" onHouseSelected={this.onHouseSelected}/>
          </div>
        </section>
        <section className="col-md-12 sub-section">
          <button className="btn btn-primary next" onClick={this.validate}>Next</button>
        </section>
      </div>
    );
  }
  componentDidMount() {
    var self = this;
    self.setState({
      isCategoryLoading: true,
      isSubCategoryLoading: true
    })
    CategoryService.getParents().then(function(result) {
      var categories = result['_embedded'];
      var result = [];
      categories.forEach(function(category) {
        result.push({ id : category.id, name: category.name });
      });
      self.setState({
        isCategoryLoading: false,
        isSubCategoryLoading: false,
        categories : result
      });
      self.displaySubCategory(result[0].id);
    }).catch(function() {
      self.setState({
        isCategoryLoading: false,
        isSubCategoryLoading: false
      });
    });
  }
}

export default DescriptionForm;
