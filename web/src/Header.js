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
import OpenIdService from "./services/OpenId";
import AuthenticateService from "./services/Authenticate";
import SessionService from "./services/Session";
import AppDispatcher from "./appDispatcher";
import Constants from '../Constants';
import { translate } from 'react-i18next';
import i18n from './i18n';
import "./styles/header.css";

class Header extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.externalAuthenticate = this.externalAuthenticate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.manageProfile = this.manageProfile.bind(this);
        this.manageShops = this.manageShops.bind(this);
        this.manageAnnounces = this.manageAnnounces.bind(this);
        this.switchLanguage = this.switchLanguage.bind(this);
        this.state = {
            user: null,
            activeItem: null,
            isMenuOpen: false,
            isAccountOpen: false,
            isAuthenticateOpened: false,
            isErrorDisplayed: false,
            isLoading: false,
            isAccountOpened: false,
            isLoggedIn: false,
            isConnectHidden: false,
            isChooseLanguageOpened: false,
            isMobileMenuOpened: false
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

    // Authenticate with login and password
    authenticate(e) {
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

    // Authenticate with external identity providers.
    externalAuthenticate() {
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

    // Disconnect
    disconnect() {
        this.setState({
            isLoggedIn: false
        });
        SessionService.remove();
        AppDispatcher.dispatch({
          actionName: Constants.events.USER_LOGGED_OUT
        });
        this.props.history.push('/');
    }

    // Manage profile
    manageProfile() {
      this.props.history.push('/manage/profile');
    }

    manageShops() {
      this.props.history.push('/manage/shops');
    }

    manageAnnounces() {
      this.props.history.push('/manage/announces');
    }

    // Display the user information.
    displayUser(isLoggedIn, user) {
        this.setState({
            isLoggedIn: isLoggedIn,
            user: user
        });
    }

    // Display username
    displayUserName() {
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

    switchLanguage(lng) {
      i18n.changeLanguage(lng);
    }

    componentWillMount() {
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

    render() {
        const { t } = this.props;
        return (
            <div>
              <div className="navigation">
                <div className="fixed-top navbar-default">
                    <div className="toggler">
                      <i className="fa fa-bars" onClick={() => { this.toggle('isMobileMenuOpened'); }}></i>
                    </div>
                    {/* Display menu */}
                    <nav className="primary-menu">
                      <ul>
                        <li><NavLink to="/home" className="nav-link no-style" activeClassName="active-nav-link">{t('homeMenuItem')}</NavLink></li>
                        <li><NavLink to="/map" className="nav-link no-style" activeClassName="active-nav-link">{t('explorerMenuItem')}</NavLink></li>
                        <li><NavLink to="/game" className="nav-link no-style" activeClassName="active-nav-link">{t('gameMenuItem')}</NavLink></li>
                        {
                          (this.state.isLoggedIn) ? <li><NavLink to="/addshop" className="nav-link"  activeClassName="active-nav-link">{t('addShopMenuItem')}</NavLink></li> : ''
                        }
                        {
                          (this.state.isLoggedIn) ? <li><NavLink to="/addAnnounce" className="nav-link no-style"  activeClassName="active-nav-link">{t('addOfferMenuItem')}</NavLink></li> : ''
                        }
                      </ul>
                      <ul>
                        <li><NavLink to="/help" className="nav-link no-style" activeClassName="active-nav-link"><i className="fa fa-question-circle"></i></NavLink></li>
                        {
                          (this.state.isLoggedIn ? (<li><NavLink to="/notifications" className="nav-link no-style" activeClassName="active-nav-link"><i className="fa fa-bell-o"></i></NavLink></li>) : '')
                        }
                        {
                          (!this.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={() => { this.toggle('isAuthenticateOpened'); }}>{t('connectMenuItem')}</a></li> : ''
                        }
                        {
                        (this.state.isLoggedIn) ? <li><NavDropdown isOpen={this.state.isAccountOpened} toggle={() => { this.toggle('isAccountOpened'); }}>
                          <DropdownToggle nav caret>{t('welcome')} <strong>{this.state.user.name}</strong></DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={this.disconnect}>{t('disconnectMenuItem')}</DropdownItem>
                              <DropdownItem header>{t('manageMenuItem')}</DropdownItem>
                              <DropdownItem onClick={this.manageProfile}>{t('manageYourProfileMenuItem')}</DropdownItem>
                              <DropdownItem onClick={this.manageAnnounces}>{t('manageYourOffersMenuItem')}</DropdownItem>
                              <DropdownItem onClick={this.manageShops}>{t('manageYourShopsMenuItem')}</DropdownItem>
                            </DropdownMenu>
                          </NavDropdown></li> : ''
                        }
                        <li>
                          <NavDropdown isOpen={this.state.isChooseLanguageOpened} toggle={() => { this.toggle('isChooseLanguageOpened'); }}>
                            <DropdownToggle nav caret>{t('chooseLanguage') + " (" + i18n.language + ")"}</DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={() => this.switchLanguage('fr')}>{t('chooseFr')}</DropdownItem>
                                <DropdownItem onClick={() => this.switchLanguage('en')}>{t('chooseEn')}</DropdownItem>
                                <DropdownItem onClick={() => this.switchLanguage('nl')}>{t('chooseNl')}</DropdownItem>
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
                <Modal isOpen={this.state.isAuthenticateOpened}>
                  <ModalHeader toggle={() => {
                    this.toggle('isAuthenticateOpened');
                  }} className="redColor"><h2>{t('authenticateModalTitle')}</h2></ModalHeader>
                  <ModalBody>
                    <div className={this.state.isErrorDisplayed ? 'alert alert-danger' : 'alert alert-danger hidden'}>
                      {t('errorLogin')}
                    </div>
                    <div className={this.state.isLoading ? 'text-center authenticate-spinner' : 'text-center authenticate-spinner hidden'}><i className='fa fa-spinner fa-spin'></i></div>
                    <div className={this.state.isLoading ? 'hidden' : ''}>
                      <form onSubmit={this.authenticate}>
                        <div className="form-group">
                          <label className="">{t('loginField')}</label>
                          <input type='text' className='form-control' name='login' onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group">
                          <label className="">{t('passwordField')}</label>
                          <input type='password' className='form-control' name='password' onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group">
                          <input type="submit" className="btn btn-default" value={t('loginBtn')}/>
                        </div>
                      </form>
                      <div className="separator">
                        <p>{t('or')}</p>
                      </div>
                      <div className="form-group">
                        <button className="btn btn-default" onClick={this.externalAuthenticate}>
                          {t('useExternalProvider')}
                        </button>
                      </div>
                    </div>
                    </ModalBody>
                </Modal>
              </div>
              {/* Seconday menu */}
              <nav className={this.state.isMobileMenuOpened ? "secondary-menu" : "secondary-menu hidden"}>
                <ul className="list-group-default">
                  <li><NavLink to="/home" className="nav-link no-style" activeClassName="active-nav-link">{t('homeMenuItem')}</NavLink></li>
                  <li><NavLink to="/map" className="nav-link no-style" activeClassName="active-nav-link">{t('explorerMenuItem')}</NavLink></li>
                  {
                    (this.state.isLoggedIn) ? <li><NavLink to="/addshop" className="nav-link"  activeClassName="active-nav-link">{t('addShopMenuItem')}</NavLink></li> : ''
                  }
                  {
                    (this.state.isLoggedIn) ? <li><NavLink to="/addAnnounce" className="nav-link no-style"  activeClassName="active-nav-link">{t('addOfferMenuItem')}</NavLink></li> : ''
                  }
                  {
                    (!this.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={() => { this.toggle('isAuthenticateOpened'); }}>{t('connectMenuItem')}</a></li> : ''
                  }
                  {
                    (this.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={this.disconnect}>{t('disconnectMenuItem')}</a></li> : ''
                  }
                  {
                    (this.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={this.manageProfile}>{t('manageYourProfileMenuItem')}</a></li> : ''
                  }
                  {
                    (this.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={this.manageAnnounces}>{t('manageYourOffersMenuItem')}</a></li> : ''
                  }
                  {
                    (this.state.isLoggedIn) ? <li><a href="#" className="nav-link no-style" onClick={this.manageShops}>{t('manageYourShopsMenuItem')}</a></li> : ''
                  }
                </ul>
              </nav>
            </div>
        );
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Header));
