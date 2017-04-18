import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Header';
import Map from './Map';
import Sellers from './Sellers';
import OpenIdService from './services/OpenId';
import SessionService from './services/Session';
import './App.css';

class App extends Component {
  componentWillMount() {
    var parameters = window.location.search.substring(1);
    var accessToken = SessionService.getSession();
    if (parameters && (!accessToken || accessToken == null)) {
      var dic = parameters.split('&');
      var accessToken = null;
      dic.forEach(function(concat) {
        var kvp = concat.split('=');
        if (kvp[0] == 'access_token') {
          accessToken = kvp[1];
        }
      });
    }

    if (accessToken == null) {
      return;
    }

    OpenIdService.introspect(accessToken).then(function(intro) {
      SessionService.setItem(accessToken);
      window.location.href = '/';
    }).catch(function() {
      SessionService.remove();
    });
  }
  render() {
    return (
      <Router>
        <div>
          <Header />
          <div>
            <Route exact path="/" component={Map}/>
            <Route path="/sellers" component={Sellers} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
