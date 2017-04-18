import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Header';
import Map from './Map';
import Sellers from './Sellers';
import AddShop from './AddShop';
import OpenIdService from './services/OpenId';
import SessionService from './services/Session';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Header />
          <div>
            <Route exact path="/" component={Map}/>
            <Route path="/sellers" component={Sellers} />
            <Route path="/addshop" component={AddShop} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
