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
const filterJson = {filters: []};

class ShopProducts extends Component {
  constructor(props) {
    super(props);
    this.changePrice = this.changePrice.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.filter = this.filter.bind(this);
    this.toggleProductError = this.toggleProductError.bind(this);
    this.state = {
      minPrice: minPrice,
      maxPrice : maxPrice,
      errorMessage: null,
      isLoading: false,
      products : [],
      filters: [],
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

    self.setState({
      isProductsLoading: true
    });
    ProductsService.postSearch(filterJson).then(function(record) {
      var products = record['_embedded'];
      if (!(products instanceof Array)) {
        products = [products];
      }

      self.setState({
        isProductsLoading: false,
        products: products
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
      self = this;
    if (this.state.products) {
      this.state.products.forEach(function(product) {
        var imageUrl = "#"; // Set default url
        if (product.images && product.images.length > 0) {
          imageUrl = Constants.apiUrl + product.images[0];
        }

        var filters = [];
        if (product.filters) {
          product.filters.forEach(function(filter) {
            filters.push((<li>{filter.name} : {filter.content}</li>));
          });
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
                <label>Product's name</label>
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
                <Range min={minPrice} max={maxPrice} defaultValue={[minPrice,maxPrice]} onChange={this.changePrice} />
                <div className="row">
                  <span className="col-md-4">Min €</span><input type="text" className="form-control col-md-6" value={this.state.minPrice} />
                </div>
                <div className="row">
                  <span className="col-md-4">Max €</span><input type="text" className="form-control  col-md-6" value={this.state.maxPrice}/>
                </div>
              </div>
              {filters}
            </div>
            <div className="col-md-8">
              <Alert color="danger" isOpen={this.state.productErrorMessage !== null} toggle={this.toggleProductError}>{this.state.productErrorMessage}</Alert>
              { this.state.isProductsLoading ? (<div className="col-md-8"><i className='fa fa-spinner fa-spin'></i></div>) :(
                  <div className="col-md-8">
                    <ul className="nav nav-pills">
                      {productCategories}
                    </ul>
                    <div>
                      {products.length === 0 ? (<span>No products</span>) : products}
                    </div>
                  </div>
                )
              }
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

    promises.push( ProductsService.search({shop_id : shopId}) );
    Promise.all(promises).then(function(result) {
      var indice = 0,
        filters = [],
        products = [];
      result.forEach(function(record) {
        if (indice !== result.length - 1) {
          filters.push(record['_embedded']);
        }
        else {
          products = record['_embedded'];
          if (!(products instanceof Array)) {
            products = [products];
          }
        }

        indice++;
      });
      filterJson['shop_id'] = shopId;
      self.setState({
        isLoading: false,
        products: products,
        filters: filters
      });
    }).catch(function(e) {
      self.setState({
        isLoading: false,
        errorMessage: 'an error occured while trying to retrieve the products'
      });
    });
  }
}

export default ShopProducts;
