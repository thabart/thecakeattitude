import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import { Alert } from 'reactstrap';
import Rater from 'react-rater';
import { ProductsService } from '../services';
import Constants from '../../Constants';
import 'rc-slider/assets/index.css';
import './products.css';
import $ from 'jquery';
import Promise from 'bluebird';

const minPrice = 1;
const maxPrice = 30000;
const defaultCount = 1;
const filterJson = {start_index : 0, count: defaultCount, min_price: minPrice, max_price: maxPrice, filters: []};

class ShopProducts extends Component {
  constructor(props) {
    super(props);
    this.changePrice = this.changePrice.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.filter = this.filter.bind(this);
    this.toggleProductError = this.toggleProductError.bind(this);
    this.priceChange = this.priceChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.changePage = this.changePage.bind(this);
    this.state = {
      minPrice: minPrice,
      maxPrice : maxPrice,
      errorMessage: null,
      isLoading: false,
      products : [],
      filters: [],
      pagination: [],
      isProductsLoading: false,
      productErrorMessage: null
    };
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
      productCategories = [(<li className="nav-item"><a className="nav-link" href="#">All</a></li>)],
      pagination = [],
      self = this;
    if (this.state.products) {
      this.state.products.forEach(function(product) {
        var imageUrl = "#"; // Set default url
        if (product.images && product.images.length > 0) {
          imageUrl = Constants.apiUrl + product.images[0];
        }

        var filters = [];
        if (product.filters) {
          var groupedFilters = {};
          product.filters.forEach(function(filter) {
            var record = groupedFilters[filter.filter_id];
            if (!record) {
              groupedFilters[filter.filter_id] = { label: filter.name, content : [ filter.content ] };
            } else {
              record.content.push(filter.content);
            }
          });

          for (var groupedFilter in groupedFilters) {
            var o = groupedFilters[groupedFilter];
            filters.push((<li>{o.label} : {o.content.join(',')}</li>));
          }
        }

        products.push((<section className="row product-item">
          <div className="col-md-3">
            <img src={imageUrl} className="rounded" width="140" height="140"/>
            <div className="best-deals">
              <img src="/images/hot_deals.png" width="60" />
            </div>
          </div>
          <div className="col-md-5">
            <h3>{product.name}</h3>
            <Rater total={5} interactive={false} />
            <p>
              {product.description}
            </p>
          </div>
          <div className="col-md-4">
            <h4 className="price">€ {product.price}</h4>
            <ul>
              {filters}
            </ul>
            <button className="btn btn-success">BUY</button>
          </div>
        </section>));
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
          productCategories.push((<li className="nav-item"><a className="nav-link" href="#">{cat.name}</a></li>))
        });
    }

    return (<div>
        <section className="row white-section shop-section shop-section-padding">
          <div className="row col-md-12">
            <div className="col-md-3">
              <div className="form-group">
                <label>Product name</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-group">
                <button className="btn btn-default">Search</button>
              </div>
              <div className="form-group filter">
                <input type="checkbox" /> Best deals
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
            <div className="col-md-8">
              <Alert color="danger" isOpen={this.state.productErrorMessage !== null} toggle={this.toggleProductError}>{this.state.productErrorMessage}</Alert>
              { this.state.isProductsLoading ? (<div className="col-md-8"><i className='fa fa-spinner fa-spin'></i></div>) :(
                  <div className="col-md-12">
                    <ul className="nav nav-pills">
                      {productCategories}
                    </ul>
                    <div>
                      {products.length === 0 ? (<span>No products</span>) : products}
                    </div>
                  </div>
                )
              }
              {pagination.length > 0 && (<ul className="pagination">
                {pagination}
              </ul>)}
            </div>

          </div>
        </section>
      </div>);
  }
  // Execute after the render
  componentWillMount() {
    var self = this;
    var shopId = this.props.shop.id;
    var filters = this.props.shop['_links']['filters'];
    self.setState({
      isLoading: true
    });
    var promises = [];
    if (filters && filters.length > 0) {
      filters.forEach(function(filter) {
        promises.push(
            new Promise(function(resolve, reject) {
              $.get(Constants.apiUrl + filter.href).then(function(r) {
                resolve(r);
              }).fail(function(e) {
                reject(e);
              });
            })
        )
      });
    }

    filterJson['shop_id'] = shopId;
    Promise.all(promises).then(function(result) {
      var filters = [];
      result.forEach(function(record) {
        filters.push(record['_embedded']);
      });
      self.setState({
        isLoading: false,
        filters: filters
      });
      self.updateProducts();
    }).catch(function(e) {
      self.setState({
        isLoading: false,
        errorMessage: 'an error occured while trying to retrieve the products'
      });
    });
  }
}

export default ShopProducts;
