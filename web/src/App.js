import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import Map from './Map';
import Sellers from './Sellers';
import AddShop from './AddShop';
import Shop from './Shop';
import Products from './Products';
import { OpenIdService, SessionService } from './services';
import Error from './Error';
import createBrowserHistory  from 'history/createBrowserHistory';
import './App.css';
import $ from 'jquery';
import 'ms-signalr-client';
import AppDispatcher from './appDispatcher';

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
    /*
    var connection = $.hubConnection("http://localhost:5000");
    var proxy = connection.createHubProxy("notifier");
    proxy.on('shopAdded', function(message) {
      AppDispatcher.dispatch({
        actionName: 'new-shop',
        data: message
      });
    });
    proxy.on('shopCommentAdded', function(message) {
      AppDispatcher.dispatch({
        actionName: 'new-comment',
        data: message
      });
    });
    proxy.on('shopCommentRemoved', function(message) {
      AppDispatcher.dispatch({
        actionName: 'remove-comment',
        data: message
      });
    });
    connection.start({ jsonp: false })
      .done(function(){
        console.log('Now connected, connection ID=' + connection.id);
      })
      .fail(function(){ console.log('Could not connect'); });
      */
    var self = this;
    var session = SessionService.getSession();
    if (!session || session == null) {
      self.setState({
        isAccessTokenChecked: true
      });
      return;
    }

    OpenIdService.introspect(session.access_token).then(function() {
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
            <Route path="/home" component={Map}  />
            <Route path="/sellers" component={Sellers}  />
            <Route path="/shops/:id/:action?" component={Shop} />
            <Route path="/products/:id" component={Products} />
            <Route path="/addshop" render={() => (!self.isLoggedIn() ? (<Redirect to="/" />) : (<AddShop />))} />
            <Route path="/error/:type" component={Error} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
