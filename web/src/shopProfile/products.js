import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

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
            </div>
            <div className="col-md-9">

            </div>
          </div>
        </section>
      </div>);
  }
}

export default ShopProducts;
