import React, {Component} from "react";
import {Modal, ModalHeader, ModalBody, Alert} from "reactstrap";
import {CategoryService} from './services/index';
import './FilterModal.css';

function getFilter() {
  let ls = {
    include_shops : true,
    include_announces : true,
    categories : []
  };
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('gameinshop_filter')) || {
        include_shops : true,
        include_announces : true,
        categories : []
      };
    } catch (e) {/*Ignore*/
    }
  }

  return ls;
}

function saveFilter(value) {
    if (global.localStorage) {
        global.localStorage.setItem('gameinshop_filter', JSON.stringify(value));
    }
}

class FilterModal extends Component {
  constructor(props) {
    super(props);
    this.selectCategory = this.selectCategory.bind(this);
    this.close = this.close.bind(this);
    this.closeError = this.closeError.bind(this);
    this.addCategories = this.addCategories.bind(this);
    this.removeCategories = this.removeCategories.bind(this);
    this.confirm = this.confirm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      includeShops: true,
      includeAnnounces: true,
      isOpened : false,
      isCategoriesLoading: false,
      errorMessage: null,
      categories: [],
      categoriesToAdd: [],
      categoriesToRemove: [],
      categoriesInFilter: []
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
  selectCategory(e, category, isActive, toAdd) {
    var cats = this.state.categoriesToAdd;
    if (!toAdd) {
      cats = this.state.categoriesToRemove;
    }

    if (isActive) {
      var index = cats.indexOf(category);
      if (index === -1) {
        return;
      }

      cats.splice(index, 1);
    }
    else {
      cats.push(category);
    }

    if (toAdd) {
      this.setState({
        categoriesToAdd: cats
      });
      return;
    }

    this.setState({
      categoriesToRemove: cats
    });
  }
  addCategories() {
    var categoriesInFilter = this.state.categoriesInFilter;
    var categoriesToAdd = this.state.categoriesToAdd;
    var categories = this.state.categories;
    categoriesToAdd.forEach(function(categoryToAdd) {
      categories.forEach(function(cat) {
        var index = cat.children.indexOf(categoryToAdd);
        if (index === -1) {
          return;
        }

        cat.children.splice(index, 1);
      });
    });

    this.setState({
      categoriesInFilter: categoriesToAdd.concat(categoriesInFilter),
      categories: categories,
      categoriesToAdd: []
    });
  }
  removeCategories() {
    var categories = this.state.categories;
    var categoriesToRemove = this.state.categoriesToRemove;
    var categoriesInFilter = this.state.categoriesInFilter;
    categoriesToRemove.forEach(function(categoryToRemove) {
      categories.forEach(function(parent) {
        if (categoryToRemove.parent_id !== parent.id) {
          return;
        }

        parent.children.push(categoryToRemove);
      });

      var index = categoriesInFilter.indexOf(categoryToRemove);
      if (index === -1) {
        return;
      }

      categoriesInFilter.splice(index, 1);
    });

    this.setState({
      categoriesInFilter: categoriesInFilter,
      categories: categories,
      categoriesToRemove: []
    });
  }
  show() {
    var self = this;
    self.setState({
      isOpened: true,
      isCategoriesLoading: true,
      categoriesInFilter: [],
      categoriesToAdd: [],
      categoriesToRemove: [],
      categories: [],
      errorMessage: null
    });
    var filter = getFilter();
    CategoryService.getParents().then(function(result) {
      var categories = result['_embedded'];
      var categoriesInFilter = [];
      var includeShops = true;
      var includeAnnounces = true;
      if (filter && filter !== null) {
        includeShops = filter.include_shops;
        includeAnnounces = filter.include_announces;
        categoriesInFilter = filter.categories;
        categoriesInFilter.forEach(function(categoryInFilter) {
          categories.forEach(function(category) {
            var index = -1;
            category.children.forEach(function(child, i) {
              if (child.id === categoryInFilter.id) {
                index = i;
              }
            });

            if (index === -1) {
              return;
            }

            category.children.splice(index);
          });
        });
      }

      self.setState({
        isCategoriesLoading: false,
        categories : categories,
        categoriesInFilter: categoriesInFilter,
        includeShops : includeShops,
        includeAnnounces: includeAnnounces
      });
    }).catch(function(e) {
      self.setState({
        isCategoriesLoading: false,
        errorMessage: 'An error occured while trying to retrieve the categories'
      });
    });
  }
  close() {
    this.setState({
      isOpened: false
    });
  }
  closeError() {
    this.setState({
      errorMessage: null
    });
  }
  confirm() {
    var result = {
      include_shops : this.state.includeShops,
      include_announces : this.state.includeAnnounces,
      categories : this.state.categoriesInFilter
    };

    saveFilter(result);
    this.props.filter(result);
  }
  render() {
    var categories = [],
      categoriesInFilter = [],
      self = this;
    if (this.state.categories && this.state.categories.length > 0) {
      this.state.categories.forEach(function(category) {
        var children = [];
        if (category.children && category.children.length > 0) {
          category.children.forEach(function(child) {
            var isActive = false;
            if (self.state.categoriesToAdd && self.state.categoriesToAdd.includes(child)) {
              isActive = true;
            }
            children.push((<li onClick={(e) => { self.selectCategory(e, child, isActive, true);}} className={isActive && "active"}>{child.name}</li>))
          });
        }

        categories.push(<div><h6>{category.name}</h6><ul>{children}</ul></div>)
      });
    }

    if (this.state.categoriesInFilter && this.state.categoriesInFilter.length > 0) {
      this.state.categoriesInFilter.forEach(function(category) {
        var isActive = false;
        if (self.state.categoriesToRemove && self.state.categoriesToRemove.includes(category)) {
          isActive = true;
        }

        categoriesInFilter.push((<li onClick={(e) => { self.selectCategory(e, category, isActive, false);}}  className={isActive && "active"}>{category.name}</li>))
      });
    }

    return ( <Modal isOpen={this.state.isOpened} size="lg">
        <ModalHeader toggle={() => {
            this.close();
        }}>Filter</ModalHeader>
        <ModalBody>
            <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert>
            <div className="form-group">
                <input type="checkbox" name="includeAnnounces" onChange={this.handleInputChange} checked={this.state.includeAnnounces} /><label>Include the announces</label>
            </div>
            <div className="form-group">
                <input type="checkbox" name="includeShops" onChange={this.handleInputChange} checked={this.state.includeShops} /><label>Include the shops</label>
            </div>
            {this.state.isCategoriesLoading ? (<div><i className='fa fa-spinner fa-spin'></i></div>) : (
              <div className="form-group categories-selector">
                  <label>Select certain categories</label>
                  <div className="row">
                      <div className="col-md-5 selector">
                        {categories}
                      </div>
                      <div className="col-md-2 buttons">
                          {this.state.categoriesToAdd && this.state.categoriesToAdd.length > 0 && (
                            <div><button className="btn btn-outline-secondary btn-sm" onClick={(e) => { this.addCategories();}}><i className="fa fa-plus"></i></button></div>
                          )}
                          {this.state.categoriesToRemove && this.state.categoriesToRemove.length > 0 && (
                            <button className="btn btn-outline-secondary btn-sm" onClick={(e) => { this.removeCategories();}}><i className="fa fa-minus-circle"></i></button>
                          )}
                      </div>
                      <div className="col-md-5 selector">
                          <ul>
                              {categoriesInFilter}
                          </ul>
                      </div>
                  </div>
              </div>
            )}
            <div className="form-group">
                <button className="btn btn-success" onClick={(e) => {this.confirm(); }}>Confirm</button>
            </div>
        </ModalBody>
    </Modal> );
  }
  componentDidMount() {
    this.props.onFilterLoad(getFilter());
  }
}


export default FilterModal;
