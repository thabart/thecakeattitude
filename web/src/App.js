import React, {Component} from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Map from "./Map";
import Sellers from "./Sellers";
import AddShop from "./AddShop";
import Shop from "./Shop";
import Products from "./Products";
import Services from "./Services";
import ClientServices from './ClientServices';
import Manage from './Manage';
import AddProduct from './AddProduct';
import AddClientService from "./AddClientService";
import AddService from './AddService';
import Notifications from './Notifications';
import Home from './Home';
import Tags from './Tags';
import Users from './Users';
import Messages from './Messages';
import Message from './Message';
import NewMessage from './NewMessage';
import Basket from './Basket';
import {OpenIdService, SessionService} from "./services/index";
import Constants from '../Constants';
import Error from "./Error";
import createBrowserHistory from "history/createBrowserHistory";
import $ from "jquery";
import "ms-signalr-client";
import AppDispatcher from "./appDispatcher";
import "./styles/app.css"; // Import all the styles.
import "./styles/index.css";
import './styles/fonts.css';
import "./styles/common.css";
import "./styles/progressBar.css";
import './styles/bootstrap.theme.css';
import "./styles/palette.css";
import "./styles/verticalMenu.css";
import "./styles/formTab.css";
import './styles/tags.css';
import './styles/section.css';
import './styles/image-selector.css';
import './styles/datePicker.css';
import './styles/profile.css';
import "./styles/rc-time-picker.css";
import "bootstrap/dist/css/bootstrap.css";
import "rc-slider/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-rater/lib/react-rater.css";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "react-magnify/lib/react-magnify.css";
import "react-grid-layout/css/styles.css";
import { translate } from 'react-i18next';

var history = createBrowserHistory();

class App extends Component {
    constructor(props) {
        super(props);
        this._connection = null;
        this._securedConnection = null;
        this._waitForToken = null;
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

        this._connection = $.hubConnection(Constants.apiUrl);
        this._securedConnection = $.hubConnection(Constants.apiUrl);
        var proxy = this._connection.createHubProxy("notifier");
        var securedProxy = this._securedConnection.createHubProxy("secured");
        proxy.on('serviceAdded', function(message) {
          AppDispatcher.dispatch({
            actionName: Constants.events.NEW_SHOP_SERVICE_ARRIVED,
            data: message
          });
        });
        proxy.on('productAdded', function(message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.ADD_PRODUCT_ARRIVED,
                data: message
            });
        });
        proxy.on('shopAdded', function (message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.NEW_SHOP_ARRIVED,
                data: message
            });
        });
        proxy.on('shopCommentAdded', function (message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.NEW_SHOP_COMMENT_ARRIVED,
                data: message
            });
        });
        proxy.on('shopCommentRemoved', function (message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.REMOVE_SHOP_COMMENT_ARRIVED,
                data: message
            });
        });
        proxy.on('productCommentAdded', function (message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.NEW_PRODUCT_COMMENT_ARRIVED,
                data: message
            });
        });
        proxy.on('productCommentRemoved', function (message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.REMOVE_PRODUCT_COMMENT_ARRIVED,
                data: message
            });
        });
        proxy.on('serviceCommentAdded', function (message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.NEW_SERVICE_COMMENT_ARRIVED,
                data: message
            });
        });
        proxy.on('serviceCommentRemoved', function (message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.REMOVE_SERVICE_COMMENT_ARRIVED,
                data: message
            });
        });
        proxy.on('clientServiceAdded', function (message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.ADD_CLIENT_SERVICE_ARRIVED,
                data: message
            });
        });
        proxy.on('clientServiceRemoved', function (message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.REMOVE_CLIENT_SERVICE_ARRIVED,
                data: message
            });
        });
        proxy.on('shopRemoved', function (message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.REMOVE_SHOP_ARRIVED,
                data: message
            });
        });
        proxy.on('shopUpdated', function(message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.SHOP_UPDATE_ARRIVED,
                data: message
            });
        });
        securedProxy.on('messageAdded', function(message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.MESSAGE_ADDED,
                data: message
            });
        });
        securedProxy.on('orderUpdated', function(message) {
            AppDispatcher.dispatch({
                actionName: Constants.events.ORDER_UPDATED_ARRIVED,
                data: message
            });
        });
        proxy.on('notificationUpdated', function(message) {
            AppDispatcher.dispatch({
                actionName: 'update-notification',
                data: message
            });
        });
        securedProxy.on('notificationAdded', function(message) {
            AppDispatcher.dispatch({
                actionName: 'update-notification',
                data: message
            });
        });
        this._connection.start({jsonp: false})
            .done(function () {
                console.log('Now connected, connection ID=' + self._connection.id);
            })
            .fail(function () {
                console.log('Could not connect');
            });
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

        self._waitForToken = AppDispatcher.register(function(payload) {
          switch(payload.actionName) {
            case Constants.events.USER_LOGGED_IN:
              var accessToken = SessionService.getSession().access_token;
              self._securedConnection.qs = 'authtoken=' + accessToken;
              self._securedConnection.start({jsonp: false})
                  .done(function () {
                      console.log('Now connected, connection ID=' + self._connection.id);
                  })
                  .fail(function () {
                      console.log('Could not connect');
                  });
            break;
            case Constants.events.USER_LOGGED_OUT:
              self._connection.qs = '';
              self._securedConnection.stop();
            break;
          }
        });
    }

    isLoggedIn() {
        var accessToken = SessionService.getSession();
        return accessToken && accessToken != null;
    }

    render() {
        const {t} = this.props;
        var self = this;
        if (!self.state.isAccessTokenChecked || self.state.isLoading) {
            return (<div className="loader-container">
              <div className="loader-spinner">
                <h2 className="font-secondary redColor">{t('loadingMessage')}</h2>
                <img src="/images/loader-spinner.gif" />
              </div>
            </div>);
        }

        return (
            <Router history={history}>
              <div>
                <Route exact path="/" component={Home}/>
                <Route path="/home" component={Home} />
                <Route path="/map" component={Map}/>
                <Route path="/sellers" component={Sellers} />
                <Route path="/shops/:id/:paction/:action/:subaction?" component={Shop}/>
                <Route path="/products/:id/:action?" component={Products}/>
                <Route path="/services/:id/:action?" component={Services}/>
                <Route path="/clientservices/:id" component={ClientServices} />
                <Route path="/tags/:tag" component={Tags} />
                <Route path="/users/:id" component={Users} />
                <Route path="/messages/:action?" render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<Messages />))}/>
                <Route path="/message/:id" render={(p) => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<Message id={p.match.params.id} />))}/>
                <Route path="/newmessage/:action?/:id?" render={(p) => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<NewMessage />))}/>
                <Route path="/notifications/:pageId?" render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<Notifications />))}/>
                <Route path="/addproduct/:id" render={() => (!self.isLoggedIn() ? (<Redirect to="/" />) : (<AddProduct />))}/>
                <Route path="/addshop" render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<AddShop />))}/>
                <Route path="/basket" render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<Basket />))}/>
                <Route path="/addservice/:id"
                       render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<AddService />))}/>
                <Route path="/addclientservice"
                       render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<AddClientService />))}/>
                <Route path="/manage/:action/:subaction?"
                       render={() => (!self.isLoggedIn() ? (<Redirect to="/"/>) : (<Manage />))}/>
                <Route path="/error/:type" component={Error}/>
              </div>
            </Router>
        );
    }

    componentWillUnmount() { // Remove listener.
        AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(App);
