import React, {Component} from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavDropdown,
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
    Modal,
    ModalHeader,
    ModalBody
} from "reactstrap";
import {NavLink} from "react-router-dom";
import {withRouter} from "react-router";
import Promise from "bluebird";
import {OpenIdService, AuthenticateService, SessionService, NotificationService} from "./services/index";
import AppDispatcher from "./appDispatcher";
import moment from 'moment';
import Constants from '../Constants';
import { translate } from 'react-i18next';
import i18n from './i18n';
import {Guid} from './utils/index';
import "./styles/header.css";

class Header extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
        this._commonId = null;
        this.toggle = this.toggle.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.externalAuthenticate = this.externalAuthenticate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.manageProfile = this.manageProfile.bind(this);
        this.manageShops = this.manageShops.bind(this);
        this.manageAnnounces = this.manageAnnounces.bind(this);
        this.switchLanguage = this.switchLanguage.bind(this);
        this.refreshNotifications = this.refreshNotifications.bind(this);
        this.readNotification = this.readNotification.bind(this);
        this.state = {
            user: null,
            activeItem: null,
            isMenuOpen: false,
            isAccountOpen: false,
            isNotificationOpened: false,
            isAuthenticateOpened: false,
            isErrorDisplayed: false,
            isLoading: false,
            isAccountOpened: false,
            isLoggedIn: false,
            isConnectHidden: false,
            isChooseLanguageOpened: false,
            isMobileMenuOpened: false,
            isNotificationLoading: false,
            notifications: []
        };
    }

    toggle(name) {
        var value = !this.state[name];
        this.setState({
            [name]: value
        });
    }

    handleInputChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleAuthenticationError() {
        this.setState({
            isErrorDisplayed: true,
            isLoading: false,
            isLoggedIn: false
        });
    }

    handeAuthenticationSuccess(i) {
        var self = this;
        self.displayUserName().then(function () {
            self.setState({
                isErrorDisplayed: false,
                isLoading: false,
                isAuthenticateOpened: false,
                isLoggedIn: true
            });
        });
        AppDispatcher.dispatch({
          actionName: Constants.events.USER_LOGGED_IN,
          data: i
        });
    }

    authenticate(e) { // Authenticate with login and password
        e.preventDefault();
        var self = this;
        self.setState({
            isLoading: true
        });
        OpenIdService.passwordAuthentication(this.state.login, this.state.password).then(function (resp) {
            AuthenticateService.authenticate(resp.access_token).then(function (i) {
              self.handeAuthenticationSuccess(i);
            }).catch(function () {
              self.handleAuthenticationError();
            });
        }).catch(function (e) {
            self.handleAuthenticationError();
        });
    }

    externalAuthenticate() { // Authenticate with external identity providers.
        var getParameterByName = function (name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };
        var self = this;
        OpenIdService.getAuthorizationurl().then(function (url) {
            var w = window.open(url, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=400');
            var interval = setInterval(function () {
                if (w.closed) {
                    clearInterval(interval);
                    return;
                }

                var href = w.location.href;
                var accessToken = getParameterByName('access_token', href);
                if (accessToken) {
                    AuthenticateService.authenticate(accessToken).then(function (i) {
                        clearInterval(interval);
                        w.close();
                        self.handeAuthenticationSuccess(i);
                    }).catch(function () {
                        self.handleAuthenticationError();
                    });
                }
            })
        });
    }

    disconnect() { // Disconnect
        this.setState({
            isLoggedIn: false
        });
        SessionService.remove();
        AppDispatcher.dispatch({
          actionName: Constants.events.USER_LOGGED_OUT
        });
        this.props.history.push('/');
    }

    manageProfile() { // Manage profile
      this.props.history.push('/manage/profile');
    }

    manageShops() { // Manage shops.
      this.props.history.push('/manage/shops');
    }

    manageAnnounces() { // Manage announces.
      this.props.history.push('/manage/announces');
    }

    displayUser(isLoggedIn, user) { // Display the user information.
        this.setState({
            isLoggedIn: isLoggedIn,
            user: user
        });
    }

    displayUserName() { // Display username
        var self = this;
        return new Promise(function (resolve, reject) {
            var session = SessionService.getSession();
            var isLoggedIn = session && session != null;
            if (!isLoggedIn) {
                self.displayUser(isLoggedIn);
                resolve();
                return;
            }

            OpenIdService.getUserInfo(session.access_token).then(function (userInfo) {
                self.displayUser(true, userInfo);
                resolve();
            }).catch(function () {
                self.displayUser(false);
                reject();
            });
        });
    }

    switchLanguage(lng) { // Switch language.
      i18n.changeLanguage(lng);
      moment.locale(i18n.language);
    }

    componentWillMount() { // Execute before.
        var self = this;
        this.setState({
            isConnectHidden: true
        });
        this.displayUserName().then(function () {
            self.setState({
                isConnectHidden: false
            });
        }).catch(function () {
            self.setState({
                isConnectHidden: false
            });
        });
    }

    refreshNotifications() { // Refresh the notifications.
      var self = this;
      self.setState({
        isNotificationLoading: true
      });
      NotificationService.search({
        start_date: moment().subtract(7, 'd').format('YYYY-MM-DD'),
        count: 1,
        start_index: 0
      }).then(function(result) {
        var embedded = result['_embedded'];
        if (!(embedded instanceof Array)) {
          embedded = [embedded];
        }

        self.setState({
          isNotificationLoading: false,
          notifications: embedded
        });
      }).catch(function(e) {
        self.setState({
          isNotificationLoading: false,
          notifications: []
        });
      });
    }

    readNotification(notificationId) { // Read the notification.
      var self = this;
      self.setState({
        isNotificationLoading: true
      });
      self._commonId = Guid.generate();
      NotificationService.update(notificationId, {
        is_read: true
      }, self._commonId).catch(function() {
        self.setState({
          isNotificationLoading: false
        });
      });
    }

    render() { // Renders the view.
        var self = this;
        const { t } = self.props;
        var notificationLst = [];
        if (self.state.notifications) {
            var pendingNotifications = self.state.notifications.filter(function(n) { return n.is_read; }).length;
            var headerTitle = t('pendingNotifications').replace('{0}', pendingNotifications);
            notificationLst.push((<DropdownItem header>{headerTitle}</DropdownItem>));
            self.state.notifications.map(function(notification) {
              notificationLst.push((<div>
                <div className="row" style={{width: "500px", fontSize: "10pt", paddingLeft: "10px"}}>
                  <div className="col-md-3"><b>{notification.from}</b><br /><span>{moment(notification.create_date).format('lll')}</span></div>
                  <p className="col-md-7" style={{ maxWidth: "300px", overflowWarp: "break-word", whiteSpace: "normal"}}>{t(notification.content)}</p>
                  {notification.is_read ? (<div className="col-md-2"><i className="fa fa-eye"></i><i className="fa fa-link" style={{cursor: "pointer"}}></i></div>)
                  : (<i className="fa fa-eye-slash col-md-2" style={{cursor: "pointer"}} onClick={(e) => { e.stopPropagation(); self.readNotification(notification.id);  }}></i>)}
                </div>
              </div>))
            });

            notificationLst.push((<DropdownItem style={{textAlign: "center"}}><a href="#">({t('viewAll')})</a></DropdownItem>));
        }

        return (
            <div>
              <div className="navigation">
                <div className="fixed-top navbar-default">
                    <div className="toggler">
                      <i className="fa fa-bars" onClick={() => { self.toggle('isMobileMenuOpened'); }}></i>
                    </div>
                    {/* Display menu */}
                    <nav className="primary-menu">
                      <ul>
                        <li><NavLink to="/home" className="nav-link no-style" activeClassName="active-nav-link">{t('homeMenuItem')}</NavLink></li>
                        <li><NavLink to="/map" className="nav-link no-style" activeClassName="active-nav-link">{t('explorerMenuItem')}</NavLink></li>
                        <li><NavLink to="/game" className="nav-link no-style" activeClassName="active-nav-link">{t('gameMenuItem')}</NavLink></li>
                        {
                          (self.state.isLoggedIn) ? <li><NavLink to="/addshop" className="nav-link"  activeClassName="active-nav-link">{t('addShopMenuItem')}</NavLink></li> : ''
                        }
                        {
                          (self.state.isLoggedIn) ? <li><NavLink to="/addAnnounce" className="nav-link no-style"  activeClassName="active-nav-link">{t('addOfferMenuItem')}</NavLink></li> : ''
                        }
                      </ul>
                      <ul>
                        <li><NavLink to="/help" className="nav-link no-style" activeClassName="active-nav-link"><i className="fa fa-question-circle"></i></NavLink></li>
                        {
                          (self.state.isLoggedIn ? (<li className="dropdown dropdown-extended dropdown-notification open">
                              <NavDropdown isOpen={self.state.isNotificationOpened} toggle={() => { if (self.state.isNotificationOpened) { self.toggle('isNotificationOpened'); return; }  self.toggle('isNotificationOpened'); self.refreshNotifications(); }}>
                                <DropdownToggle nav><i className="fa fa-bell-o"></i></DropdownToggle>
                                {self.state.isNotificationLoading ? (
                                  <DropdownMenu style={{textAlign: "center"}}>
                                    <i className='fa fa-spinner fa-spin'></i>
                                  </DropdownMenu>
                                ) : (<DropdownMenu>{notificationLst}</DropdownMenu>)}
                              </NavDropdown>
                          </li>) : '')
                        }
                        {
                          (!self.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={() => { self.toggle('isAuthenticateOpened'); }}>{t('connectMenuItem')}</a></li> : ''
                        }
                        {
                        (self.state.isLoggedIn) ? <li><NavDropdown isOpen={self.state.isAccountOpened} toggle={() => { self.toggle('isAccountOpened'); }}>
                          <DropdownToggle nav caret>{t('welcome')} <strong>{self.state.user.name}</strong></DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem header>Menu</DropdownItem>
                              <DropdownItem onClick={self.disconnect}>{t('disconnectMenuItem')}</DropdownItem>
                              <DropdownItem header>{t('manageMenuItem')}</DropdownItem>
                              <DropdownItem onClick={self.manageProfile}>{t('manageYourProfileMenuItem')}</DropdownItem>
                              <DropdownItem onClick={self.manageAnnounces}>{t('manageYourOffersMenuItem')}</DropdownItem>
                              <DropdownItem onClick={self.manageShops}>{t('manageYourShopsMenuItem')}</DropdownItem>
                            </DropdownMenu>
                          </NavDropdown></li> : ''
                        }
                        <li>
                          <NavDropdown isOpen={self.state.isChooseLanguageOpened} toggle={() => { self.toggle('isChooseLanguageOpened'); }}>
                            <DropdownToggle nav caret>{t('chooseLanguage') + " (" + i18n.language + ")"}</DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem header>Languages</DropdownItem>
                                <DropdownItem onClick={() => self.switchLanguage('fr')}>{t('chooseFr')}</DropdownItem>
                                <DropdownItem onClick={() => self.switchLanguage('en')}>{t('chooseEn')}</DropdownItem>
                                <DropdownItem onClick={() => self.switchLanguage('nl')}>{t('chooseNl')}</DropdownItem>
                              </DropdownMenu>
                          </NavDropdown>
                        </li>
                      </ul>
                    </nav>
                    {/* Display title */}
                    <div className="brand">
                      <NavLink to="/home" className="no-style">ShopInGame</NavLink>
                    </div>
                </div>
                {/* modal part */}
                <Modal isOpen={self.state.isAuthenticateOpened}>
                  <ModalHeader toggle={() => {
                    self.toggle('isAuthenticateOpened');
                  }} className="redColor"><h2>{t('authenticateModalTitle')}</h2></ModalHeader>
                  <ModalBody>
                    <div className={self.state.isErrorDisplayed ? 'alert alert-danger' : 'alert alert-danger hidden'}>
                      {t('errorLogin')}
                    </div>
                    <div className={self.state.isLoading ? 'text-center authenticate-spinner' : 'text-center authenticate-spinner hidden'}><i className='fa fa-spinner fa-spin'></i></div>
                    <div className={self.state.isLoading ? 'hidden' : ''}>
                      <form onSubmit={self.authenticate}>
                        <div className="form-group">
                          <label className="">{t('loginField')}</label>
                          <input type='text' className='form-control' name='login' onChange={self.handleInputChange}/>
                        </div>
                        <div className="form-group">
                          <label className="">{t('passwordField')}</label>
                          <input type='password' className='form-control' name='password' onChange={self.handleInputChange}/>
                        </div>
                        <div className="form-group">
                          <input type="submit" className="btn btn-default" value={t('loginBtn')}/>
                        </div>
                      </form>
                      <div className="separator">
                        <p>{t('or')}</p>
                      </div>
                      <div className="form-group">
                        <button className="btn btn-default" onClick={self.externalAuthenticate}>
                          {t('useExternalProvider')}
                        </button>
                      </div>
                    </div>
                    </ModalBody>
                </Modal>
              </div>
              {/* Seconday menu */}
              <nav className={self.state.isMobileMenuOpened ? "secondary-menu" : "secondary-menu hidden"}>
                <ul className="list-group-default">
                  <li><NavLink to="/home" className="nav-link no-style" activeClassName="active-nav-link">{t('homeMenuItem')}</NavLink></li>
                  <li><NavLink to="/map" className="nav-link no-style" activeClassName="active-nav-link">{t('explorerMenuItem')}</NavLink></li>
                  {
                    (self.state.isLoggedIn) ? <li><NavLink to="/addshop" className="nav-link"  activeClassName="active-nav-link">{t('addShopMenuItem')}</NavLink></li> : ''
                  }
                  {
                    (self.state.isLoggedIn) ? <li><NavLink to="/addAnnounce" className="nav-link no-style"  activeClassName="active-nav-link">{t('addOfferMenuItem')}</NavLink></li> : ''
                  }
                  {
                    (!self.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={() => { self.toggle('isAuthenticateOpened'); }}>{t('connectMenuItem')}</a></li> : ''
                  }
                  {
                    (self.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={self.disconnect}>{t('disconnectMenuItem')}</a></li> : ''
                  }
                  {
                    (self.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={self.manageProfile}>{t('manageYourProfileMenuItem')}</a></li> : ''
                  }
                  {
                    (self.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={self.manageAnnounces}>{t('manageYourOffersMenuItem')}</a></li> : ''
                  }
                  {
                    (self.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={self.manageShops}>{t('manageYourShopsMenuItem')}</a></li> : ''
                  }
                </ul>
              </nav>
            </div>
        );
    }

    componentDidMount() {
      var self = this;
      self._waitForToken = AppDispatcher.register(function (payload) {
          switch (payload.actionName) {
              case 'update-notification':
                  if (payload.data.common_id === self._commonId) {
                    self.refreshNotifications();
                  }

                  break;
          }
      });
    }

    componentWillUnmount() { // Remove the registration.
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Header));
