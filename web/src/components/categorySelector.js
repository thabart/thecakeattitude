import React, {Component} from "react";
import {CategoryService} from '../services/index';
import TagsInput from "react-tagsinput";
import $ from 'jquery';

class CategorySelector extends Component {
  constructor(props) {
    super(props);
    this._selectedCategory = null;
    this.selectCategory = this.selectCategory.bind(this);
    this.selectSubCategory = this.selectSubCategory.bind(this);
    this.displaySubCategory = this.displaySubCategory.bind(this);
    this.state = {
      isSubCategoryLoading: false,
      isCategoryLoading: false,
      categories: [],
      subCategories: []
    };
  }
  selectCategory(e) {
    this.displaySubCategory(e.target.value);
  }
  selectSubCategory(e) {
    var obj = {
      id: e.target.value,
      name: $(e.target).find(':selected').html()
    };
    this._selectedCategory = obj;
    if (this.props.onSubCategory) this.props.onSubCategory(obj.id);
  }
  getCategory() {
    return this._selectedCategory;
  }
  displaySubCategory(categoryId) {
      var self = this;
      if (!categoryId || categoryId === null) {
        self._selectedCategory = null;
        self.setState({
            subCategories: []
        });
        if (self.props.onSubCategory) self.props.onSubCategory(null);
        return;
      }

      self.setState({
          isSubCategoryLoading: true,
          subCategories: []
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
          self._selectedCategory = subCategories[0];
          if (self.props.onSubCategory) self.props.onSubCategory(self._selectedCategory.id);
      }).catch(function () {
          self.setState({
              isSubCategoryLoading: false
          });
      });
  }
  render() {
    var self = this,
        categories = [(<option></option>)],
        subCategories = [];
    if (this.state.categories) {
      this.state.categories.forEach(function (category) {
        categories.push(<option value={category.id}>{category.name}</option>);
      });
    }

    if (this.state.subCategories) {
      this.state.subCategories.forEach(function (category, index) {
        subCategories.push(<option value={category.id} selected={index === 0}>{category.name}</option>);
      });
    }

    return (
        <div className="row col-md-12">
          <div className='col-md-6'>
              <div className='form-group'>
                  <label className='control-label'>Categories</label>
                  <div className={this.state.isCategoryLoading ? 'loading' : 'hidden'}><i className='fa fa-spinner fa-spin'></i></div>
                  <select className={this.state.isCategoryLoading ? 'hidden' : 'form-control'}
                          onChange={this.selectCategory}>
                      {categories}
                  </select>
              </div>
          </div>
          <div className='col-md-6'>
              <div className='form-group'>
                  <label className='control-label'>Sub categories</label>
                  <div className={this.state.isSubCategoryLoading ? 'loading' : 'hidden'}><i className='fa fa-spinner fa-spin'></i></div>
                  <select className={this.state.isSubCategoryLoading ? 'hidden' : 'form-control'} onChange={(e) => { self.selectSubCategory(e); }}>
                      {subCategories}
                  </select>
              </div>
          </div>
        </div>
    );
    return (<div></div>);
  }
  componentWillMount() {
    var self = this;
    self.setState({
        isCategoryLoading: true,
        isSubCategoryLoading: true
    });
    CategoryService.getParents().then(function (result) {
        var categories = result['_embedded'];
        var result = [];
        categories.forEach(function (category) {
            result.push({id: category.id, name: category.name});
        });
        self.setState({
            isCategoryLoading: false,
            isSubCategoryLoading: false,
            categories: result
        });
    }).catch(function () {
        self.setState({
            isCategoryLoading: false,
            isSubCategoryLoading: false
        });
    });
  }
}

export default CategorySelector;
