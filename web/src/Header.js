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
import Promise from "bluebird";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { OpenIdService, AuthenticateService, SessionService, NotificationService, UserService, OrdersService, WebsiteService } from "./services/index";
import { translate } from 'react-i18next';
import { Guid } from './utils/index';
import { ApplicationStore } from './stores/index';
import AppDispatcher from "./appDispatcher";
import moment from 'moment';
import Constants from '../Constants';
import i18n from './i18n';
import "./styles/header.css";

class Header extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
        this._commonId = null;
        this.displayHelpModal = this.displayHelpModal.bind(this);
        this.toggle = this.toggle.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.externalAuthenticate = this.externalAuthenticate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.manageProfile = this.manageProfile.bind(this);
        this.manageShops = this.manageShops.bind(this);
        this.manageServices = this.manageServices.bind(this);
        this.manageOrders = this.manageOrders.bind(this);
        this.switchLanguage = this.switchLanguage.bind(this);
        this.refreshNotifications = this.refreshNotifications.bind(this);
        this.refreshOrders = this.refreshOrders.bind(this);
        this.readNotification = this.readNotification.bind(this);
        this.refreshUser = this.refreshUser.bind(this);
        this.navigateHelpModalTab = this.navigateHelpModalTab.bind(this);
        this.state = {
            user: null,
            activeItem: null,
            isMenuOpen: false,
            isAccountOpen: false,
            isNotificationOpened: false,
            isAuthenticateOpened: false,
            isOrderOpened: false,
            isErrorDisplayed: false,
            isLoading: false,
            isAccountOpened: false,
            isLoggedIn: false,
            isConnectHidden: false,
            isChooseLanguageOpened: false,
            isMobileMenuOpened: false,
            isNotificationLoading: false,
            isOrderLoading: false,
            notifications: [],
            orderStatus: {},
            nbUnread: 0,
            isHelpModalOpened: false,
            currentHelpModalTab: 0
        };
    }

    displayHelpModal() { // Display the help modal window.
      var self = this;
      self.setState({
        isHelpModalOpened: true
      });
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

    authenticate(e) { // Authenticate with login and password.
        e.preventDefault();
        var self = this;
        self.setState({
            isLoading: true
        });
        WebsiteService.login(this.state.login, this.state.password).then(function(resp) {
          var session = {
            access_token: resp.access_token
          };
          SessionService.setSession(session);
          UserService.getClaims().then(function(claims) {
            AppDispatcher.dispatch({
              actionName: Constants.events.USER_LOGGED_IN,
              data: claims
            });
            self.setState({
                isErrorDisplayed: false,
                isLoading: false,
                isAuthenticateOpened: false,
                isLoggedIn: true
            });
            self.refreshNotifications(claims);
          }).catch(function() {
            SessionService.remove();
            self.handleAuthenticationError();
          });
          self.refreshNotifications();
        }).catch(function() {
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
        var isLoadingClaims = false;
        OpenIdService.getAuthorizationurl().then(function (url) {
            var w = window.open(url, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=400');
            var interval = setInterval(function () {
                if (w.closed) {
                    clearInterval(interval);
                    return;
                }

                var href = w.location.href;
                var accessToken = getParameterByName('access_token', href);
                if (accessToken && !isLoadingClaims) {
                    isLoadingClaims = true;
                    var session = {
                      access_token: accessToken
                    };
                    SessionService.setSession(session);
                    UserService.getClaims().then(function(claims) {
                      AppDispatcher.dispatch({
                        actionName: Constants.events.USER_LOGGED_IN,
                        data: claims
                      });
                      self.setState({
                          isErrorDisplayed: false,
                          isLoading: false,
                          isAuthenticateOpened: false,
                          isLoggedIn: true
                      });
                      clearInterval(interval);
                      w.close();
                    }).catch(function() {
                      SessionService.remove();
                      self.handleAuthenticationError();
                      clearInterval(interval);
                      w.close();
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

    manageServices() { // Manage client services.
      this.props.history.push('/manage/services');
    }

    manageOrders() { // Manage your orders.
      this.props.history.push('/manage/orders');
    }

    refreshUser() { // Display the user information.
      var user = ApplicationStore.getUser();
      if (!user || !user.name) {
        this.setState({
          isLoggedIn: false,
          user: null
        });
        return;
      }

      this.setState({
        isLoggedIn: true,
        user: user
      });
      this.refreshOrders();
      this.refreshNotifications();
    }

    switchLanguage(lng) { // Switch language.
      i18n.changeLanguage(lng);
      moment.locale(i18n.language);
    }

    refreshNotifications() { // Refresh the notifications.
      var self = this;
      self.setState({
        isNotificationLoading: true
      });
      var startDate = moment().subtract(7, 'd').format('YYYY-MM-DD');
      Promise.all([NotificationService.getStatus({start_date: startDate}), NotificationService.search({
        start_date: startDate,
        count: 5,
        is_read: false,
        start_index: 0
      })]).then(function(r) {
        var status = r[0]['_embedded'];
        var notifications = r[1]['_embedded'];
        if (!notifications) {
          notifications = [];
        }
        else if (!(notifications instanceof Array)) {
          notifications = [notifications];
        }

        var subs = notifications.map(function(notification) { return notification.from; });
        UserService.searchPublicClaims({subs: subs}).then(function(users) {
          notifications.forEach(function(notification) {
            var user = users.filter(function(user) { return user.claims.sub === notification.from; });
            if (user && user.length === 1) {
              notification.name = user[0].claims.name;
            }
          });

          self.setState({
            isNotificationLoading: false,
            notifications: notifications,
            nbUnread: status.nb_unread
          });
        }).catch(function() {
          self.setState({
            isNotificationLoading: false,
            notifications: notifications,
            nbUnread: status.nb_unread
          });
        });
      }).catch(function() {
        self.setState({
          isNotificationLoading: false,
          notifications: [],
          nbUnread: 0
        });
      });
    }

    refreshOrders() { // Refresh the orders.
      var self = this;
      self.setState({
        isOrderLoading: true
      });
      OrdersService.status().then(function(r) {
        var embedded = r['_embedded'];
        self.setState({
          isOrderLoading: false,
          orderStatus: embedded
        });
      }).catch(function() {
        self.setState({
          isOrderLoading: false,
          orderStatus: {}
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

    navigateHelpModalTab(currentTab) { // Navigate to the help modal tab.
      this.setState({
        currentHelpModalTab: currentTab
      });
    }

    render() { // Renders the view.
        var self = this;
        const { t } = self.props;
        var notificationLst = [],
          orderLst = [];
        if (self.state.notifications) {
            var headerTitle = t('pendingNotifications').replace('{0}', self.state.nbUnread);
            notificationLst.push((<DropdownItem header>{headerTitle}</DropdownItem>));
            self.state.notifications.map(function(notification) {
              var link = '';
              if (notification.parameters) { // construct the link.
                var shopId = notification.parameters.filter(function(param) { return param.type === "shop_id"; }).map(function(param) { return param.value; });
                var productId = notification.parameters.filter(function(param) { return param.type === "product_id"; }).map(function(param) { return param.value; });
                var serviceId = notification.parameters.filter(function(param) { return param.type === "service_id"; }).map(function(param) { return param.value; });
                var messageId = notification.parameters.filter(function(param) { return param.type === "message_id"; }).map(function(param) { return param.value; });
                var clientServiceId = notification.parameters.filter(function(param) { return param.type === "client_service_id"; }).map(function(param) { return param.value; });
                var shopServiceId = notification.parameters.filter(function(param) { return param.type === "shop_service_id"; }).map(function(param) { return param.value; });
                var orderId = notification.parameters.filter(function(param) { return param.type === "order_id"; }).map(function(param) { return param.value; });
                if (shopId && shopId.length === 1) {
                  link = (<i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/shops/'+shopId[0]+'/view/profile')}></i>);
                } else if (productId && productId.length === 1 && notification.content === 'add_product_comment') {
                  link = (<i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/products/'+productId[0]+'/comments')}></i>);
                } else if (serviceId && serviceId.length === 1) {
                  link = (<i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/services/'+serviceId[0]+'/comments')}></i>);
                } else if (messageId && messageId.length === 1) {
                  link = (<i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/message/'+messageId[0])}></i>);
                } else if (clientServiceId && clientServiceId.length === 1) {
                  link = (<i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/clientservices/'+clientServiceId[0])}></i>);
                } else if (shopServiceId && shopServiceId.length === 1) {
                  link = (<i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/services/'+shopServiceId[0])}></i>);
                } else if (productId && productId.length === 1 && notification.content === 'add_product') {
                  link = (<i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/products/'+productId[0])}></i>);
                } else if (orderId && orderId.length === 1) {
                  link = (<i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/orders/'+orderId[0])}></i>);
                }
              }

              var name = notification.name ? notification.name : t('unknown');
              notificationLst.push((<div>
                <div className="row" style={{width: "500px", fontSize: "10pt", paddingLeft: "10px"}}>
                  <div className="col-md-3"><b>{name}</b><br /><span>{moment(notification.create_date).format('lll')}</span></div>
                  <p className="col-md-7" style={{ maxWidth: "300px", overflowWarp: "break-word", whiteSpace: "normal"}}>{t(notification.content)}</p>
                  {notification.is_read ? (<div className="col-md-2"><i className="fa fa-eye"></i>{link}</div>)
                  : (<div className="col-md-2"><i className="fa fa-eye-slash" style={{cursor: "pointer"}} onClick={(e) => { e.stopPropagation(); self.readNotification(notification.id);  }}></i>{link}</div>)}
                </div>
              </div>))
            });

            notificationLst.push((<DropdownItem style={{textAlign: "center"}}><NavLink to="/notifications">({t('viewAll')})</NavLink></DropdownItem>));
        }

        var numberOfLinesCreated = self.state.orderStatus.number_of_lines_created || 0;
        if (self.state.orderStatus) {
          var headerTitle = t('numberOfProductsInYourBasket').replace('{0}', numberOfLinesCreated);
          orderLst.push((<DropdownItem header>{headerTitle}</DropdownItem>));
          orderLst.push((<DropdownItem style={{textAlign: "center"}}><NavLink to="/basket">({t('viewAll')})</NavLink></DropdownItem>));
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
                        {
                          (self.state.isLoggedIn) ? <li><NavLink to="/addshop" className="nav-link"  activeClassName="active-nav-link">{t('addShopMenuItem')}</NavLink></li> : ''
                        }
                        {
                          (self.state.isLoggedIn) ? <li><NavLink to="/addclientservice" className="nav-link no-style"  activeClassName="active-nav-link">{t('addOfferMenuItem')}</NavLink></li> : ''
                        }
                      </ul>
                      <ul>
                        { /* Help button */ }
                        <li><a href="#" className="nav-link no-style" onClick={this.displayHelpModal}><i className="fa fa-question-circle"></i></a></li>
                        <li><a href={Constants.gameUrl} className="nav-link no-style" target="_blank"><i className="fa fa-gamepad gamepad"></i></a></li>
                        { /* Messages */ }
                        {
                          (self.state.isLoggedIn ? (
                            <li><NavLink to="/messages" className="nav-link no-style"><i className="fa fa-envelope"></i></NavLink></li>
                          ) : '')
                        }
                        { /* Basket */ }
                        {
                          (self.state.isLoggedIn && (
                            <li className="dropdown dropdown-extended dropdown-notification open">
                              <NavDropdown isOpen={self.state.isOrderOpened} toggle={() => { if (self.state.isOrderOpened) { self.toggle('isOrderOpened'); return; } self.toggle('isOrderOpened'); self.refreshOrders(); }}>
                                <DropdownToggle nav>
                                  <i className="fa fa-shopping-cart"></i>
                                  <span className="badge badge-notify">{numberOfLinesCreated}</span>
                                </DropdownToggle>
                                { self.state.isOrderLoading ? (
                                  <DropdownMenu style={{textAlign: "center"}}>
                                    <i className='fa fa-spinner fa-spin'></i>
                                  </DropdownMenu>
                                ) : (<DropdownMenu>{orderLst}</DropdownMenu>) }
                              </NavDropdown>
                            </li>
                          ))
                        }
                        {/* Notifications */}
                        {
                          (self.state.isLoggedIn ? (<li className="dropdown dropdown-extended dropdown-notification open">
                              <NavDropdown isOpen={self.state.isNotificationOpened} toggle={() => { if (self.state.isNotificationOpened) { self.toggle('isNotificationOpened'); return; }  self.toggle('isNotificationOpened'); self.refreshNotifications(); }}>
                                <DropdownToggle nav>
                                  <i className="fa fa-bell-o"></i>
                                  <span className="badge badge-notify">{self.state.nbUnread}</span>
                                </DropdownToggle>
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
                              <DropdownItem onClick={self.manageServices}>{t('manageYourOffersMenuItem')}</DropdownItem>
                              <DropdownItem onClick={self.manageShops}>{t('manageYourShopsMenuItem')}</DropdownItem>
                              <DropdownItem onClick={self.manageOrders}>{t('manageYourOrdersMenuItem')}</DropdownItem>
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
                <Modal isOpen={self.state.isHelpModalOpened} size="lg">
                  <ModalHeader toggle={() => { self.toggle('isHelpModalOpened'); }} className="redColor"><h2>{t('helpModalTitle')}</h2></ModalHeader>
                  <ModalBody>
                    <div className={this.state.currentHelpModalTab !== 0 && "hidden"}>
                      <div style={{height: "500px"}}>
                        <h5>{t('whoAreYou')}</h5>
                        <div className="row">
                          <div className='col-md-5 text-center' onClick={() => self.navigateHelpModalTab(1)}>
                            <div className='choice' style={{height: "140px"}}>
                              <div style={{height: "100px"}}>
                                <img src="/images/seller.png" />
                              </div>
                              <h3>{t('aSeller')}</h3>
                            </div>
                          </div>
                          <div className='col-md-5 offset-md-1 text-center' onClick={() => self.navigateHelpModalTab(4)}>
                            <div className='choice' style={{height: "140px"}}>
                              <div style={{height: "100px"}}>
                                <img src="/images/buyer.png" />
                              </div>
                              <h3>{t('aBuyer')}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Create shop description */ }
                    <div className={this.state.currentHelpModalTab !== 1 && "hidden"}>
                      <div style={{height: "500px"}}>
                        <h5>{t('createShop')}</h5>
                        <p dangerouslySetInnerHTML={{__html: t('createShopHelpDescription')}}></p>
                      </div>
                      <button className="btn btn-default" onClick={() => self.navigateHelpModalTab(0)}>
                        {t('previous')}
                      </button>
                      <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={() => self.navigateHelpModalTab(2)}>
                        {t('next')}
                      </button>
                    </div>
                    { /* Manage order */ }
                    <div className={this.state.currentHelpModalTab !== 2 && 'hidden'}>
                      <div style={{height: "500px"}}>
                        <h5>{t('orders')}</h5>
                        <p dangerouslySetInnerHTML={{__html: t('sellerOrdersDescription') }}></p>
                      </div>
                      <button className="btn btn-default" onClick={() => self.navigateHelpModalTab(1)}>
                        {t('previous')}
                      </button>
                      <button style={{marginLeft: "5px"}} className="btn btn-default" onClick={() => self.navigateHelpModalTab(3)}>
                        {t('transporter')}
                      </button>                           
                    </div>
                    { /* Manage the orders */ }
                    <div className={this.state.currentHelpModalTab !== 3 && 'hidden'}>
                      <div style={{height: "500px"}}>
                        <h5>{t('transporter')}</h5>
                        <p dangerouslySetInnerHTML={{__html: t('transporterHelperDescription') }}></p>
                      </div>                      
                      <button className="btn btn-default" onClick={() => self.navigateHelpModalTab(2)}>
                        {t('previous')}
                      </button>
                    </div>
                    <div className={this.state.currentHelpModalTab !== 4 && 'hidden'}>
                      <div style={{height: "500px"}}>

                      </div>                  
                      <button className="btn btn-default" onClick={() => self.navigateHelpModalTab(0)}>
                        {t('previous')}
                      </button>
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
                    (self.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={self.manageServices}>{t('manageYourOffersMenuItem')}</a></li> : ''
                  }
                  {
                    (self.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={self.manageShops}>{t('manageYourShopsMenuItem')}</a></li> : ''
                  }
                </ul>
              </nav>
            </div>
        );
    }

    componentDidMount() { // Execute before the view is displayed.
      var self = this;
      const {t} = this.props;
      self._waitForToken = AppDispatcher.register(function (payload) {
          switch (payload.actionName) {
              case Constants.events.NOTIFICATION_ADDED_ARRIVED:
              case Constants.events.NOTIFICATION_UPDATED_ARRIVED:
                  var sub = ApplicationStore.getUser().sub;
                  if (payload.data.to === sub) {
                    self.refreshNotifications();
                  }

                  break;
              case Constants.events.ORDER_ADDED_ARRIVED:
              case Constants.events.ORDER_REMOVED_ARRIVED:
              case Constants.events.ORDER_UPDATED_ARRIVED:
              case Constants.events.ORDER_CONFIRMED_ARRIVED:
                if (payload.actionName === Constants.events.ORDER_ADDED_ARRIVED) {
                  ApplicationStore.sendMessage({
                    message: t('addProductToBasket'),
                    level: 'success',
                    position: 'bl'
                  });
                }

                self.refreshOrders();
              break;
              case Constants.events.USER_LOGGED_IN:
                self.refreshUser();
              break;
          }
      });
    }

    componentWillMount() { // Execute after the view is displayed.
        var self = this;
        self.refreshUser();
    }

    componentWillUnmount() { // Remove the registration.
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Header));
