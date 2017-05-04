import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import Map from './Map';
import Sellers from './Sellers';
import AddShop from './AddShop';
import Shop from './Shop';
import { OpenIdService, SessionService } from './services';
import Error from './Error';
import createBrowserHistory  from 'history/createBrowserHistory';
import signalr from 'react-native-signalr';
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
    console.log(signalr);
    const connection = signalr.hubConnection('http://localhost:5000');
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
            <Route path="/addshop" render={() => (!self.isLoggedIn() ? (<Redirect to="/" />) : (<AddShop />))} />
            <Route path="/error/:type" component={Error} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
