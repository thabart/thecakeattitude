import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import './product.css';

const minPrice = 1;
const maxPrice = 30000;

class ShopProducts extends Component {
  constructor(props) {
    super(props);
    this.changePrice = this.changePrice.bind(this);
    this.state = {
      minPrice: minPrice,
      maxPrice : maxPrice
    };
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
              <div className="form-group">
                <label>Price</label>
                <Range min={minPrice} max={maxPrice} defaultValue={[minPrice,maxPrice]} onChange={this.changePrice} />
                <div className="row">
                  <span className="col-md-4">Min €</span><input type="text" className="form-control col-md-6" value={this.state.minPrice} />
                </div>
                <div className="row">
                  <span className="col-md-4">Max €</span><input type="text" className="form-control  col-md-6" value={this.state.maxPrice}/>
                </div>
              </div>
              <div className="form-group">
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
              <div className="form-group">
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
                <section>
                  
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>);
  }
}

export default ShopProducts;
