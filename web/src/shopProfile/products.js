import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import { Alert } from 'reactstrap';
import Rater from 'react-rater';
import { ProductsService } from '../services';
import Constants from '../../Constants';
import 'rc-slider/assets/index.css';
import './products.css';

const minPrice = 1;
const maxPrice = 30000;

class ShopProducts extends Component {
  constructor(props) {
    super(props);
    this.changePrice = this.changePrice.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.state = {
      minPrice: minPrice,
      maxPrice : maxPrice,
      errorMessage: null,
      isLoading: false,
      products : []
    };
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

    var products = [];
    if (this.state.products) {
      this.state.products.forEach(function(product) {
        var imageUrl = "#"; // Set default url
        if (product.images && product.images.length > 0) {
          imageUrl = Constants.apiUrl + product.images[0];
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
            </ul>
            <button className="btn btn-success">BUY</button>
          </div>
        </section>));
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
              <div className="form-group filter">
                <label>Size</label>
                <ul className="list-unstyled">
                  <li>
                    <input type="checkbox" />
                    <label>XXL</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label>XL</label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label>L</label>
                  </li>
                </ul>
              </div>
              <div className="form-group filter">
                <label>Colors</label>
                <ul className="list-unstyled">
                  <li>
                    <input type="checkbox" />
                    <label>Red</label>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-8">
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <a className="nav-link" href="#">All</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Women</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Men</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Kids</a>
                </li>
              </ul>
              <div>
                {products.length === 0 ? (<span>No products</span>) : products}
              </div>
            </div>
          </div>
        </section>
      </div>);
  }
  // Execute after the render
  componentWillMount() {
    var self = this;
    var shopId = this.props.shop.id;
    self.setState({
      isLoading: true
    });
    ProductsService.search({shop_id : shopId}).then(function(products) {
      var embedded = products['_embedded'];
      if (!(embedded instanceof Array)) {
        embedded = [embedded];
      }

      self.setState({
        isLoading: false,
        products: embedded
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        errorMessage: 'an error occured while trying to retrieve the products'
      });
    });
  }
}

export default ShopProducts;
