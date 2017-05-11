import React, { Component } from 'react';
import Rater from 'react-rater';
import Magnify from 'react-magnify';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

class ShopServices extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="container">
        <section className="white-section product-section">
          <div className="row col-md-12">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="title">Service</h3>
                  <div className="rating">
                    <div className="stars">
                      <Rater total={5} rating={2} interactive={false} />
                      <b> 2 </b>
                    </div>
                    <span className="comments">Comments(3)</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <ul className="no-padding tags col-md-12">
                    <li>eco</li>
                  </ul>
                </div>
              </div>
              <div className="row medium-padding-top">
                <ul className="col-md-3 no-style no-margin image-selector">
                  <li><a href="#" className="active"><img src="/images/default-service.jpg" /></a></li>
                  <li><a href="#" className="active"><img src="/images/default-service.jpg" /></a></li>
                </ul>
                <div className="col-md-9">
                  <Magnify style={{
                    width:'433px',
                    height: '433px'
                  }} src="/images/default-service.jpg"></Magnify>
                </div>
              </div>
              <div className="row">
                <Nav tabs className="col-md-12">
                  <NavItem>
                    <NavLink className="active">
                      General
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink>
                      Comments
                    </NavLink>
                  </NavItem>
                </Nav>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="title col-md-12">Description</h5>
                      <p className="col-md-12">Description</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <h4 className="price">€ 200</h4>
              <button className="btn btn-success">CONTACT THE SHOP</button>
            </div>
          </div>
        </section>
      </div> );
  }
  componentWillMount() {
  }
}

export default ShopServices;
