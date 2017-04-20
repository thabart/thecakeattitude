import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import Map from './Map';
import Sellers from './Sellers';
import AddShop from './AddShop';
import OpenIdService from './services/OpenId';
import SessionService from './services/Session';
import createBrowserHistory  from 'history/createBrowserHistory';
import './App.css';
var history = createBrowserHistory();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAccessTokenChecked : false,
      isLoggedIn: false
    };
  }
  componentWillMount() {
    var self = this;
    var accessToken = SessionService.getSession();
    if (!accessToken || accessToken == null) {
      self.setState({
        isAccessTokenChecked: true
      });
    }

    OpenIdService.introspect(accessToken).then(function() {
      self.setState({
        isAccessTokenChecked: true,
        isLoggedIn : true
      });
    }).catch(function() {
      self.setState({
        isAccessTokenChecked: true,
        isLoggedIn : false
      });
      SessionService.remove();
    });
  }
  isLoggedIn() {
    var accessToken = SessionService.getSession();
    return accessToken && accessToken != null;
  }
  render() {
    var self = this;
    if (!self.state.isAccessTokenChecked) {
      return (<div>Loading ...</div>);
    }

    return (
      <Router history={history} >
        <div>
          <Header />
          <div>
            <Route exact path="/" component={Map}  />
            <Route exact path="/sellers" component={Sellers}  />
            <Route exact path="/addshop" render={() => (!self.isLoggedIn() ? (<Redirect to="/" />) : (<AddShop />))} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
