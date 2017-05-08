import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import { CategoryService, TagService, ShopsService, OpenIdService, SessionService } from '../services';
import TagsInput from 'react-tagsinput';
import Game from '../game/game';
import Constants from '../../Constants';
import './descriptionForm.css';
import 'react-tagsinput/react-tagsinput.css';
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
    this.selectMap = this.selectMap.bind(this);
    this.onHouseSelected = this.onHouseSelected.bind(this);
    this.handleTags = this.handleTags.bind(this);
    this.changeMap = this.changeMap.bind(this);
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
      maps: [],
      tags: [],
      subCategoryIdSelected: null,
      mapNameSelected: null,
      tooltip: {
        toggleName : false,
        toggleDescription: false,
        toggleChoosePlace: false,
        toggleErrorName: false,
        toggleErrorDescription : false,
        toggleErrorPlace: false,
        toggleProfileImage: false,
        toggleBannerImage: false
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

    if (!isValid) {
      return;
    }

    // Check that no shop has been added to the selected category.
    self.props.onLoading(true);
    OpenIdService.getUserInfo(SessionService.getSession().access_token).then(function(userInfo) {
        ShopsService.search({
          category_id: self.state.subCategoryIdSelected,
          subject: userInfo.sub
        }).then(function() {
          self.props.onLoading(false);
          self.props.onError('you already have a shop on this category');
        }).catch(function(e) {
          var json = {
            name : self.state.name,
            description: self.state.description,
            tags: self.state.tags,
            banner_image: self.state.bannerImage,
            profile_image: self.state.pictureImage,
            map_name: self.state.mapNameSelected,
            category_id: self.state.subCategoryIdSelected,
            place: self.state.place
          };

          self.props.onLoading(false);
          self.props.onNext(json);
        });
    }).catch(function() {
        self.props.onLoading(false);
        self.props.onError('the subject cannot be retrieved');
    });
  }
  selectCategory(e) {
    this.displaySubCategory(e.target.value);
  }
  selectSubCategory(e) {
    this.displayMaps(e.target.value);
  }
  selectMap(e) {
    var target = $(e.target).find(':selected');
    var map = {
      map_link: $(target).data('maplink'),
      overview_name: $(target).data('overviewname'),
      overview_link: $(target).data('overviewlink'),
      map_name: $(target).data('mapname')
    };
    this.displayMap(map);
  }
  displayMap(map) {
    map['category_id'] = this.state.subCategoryIdSelected;
    this.refs.game.loadMap(map);
    this.state.place = null;
    this.setState({
      place: this.state.place,
      mapNameSelected: map.map_name
    });
  }
  changeMap(mapName) {
    this.state.mapNameSelected = mapName;
  }
  displayMaps(categoryId) {
    var self = this;
    CategoryService.get(categoryId).then(function(r) {
      var maps = r['_embedded']['maps'];
      self.setState({
        maps: maps,
        subCategoryIdSelected: categoryId
      });

      if (!maps) {
        return;
      }

      self.displayMap(maps[0]);
    });
  }
  displaySubCategory(categoryId) {
    var self = this;
    self.setState({
      isSubCategoryLoading: true
    });
    CategoryService.get(categoryId).then(function(r) {
      var children = r['_embedded']['children'];
      var subCategories = [];
      children.forEach(function(child) {
        subCategories.push({ id: child.id, name: child.name });
      });
      self.setState({
        subCategories: subCategories,
        isSubCategoryLoading: false
      });
      self.displayMaps(subCategories[0].id);
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
  handleTags(tags) {
    this.setState({
      tags: tags
    });
    this.hidePopup();
  }
  displayLoading() {
    var ul = $(this.popup).find('ul');
    $(ul).empty();
    $(ul).append('<li>Loading ...</li>');
    $(this.popup).show();
  }
  displayTags(tags) {
    var ul = $(this.popup).find('ul');
    var self = this;
    $(ul).empty();
    tags.forEach(function(tag) {
      $(self.popup).find('ul').append('<li>'+tag.name+'</li>');
    });
  }
  hidePopup() {
    var ul = $(this.popup).find('ul');
    $(ul).empty();
    $(this.popup).hide();
  }
  render() {
    var bannerImagePreview,
      pictureImagePreview,
      nameError = this.buildErrorTooltip('isNameInvalid', 'Should contains 1 to 15 characters'),
      descriptionError = this.buildErrorTooltip('isDescriptionInvalid', 'Should contains 1 to 255 characters'),
      placeError = this.buildErrorTooltip('isPlaceInvalid', 'A place should be selected'),
      categories = [],
      subCategories = [],
      maps = [];
    if (this.state.bannerImage) {
      bannerImagePreview = (<div className='image-container'><img src={this.state.bannerImage} width='50' height='50' /></div>);
    }

    if (this.state.pictureImage) {
      pictureImagePreview = (<div className='image-container'><img src={this.state.pictureImage} width='100' height='100' /></div>);
    }

    if (this.state.categories) {
      this.state.categories.forEach(function(category) {
        categories.push(<option value={category.id}>{category.name}</option>);
      });
    }

    if (this.state.subCategories) {
      this.state.subCategories.forEach(function(category) {
        subCategories.push(<option value={category.id}>{category.name}</option>);
      });
    }

    if (this.state.maps) {
      this.state.maps.forEach(function(map) {
        maps.push(<option data-maplink={map.map_link} data-overviewname={map.overview_name} data-overviewlink={map.overview_link} data-mapname={map.map_name}>{map.map_name}</option>);
      });
    }
    return(
      <div>
        <section className="row section">
          <div className="col-md-6">
            <div className='form-group col-md-12'>
              <label className='control-label'>Name</label> <i className="fa fa-exclamation-circle" id="nameToolTip"></i>
              <Tooltip placement="right" target="nameToolTip" isOpen={this.state.tooltip.toggleName} toggle={() => { this.toggleTooltip('toggleName'); }}>
                Name displayed in the shop s profile
              </Tooltip>
               {nameError}
              <input type='text' className='form-control' name='name' onChange={this.handleInputChange} />
            </div>
            <div className='form-group col-md-12'>
              <label className='control-label'>Description</label> <i className="fa fa-exclamation-circle" id="descriptionToolTip"></i>
              <Tooltip placement="right" target="descriptionToolTip" isOpen={this.state.tooltip.toggleDescription} toggle={() => { this.toggleTooltip('toggleDescription'); }}>
                Description displayed in the shop s profile
              </Tooltip>
               {descriptionError}
              <textarea className='form-control' name='description' onChange={this.handleInputChange}></textarea>
            </div>
            <div className="form-group col-md-12">
              <p><i className="fa fa-exclamation-triangle"></i> Add some tags to enrich the description of your shop</p>
              <TagsInput ref="shopTags" value={this.state.tags} onChange={this.handleTags} />
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
              <label className='control-label'>Banner image</label> <i className="fa fa-exclamation-circle" id="bannerImageTooltip"></i>
              <Tooltip placement="right" target="bannerImageTooltip" isOpen={this.state.tooltip.toggleBannerImage} toggle={() => { this.toggleTooltip('toggleBannerImage'); }}>
                Banner image displayed on your profile
              </Tooltip>
              <div><input type='file' accept='image/*' onChange={(e) => this.uploadBannerImage(e)} /></div>
              {bannerImagePreview}
            </div>
            <div className='form-group col-md-12'>
              <label className='control-label'>Profile picture</label> <i className="fa fa-exclamation-circle" id="profileImageTooltip"></i>
              <Tooltip placement="right" target="profileImageTooltip" isOpen={this.state.tooltip.toggleProfileImage} toggle={() => { this.toggleTooltip('toggleProfileImage'); }}>
                Profile s picture
              </Tooltip>
              <div><input type='file' accept='image/*' onChange={(e) => this.uploadPictureImage(e)} /></div>
              {pictureImagePreview}
            </div>
          </div>
          <div className="col-md-6">
            <label className="control-label">Choose a place</label> <i className="fa fa-exclamation-circle" id="choosePlaceToolTip"></i>
            <Tooltip placement="right" target="choosePlaceToolTip" isOpen={this.state.tooltip.toggleChoosePlace} toggle={() => { this.toggleTooltip('toggleChoosePlace'); }}>
              Placement in the game
            </Tooltip>
             {placeError}
            <select className="form-control col-md-5" onChange={this.selectMap}>{maps}</select>
            <Game ref="game" onHouseSelected={this.onHouseSelected} onLoadMap={(mapName) => { this.changeMap(mapName); }}/>
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
    var input = this.refs.shopTags.refs.input;
    var container = this.refs.shopTags.refs.div;
    var paddingLeft = 5,
      paddingTop = 5;
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
    self.popup = $("<div class='popup' style='position: absolute;display: none;'><ul></ul></div>");
    $(document.body).append(self.popup);
    $(input).on('input', function() {
      $(self.popup).width($(container).width() + 5);
      $(self.popup).css('left', $(container).offset().left);
      $(self.popup).css('top', $(container).offset().top + $(container).height());
      if (!this.value || this.value === "") {
        self.hidePopup();
        return;
      }

      self.displayLoading();
      TagService.search({ name: this.value }).then(function(r) {
        var embedded = r['_embedded'];
        if (!embedded) {
          self.hidePopup();
          return;
        }

        if (!(embedded instanceof Array)) {
          embedded = [embedded];
        }

        self.displayTags(embedded);
        self.popup.find('li').click(function() {
          var tags = self.state.tags;
          tags.push($(this).html());
          self.setState({
            tags: tags
          });
          self.hidePopup();
        });
      }).catch(function() {
        self.hidePopup();
      });
    });
  }
}

export default DescriptionForm;
