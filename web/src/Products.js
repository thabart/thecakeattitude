import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import Rater from 'react-rater';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import Constants from '../Constants';
import Magnify from 'react-magnify';
import 'react-magnify/lib/react-magnify.css'
import { ProductsService } from './services';
import { DescriptionTab, ProductComment } from './productabs';
import $ from 'jquery';
import './Products.css';
import classnames from 'classnames';

class Products extends Component {
  constructor(props) {
    super(props);
    this.toggleError = this.toggleError.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isLoading: false,
      errorMessage : null,
      currentImageIndice: 0,
      activeTab: '1'
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
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
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
                  <div className={newPrice == null ? "col-md-9" : "col-md-9 is-best-deals"}>
                    <Magnify style={{
                      width:'433px',
                      height: '433px'
                    }} src={currentImageSrc}></Magnify>
                    <div className="best-deals">
                      <img src="/images/hot_deals.png" width="120" />
                    </div>
                  </div>
                </section>)
              }
              <section className="row">
                <Nav tabs className="col-md-12">
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '1' })}
                      onClick={() => { this.toggle('1'); }}
                    >
                      General
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: this.state.activeTab === '2' })}
                      onClick={() => { this.toggle('2'); }}
                    >
                      Comments
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab} className="col-md-12">
                  <TabPane tabId="1">
                    <DescriptionTab product={this.state.product} />
                  </TabPane>
                  <TabPane tabId="2">
                    <ProductComment product={this.state.product} />
                  </TabPane>
                </TabContent>
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
