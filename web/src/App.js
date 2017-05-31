import React, {Component} from "react";
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import Header from "./Header";
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
import {OpenIdService, SessionService} from "./services/index";
import {ApplicationStore} from './stores';
import Constants from '../Constants';
import Error from "./Error";
import createBrowserHistory from "history/createBrowserHistory";
import "./App.css";
import $ from "jquery";
import "ms-signalr-client";
import AppDispatcher from "./appDispatcher";
import NotificationSystem from 'react-notification-system';

var history = createBrowserHistory();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAccessTokenChecked: false,
            isLoggedIn: false
        };
    }

    componentWillMount() {
        var connection = $.hubConnection(Constants.apiUrl);
        var proxy = connection.createHubProxy("notifier");
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
        if (!self.state.isAccessTokenChecked) {
            return (<div>Loading ...</div>);
        }

        return (
            <Router history={history}>
                <div id="app-container">
                    <Header />
                    <div id="app-body">
                        <Route exact path="/" component={Map}/>
                        <Route path="/home" component={Map}/>
                        <Route path="/sellers" component={Sellers}/>
                        <Route path="/shops/:id/:paction/:action/:subaction?" component={Shop}/>
                        <Route path="/products/:id/:action?" component={Products}/>
                        <Route path="/services/:id/:action?" component={Services}/>
                        <Route path="/announces/:id" component={Announces} />
                        <Route path="/addproduct/:id" render={() => (!self.isLoggedIn() ? (<Redirect to="/" />) : (<AddProduct />))}/>
                        <Route path="/addshop" render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<AddShop />))}/>
                        <Route path="/addservice/:id" component={AddService} />
                        <Route path="/addAnnounce"
                               render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<AddAnnouncement />))}/>
                        <Route path="/manage/:action"
                               render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<Manage />))}/>
                        <Route path="/error/:type" component={Error}/>
                    </div>
                    <NotificationSystem ref="notificationSystem" />
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
