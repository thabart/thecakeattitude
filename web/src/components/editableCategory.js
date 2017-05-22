import React, {Component} from "react";
import './editable.css';
import {CategoryService} from '../services/index';
import TagsInput from "react-tagsinput";

class EditableCategory extends Component {
  constructor(props) {
    super(props);
    this.onClickField = this.onClickField.bind(this);
    this.validate = this.validate.bind(this);
    this.closeEditMode = this.closeEditMode.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.state = {
      isEditMode: false,
      value: props.value,
      oldValue: props.value,
      isSubCategoryLoading: false,
      isCategoryLoading: false,
      categories: [],
      subCategories: []
    };
  }
  selectCategory(e) {
      this.displaySubCategory(e.target.value);
  }
  displaySubCategory(categoryId) {
      var self = this;
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
  handleInputChange(e) {
    const value = e.target.value;
    this.setState({
      oldValue: value
    });
  }
  closeEditMode() {
    this.setState({
      isEditMode: false
    });
  }
  onClickField() {
    this.setState({
      isEditMode: true
    });
  }
  validate() {
    var oldValue = this.state.oldValue;
    this.setState({
      value: oldValue,
      isEditMode: false
    });
  }
  render() {
    var self = this;
      categories = [],
      subCategories = [];
    if (!this.state.isEditMode) {
      return (<div onClick={(e) => { this.onClickField(); }} className="editable-input">
        <span className={this.props.className}>{this.state.value}</span>
      </div>);
    }

    var self = this;
        categories = [],
        subCategories = [];
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
        <div className="row col-md-12">
          <div className='col-md-6'>
              <div className='form-group'>
                  <label className='control-label'>Categories</label>
                  <div className={this.state.isCategoryLoading ? 'loading' : 'hidden'}><i
                      className='fa fa-spinner fa-spin'></i></div>
                  <select className={this.state.isCategoryLoading ? 'hidden' : 'form-control'}
                          onChange={this.selectCategory}>
                      {categories}
                  </select>
              </div>
          </div>
          <div className='col-md-6'>
              <div className='form-group'>
                  <label className='control-label'>Sub categories</label>
                  <div className={this.state.isSubCategoryLoading ? 'loading' : 'hidden'}><i
                      className='fa fa-spinner fa-spin'></i></div>
                  <select className={this.state.isSubCategoryLoading ? 'hidden' : 'form-control'}
                          onChange={this.selectSubCategory}>
                      {subCategories}
                  </select>
              </div>
          </div>
        </div>
    );
  }
  componentWillMount() {
  }
}

export default EditableCategory;
