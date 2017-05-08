import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import Rater from 'react-rater';
import './Products.css';
import Constants from '../Constants';
import { ProductsService } from './services';
import $ from 'jquery';

class Products extends Component {
  constructor(props) {
    super(props);
    this.toggleError = this.toggleError.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.state = {
      isLoading: false,
      errorMessage : null,
      currentImageIndice: 0
    };
  }
  toggleError() {
    this.setState({
      errorMessage : null
    });
  }
  changeImage(e) {
    e.preventDefault();
    var indice = $(e.target).data('id');
    this.setState({
      currentImageIndice: indice
    });
  }
  render() {
    if (this.state.isLoading) {
      return (<div className="container">Loading ...</div>);
    }

    if (this.state.errorMessage !== null) {
      return (<div className="container"><Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert></div>);
    }

    var newPrice = null,
      promotion = null,
      tags = [],
      images = [],
      currentImageSrc = null,
      self = this;
    if (this.state.product.promotions && this.state.product.promotions.length > 0) {
      promotion = this.state.product.promotions[0];
      newPrice = this.state.product.new_price;
    }

    if (this.state.product.tags && this.state.product.tags.length > 0) {
      this.state.product.tags.forEach(function(tag) {
        tags.push((<li key={tag}>{tag}</li>));
      });
    }

    if (this.state.product.images && this.state.product.images.length > 0) {
      var i = 0;
      this.state.product.images.forEach(function(image) {
        var img = Constants.apiUrl + image;
        if (i === self.state.currentImageIndice) {
          currentImageSrc = img;
        }

        images.push((<li key={i}><a href="#" className={i == self.state.currentImageIndice && "active"} data-id={i} onClick={(e) => {self.changeImage(e)}}><img src={img} data-id={i} /></a></li>));
        i++;
      });
    }

    return (
      <div className="container">
        <section className="white-section product-section">
          <div className="row col-md-12">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="title">{this.state.product.name}</h3>
                  <div className="rating">
                    <div className="stars">
                      <Rater total={5} rating={this.state.product.average_score} interactive={false} />
                      <b> {this.state.product.average_score} </b>
                    </div>
                    <span className="comments">Comments({this.state.product.nb_comments})</span>
                  </div>
                </div>
              </div>
              <div className="row">
                {tags.length > 0 && (
                  <ul className="tags col-md-12">
                    {tags}
                  </ul>)
                }
              </div>
              {images.length > 0 && (
                <section className="row imgs">
                  <ul className="col-md-3 image-lst">
                    {images}
                  </ul>
                  <div className="col-md-9 image-big">
                    <img src={currentImageSrc} />
                  </div>
                </section>)
              }
              <section className="row">
                <h5 className="col-md-12">Description</h5>
                <p className="col-md-12">
                  {this.state.product.description}
                </p>
              </section>
            </div>
            <div className="col-md-4">
              {newPrice == null ? (<h4 className="price">€ {this.state.product.price}</h4>) : (
                <div>
                    <h4 className="price inline"><strike>€ {this.state.product.price}</strike></h4> (<i>-{promotion.discount}%</i>)
                    <h4 className="price inline new-price">€ {newPrice}</h4>
                </div>
              )}
              <button className="btn btn-success">BUY</button>
            </div>
          </div>
        </section>
      </div>
    );
  }
  componentWillMount() {
    var productId = this.props.match.params.id,
      self = this;
    self.setState({
      isLoading: true
    });
    ProductsService.get(productId).then(function(r) {
      self.setState({
        isLoading: false,
        product: r['_embedded']
      });
    }).catch(function(e) {
      var json = e.responseJSON;
      var error = "an error occured while trying to retrieve the product";
      if (json && json.error_description) {
        error = json.error_description;
      }

      self.setState({
        errorMessage: error,
        isLoading: false
      });
    });
  }
}

export default Products;
