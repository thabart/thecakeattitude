import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import { Alert } from 'reactstrap';
import { ProductsService } from '../services/index';
import Constants from '../../Constants';
import 'rc-slider/assets/index.css';
import './products.css';
import ProductElt from './productElt';
import $ from 'jquery';
import Promise from 'bluebird';
import AppDispatcher from '../appDispatcher';

const minPrice = 1;
const maxPrice = 30000;
const defaultCount = 3;
const filterJson = { orders : [ { target: 'update_datetime', method: 'desc' } ], start_index : 0, count: defaultCount, min_price: minPrice, max_price: maxPrice, filters: []};

class ShopProducts extends Component {
  constructor(props) {
    super(props);
    this.changePrice = this.changePrice.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.filter = this.filter.bind(this);
    this.toggleProductError = this.toggleProductError.bind(this);
    this.priceChange = this.priceChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.changePage = this.changePage.bind(this);
    this.search = this.search.bind(this);
    this.handleBestDeals = this.handleBestDeals.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.state = {
      minPrice: minPrice,
      maxPrice : maxPrice,
      errorMessage: null,
      isLoading: false,
      products : [],
      filters: [],
      pagination: [],
      isProductsLoading: false,
      productErrorMessage: null,
      productName: null,
      bestDeals: false,
      activeCategory: null
    };
  }
  // Search
  search() {
    filterJson['name'] = this.state.productName;
    this.updateProducts();
  }
  // Filter the products
  filter(e, filterId, filterValue) {
    var filter = null,
      indice = -1,
      self = this;
    if (!$(e.target).is(':checked'))
    {
      filterJson.filters.forEach(function(f, e) {
        if (f.id === filterId) {
          filter = f;
          indice = e;
        }
      });

      if (indice > -1) {
        filterJson.filters.splice(indice, 1);
      }
    }
    else {
      filterJson.filters.push({
        id: filterId,
        value: filterValue
      });
    }

    filterJson['start_index'] = 0;
    this.updateProducts();
  }
  // Update products
  updateProducts() {
    var self = this;
    self.setState({
      isProductsLoading: true
    });
    ProductsService.search(filterJson).then(function(record) {
      var products = record['_embedded'];
      var pagination = record['_links'].navigation;
      if (!(products instanceof Array)) {
        products = [products];
      }

      self.setState({
        isProductsLoading: false,
        products: products,
        pagination: pagination
      });
    }).catch(function() {
      self.setState({
        isProductsLoading: false,
        productErrorMessage: 'an error occured while trying to filter the products'
      });
    });

  }
  // Toggle product error message
  toggleProductError() {
    this.setState({
      productErrorMessage: null
    });
  }
  // Toggle the error
  toggleError() {
    this.setState({
      errorMessage: null
    });
  }
  // Change the Price
  changePrice(p) {
    this.setState({
      minPrice: p[0],
      maxPrice: p[1]
    });
  }
  // Handle input change
  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  // Handle price change
  handlePriceChange(e) {
    const target = e.target;
    const name = target.name;
    if (!target.value || target.value === "") {
      return;
    }
    this.state[name] = target.value;
    this.setState({
      [name]: target.value
    });
    if (name === 'minPrice') {
      this.refs.priceRange.state.bounds[0] = target.value;
    } else {
        this.refs.priceRange.state.bounds[1] = target.value;
    }

    this.priceChange();
  }
  // Handle best deals
  handleBestDeals(e) {
    var isChecked = $(e.target).is(':checked');
    if (isChecked) {
      filterJson['contains_valid_promotions'] = true;
    } else {
      filterJson['contains_valid_promotions'] = '';
    }

    this.updateProducts();
  }
  // Select the category
  selectCategory(e, id) {
    e.preventDefault();
    filterJson['category_id'] = id;
    this.setState({
      activeCategory: id
    });
    this.updateProducts();
  }
  // Execute when the price is changed
  priceChange() {
    filterJson['min_price'] = this.state.minPrice;
    filterJson['max_price'] = this.state.maxPrice;
    filterJson['start_index'] = 0;
    this.updateProducts();
  }
  // Change page
  changePage(e, page) {
    e.preventDefault();
    filterJson['start_index'] = (page - 1) * defaultCount;
    this.updateProducts();
  }
  // Change the order
  changeOrder(e) {
    var selected = $(e.target).find(':selected');
    var obj = {
      target: $(selected).data('target'),
      method: $(selected).data('method')
    };
    filterJson.orders = [obj];
    this.updateProducts();
  }
  // Render the component
  render() {
    if (this.state.isLoading) {
      return (<div>Loading ...</div>);
    }

    if (this.state.errorMessage && this.state.errorMessage !== null) {
      return (<div><Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert></div>);
    }

    var products = [],
      filters = [],
      productCategories = [(<li className="nav-item"><a className={this.state.activeCategory == null ? "nav-link active" : "nav-link"} href="#" onClick={(e) => { this.selectCategory(e, null); }}>All</a></li>)],
      pagination = [],
      self = this;
    if (this.state.products) {
      this.state.products.forEach(function(product) {
        products.push((<ProductElt product={product} className="row product-item" />));
      });
    }

    if (this.state.filters) {
      this.state.filters.forEach(function(filter) {
        var lst = [];
        if (filter.values) {
          filter.values.forEach(function(value) {
            lst.push((<li><input type="checkbox" onClick={(e) => { self.filter(e, filter.id, value.content); }} /><label>{value.content}</label></li>))
          });
        }

        filters.push((<div className="form-group filter"><label>{filter.name}</label><ul className="list-unstyled">{lst}</ul></div>))
      });
    }

    if (this.state.pagination && this.state.pagination.length > 1) {
      this.state.pagination.forEach(function(page) {
        pagination.push((<li className="page-item"><a className="page-link" href="#" onClick={(e) => { self.changePage(e, page.name); }}>{page.name}</a></li>))
      });
    }

    if (this.props.shop['_links'] && this.props.shop['_links']['productCategories']) {
        var arr = this.props.shop['_links']['productCategories'];
        if (!(arr instanceof Array)) {
          arr = [arr];
        }

        arr.forEach(function(cat) {
          var splitted = cat.href.split('/');
          var catId = splitted[splitted.length - 1];
          productCategories.push((<li className="nav-item"><a className={self.state.activeCategory == catId ? "nav-link active" : "nav-link"} href="#" onClick={(e) => { self.selectCategory(e, catId); }}>{cat.name}</a></li>))
        });
    }

    return (<div>
        <section className="row white-section shop-section shop-section-padding">
          <div className="row col-md-12">
            <div className="col-md-3">
              <form onSubmit={(e) => { e.preventDefault(); this.search(); }}>
                <div className="form-group">
                  <label>Product name</label>
                  <input type="text" className="form-control" name="productName" onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                  <button className="btn btn-default" onClick={this.search}>Search</button>
                </div>
              </form>
              <div className="form-group filter">
                <input type="checkbox" onClick={this.handleBestDeals}/> Best deals
              </div>
              <div className="form-group filter">
                <label>Price</label>
                <Range min={minPrice} ref="priceRange" max={maxPrice} defaultValue={[minPrice,maxPrice]} onChange={this.changePrice} onAfterChange={this.priceChange} />
                <div className="row">
                  <span className="col-md-4">Min €</span><input type="text" name="minPrice" className="form-control col-md-6" onChange={this.handlePriceChange} value={this.state.minPrice} />
                </div>
                <div className="row">
                  <span className="col-md-4">Max €</span><input type="text" name="maxPrice" className="form-control col-md-6" onChange={this.handlePriceChange} value={this.state.maxPrice} />
                </div>
              </div>
              {filters}
            </div>
            <div className="col-md-9">
              <Alert color="danger" isOpen={this.state.productErrorMessage !== null} toggle={this.toggleProductError}>{this.state.productErrorMessage}</Alert>
                  <div className="col-md-12">
                    <ul className="nav nav-pills">
                      {productCategories}
                    </ul>
                    <div className="col-md-4 offset-md-8">
                      <label>Filter by</label>
                      <select className="form-control" onChange={(e) => { this.changeOrder(e); }}>
                        <option data-target="update_datetime" data-method="desc">Latest</option>
                        <option data-target="price" data-method="asc">Price (asc)</option>
                        <option data-target="price" data-method="desc">Price (desc)</option>
                      </select>
                    </div>
                    { this.state.isProductsLoading ? (<div className="col-md-8"><i className='fa fa-spinner fa-spin'></i></div>) : (
                    <div>
                      {products.length === 0 ? (<span>No products</span>) : products}
                    </div>
                    )}
                    {pagination.length > 0 && (<ul className="pagination">
                      {pagination}
                    </ul>)}
                  </div>
            </div>
          </div>
        </section>
      </div>);
  }
  // Execute after the render
  componentWillMount() {
    var self = this,
      shopId = this.props.shop.id,
      filters = this.props.shop.filters;
    AppDispatcher.register(function(payload) {
      switch(payload.actionName) {
        case 'new-product-comment':
        case 'remove-product-comment':
          filterJson = $.extend({}, filterJson, {
            start_index: 0
          });
          self.updateProducts();
        break;
      }
    });
    self.setState({
      isLoading: true
    });
    filterJson['shop_id'] = shopId;
    self.setState({
      isLoading: false,
      filters: filters
    });
    self.updateProducts();
  }
}

export default ShopProducts;
