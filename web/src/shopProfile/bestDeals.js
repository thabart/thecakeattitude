import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import { ProductsService } from '../services';
import Rater from 'react-rater';
import moment from 'moment';
import Constants from '../../Constants';
import $ from 'jquery';

const json = { start_index: 0, count: 1, contains_valid_promotions: true };

class BestDeals extends Component {
  constructor(props) {
    super(props);
    this.displayBestDeals = this.displayBestDeals.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.navigateDeals = this.navigateDeals.bind(this);
    this.state = {
      products: [],
      navigation: [],
      isBestDealsLoading: false,
      errorMessage: null,
    };
  }
  // Navigate through the pages
  navigateDeals(e, name) {
    e.preventDefault();
    var startIndex = name - 1;
    json = $.extend({}, json, {
      start_index: startIndex
    });
    this.displayBestDeals();
  }
  // Toggle the error
  toggleError() {
    this.setState({
      errorMessage: null
    });
  }
  // Display the best deals
  displayBestDeals() {
    var self = this;
    self.setState({
      isBestDealsLoading: true
    });
    ProductsService.search(json).then(function(r) {
      var products = r['_embedded'],
        navigation = r['_links']['navigation'];
      if (!(products instanceof Array))
      {
        products = [products];
      }
      if (!(navigation instanceof Array)) {
        navigation = [navigation];
      }

      self.setState({
        products: products,
        navigation: navigation,
        isBestDealsLoading: false
      });
    }).catch(function() {
      self.setState({
        isBestDealsLoading: false
      });
    });
  }
  // Returns the view
  render() {
    var products = [],
      navigations = [],
      self = this;

    if (this.state.products && this.state.products.length > 0) {
      this.state.products.forEach(function(product) {
        var date = moment(product.update_datetime).format('LLL');
        var productImage = product['images'];
        var firstPromotion = product['promotions'][0];
        if (!productImage || productImage.length === 0) {
          productImage = "/images/jean.jpg";
        } else {
          productImage = Constants.apiUrl + productImage[0];
        }

        products.push((<div className="col-md-6">
          <div className="element">
            <div className="row header">
              <div className="col-md-3">
                <img src={productImage} className="rounded-circle" width="60" height="60" />
              </div>
              <div className="col-md-9">
                <h5 className="price inline"><stroke>€ {product.price}</stroke></h5> (<i>-{firstPromotion.discount}%</i>)
                <h5 className="price">€ {product.new_price}</h5>
                <b>{product.name}</b><br />
                {date} <br />
                <Rater total={5} interactive={false} />
              </div>
            </div>
          </div>
        </div>));
      });
    }

    if (this.state.navigation && this.state.navigation.length > 1) {
      this.state.navigation.forEach(function(nav) {
        navigations.push((<li className="page-item"><a href="#" className="page-link" onClick={(e) => { self.navigateDeals(e, nav.name); }}>{nav.name}</a></li>));
      });
    }

    return (
    <section className="row section white-section shop-section shop-section-padding">
      <h5>Best deals</h5>
      <div className="col-md-12"><Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert></div>
      {this.state.isBestDealsLoading ?
        (<div className="col-md-12"><i className='fa fa-spinner fa-spin'></i></div>) :
        products.length == 0 ? (<span>No deals</span>) :
        (<div className="col-md-12">
          <div className="col-md-12">
            <ul className="pagination">
              {navigations}
            </ul>
          </div>
          <div className="col-md-12">
              <div className="row">
                {products}
              </div>
          </div>
        </div>)
      }
    </section>
    );
  }
  // Execute after the render
  componentWillMount() {
    var shopId = this.props.shop.id;
    json['shop_id'] = shopId;
    this.displayBestDeals();
  }
}

export default BestDeals;
