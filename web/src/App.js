import React, {Component} from "react";
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import Header from "./Header";
import Footer from './Footer';
import Map from "./Map";
import Sellers from "./Sellers";
import AddShop from "./AddShop";
import Shop from "./Shop";
import Products from "./Products";
import Services from "./Services";
import Announces from './Announces';
import Manage from './Manage';
import AddProduct from './AddProduct';
import AddAnnouncement from "./AddAnnouncement";
import AddService from './AddService';
import Home from './Home';
import {OpenIdService, SessionService} from "./services/index";
import {ApplicationStore} from './stores';
import Constants from '../Constants';
import Error from "./Error";
import createBrowserHistory from "history/createBrowserHistory";
import $ from "jquery";
import "ms-signalr-client";
import AppDispatcher from "./appDispatcher";
import NotificationSystem from 'react-notification-system';
import "./styles/app.css"; // Import all the styles.
import "./styles/index.css";
import './styles/fonts.css';
import "./styles/common.css";
import "./styles/progressBar.css";
import './styles/bootstrap.theme.css';
import "./styles/palette.css";
import "bootstrap/dist/css/bootstrap.css";

var history = createBrowserHistory();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isAccessTokenChecked: false,
          isLoggedIn: false,
          isLoading: true
        };
    }

    componentWillMount() {
        var self = this;
        $(document).ready(function() {
          setTimeout(function() {
            self.setState({
              isLoading: false
            });
          }, 1000);
        });

        var connection = $.hubConnection(Constants.apiUrl);
        var proxy = connection.createHubProxy("notifier");
        proxy.on('serviceAdded', function(message) {
          AppDispatcher.dispatch({
            actionName: 'new-service',
            data: message
          });
        });
        proxy.on('productAdded', function(message) {
            AppDispatcher.dispatch({
                actionName: 'new-product',
                data: message
            });
        });
        proxy.on('shopAdded', function (message) {
            AppDispatcher.dispatch({
                actionName: 'new-shop',
                data: message
            });
        });
        proxy.on('shopCommentAdded', function (message) {
            AppDispatcher.dispatch({
                actionName: 'new-shop-comment',
                data: message
            });
        });
        proxy.on('shopCommentRemoved', function (message) {
            AppDispatcher.dispatch({
                actionName: 'remove-shop-comment',
                data: message
            });
        });
        proxy.on('productCommentAdded', function (message) {
            AppDispatcher.dispatch({
                actionName: 'new-product-comment',
                data: message
            });
        });
        proxy.on('productCommentRemoved', function (message) {
            AppDispatcher.dispatch({
                actionName: 'remove-product-comment',
                data: message
            });
        });
        proxy.on('serviceCommentAdded', function (message) {
            AppDispatcher.dispatch({
                actionName: 'new-service-comment',
                data: message
            });
        });
        proxy.on('serviceCommentRemoved', function (message) {
            AppDispatcher.dispatch({
                actionName: 'remove-service-comment',
                data: message
            });
        });
        proxy.on('announcementAdded', function (message) {
            AppDispatcher.dispatch({
                actionName: 'add-announce',
                data: message
            });
        });
        proxy.on('announcementRemoved', function (message) {
            AppDispatcher.dispatch({
                actionName: 'remove-announce',
                data: message
            });
        });
        proxy.on('shopRemoved', function (message) {
            AppDispatcher.dispatch({
                actionName: 'remove-shop',
                data: message
            });
        });
        proxy.on('shopUpdated', function(message) {
            AppDispatcher.dispatch({
                actionName: 'update-shop',
                data: message
            });
        });
        connection.start({jsonp: false})
            .done(function () {
                console.log('Now connected, connection ID=' + connection.id);
            })
            .fail(function () {
                console.log('Could not connect');
            });
        var self = this;
        var session = SessionService.getSession();
        if (!session || session == null) {
            self.setState({
                isAccessTokenChecked: true
            });
            return;
        }

        OpenIdService.introspect(session.access_token).then(function (i) {
            AppDispatcher.dispatch({
              actionName: Constants.events.USER_LOGGED_IN,
              data: i
            });
            self.setState({
                isAccessTokenChecked: true,
                isLoggedIn: true
            });
        }).catch(function (e) {
            self.setState({
                isAccessTokenChecked: true,
                isLoggedIn: false
            });
            AppDispatcher.dispatch({
              actionName: Constants.events.USER_LOGGED_OUT
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
        if (!self.state.isAccessTokenChecked || self.state.isLoading) {
            return (<div className="loader-container">
              <div className="loader-spinner">
                <h2 className="font-secondary redColor">Loading ...</h2>
                <img src="/images/loader-spinner.gif" />
              </div>
            </div>);
        }

        return (
            <Router history={history}>
              <div>
                <div id="app-container">
                    <Header />
                    <div id="app-body">
                        <Route exact path="/" component={Home}/>
                        <Route path="/home" component={Home} />
                        <Route path="/map" component={Map}/>
                        <Route path="/sellers" component={Sellers}/>
                        <Route path="/shops/:id/:paction/:action/:subaction?" component={Shop}/>
                        <Route path="/products/:id/:action?" component={Products}/>
                        <Route path="/services/:id/:action?" component={Services}/>
                        <Route path="/announces/:id" component={Announces} />
                        <Route path="/addproduct/:id" render={() => (!self.isLoggedIn() ? (<Redirect to="/" />) : (<AddProduct />))}/>
                        <Route path="/addshop" render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<AddShop />))}/>
                        <Route path="/addservice/:id"
                               render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<AddService />))}/>
                        <Route path="/addAnnounce"
                               render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<AddAnnouncement />))}/>
                        <Route path="/manage/:action"
                               render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<Manage />))}/>
                        <Route path="/error/:type" component={Error}/>
                    </div>
                    <div className="footerBg"></div>
                    <NotificationSystem ref="notificationSystem" />
                </div>
                <Footer />
              </div>
            </Router>
        );
    }

    componentDidMount() {
      var self = this;
      ApplicationStore.addMessageListener(function() {
        var message = ApplicationStore.getMessage();
        self.refs.notificationSystem.addNotification(message);
      });
    }
}

export default App;
