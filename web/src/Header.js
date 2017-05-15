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
import "./Header.css";
import "./styles/Palette.css";

class Header extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.externalAuthenticate = this.externalAuthenticate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.disconnect = this.disconnect.bind(this);
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
            isConnectHidden: false
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

    handeAuthenticationSuccess() {
        var self = this;
        self.displayUserName().then(function () {
            self.setState({
                isErrorDisplayed: false,
                isLoading: false,
                isAuthenticateOpened: false,
                isLoggedIn: true
            });
        });
        self.props.history.push('/');
    }

    // Authenticate with login and password
    authenticate(e) {
        e.preventDefault();
        var self = this;
        self.setState({
            isLoading: true
        });
        OpenIdService.passwordAuthentication(this.state.login, this.state.password).then(function (resp) {
            AuthenticateService.authenticate(resp.access_token).then(function () {
                self.handeAuthenticationSuccess();
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
                    AuthenticateService.authenticate(accessToken).then(function () {
                        clearInterval(interval);
                        w.close();
                        self.handeAuthenticationSuccess();
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
        this.props.history.push('/');
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
        return (
            <div>
                <Navbar light toggleable fixed="top" className="nav-height">
                    <NavbarBrand href="/">SHOP IN GAME</NavbarBrand>
                    <Nav className="mr-auto">
                        <NavItem>
                            <NavLink
                                className="nav-link bg-info text-white rounded ml-1 mr-1"
                                to="/home">
                                EXPLORE
                            </NavLink>
                        </NavItem>
                        {
                            (this.state.isLoggedIn) ?
                                <NavLink
                                    className="nav-link bg-info text-white rounded ml-1 mr-1"
                                    to="/addshop">
                                    ADD SHOP
                                </NavLink> : ''
                        }
                        {
                            (this.state.isLoggedIn) ?
                                <NavLink
                                    className="nav-link bg-info text-white rounded ml-1 mr-1"
                                    to="/addAnnounce">
                                    ADD ANNOUNCE
                                </NavLink> : ''
                        }
                    </Nav>
                    <Nav className={(this.state.isConnectHidden ? 'hidden' : 'ml-auto')}>
                        {
                            (!this.state.isLoggedIn) ?
                                <NavItem>
                                    <a href="#"
                                       className="nav-link bg-info text-white rounded ml-1 mr-1"
                                       onClick={() => {
                                           this.toggle('isAuthenticateOpened');
                                       }}>
                                        SIGN IN
                                    </a>
                                </NavItem> : ''
                        }
                        {
                            (this.state.isLoggedIn) ?
                                <NavDropdown
                                    isOpen={this.state.isAccountOpened}
                                    toggle={() => {
                                        this.toggle('isAccountOpened');
                                    }}
                                >
                                    <DropdownToggle nav caret className="bg-info text-white rounded ml-1 mr-1">
                                        Welcome <strong>{" " + this.state.user.name}</strong>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={this.disconnect}>SIGN OUT</DropdownItem>
                                    </DropdownMenu>
                                </NavDropdown> : ''
                        }
                    </Nav>
                </Navbar>

                {/* modal part */}

                <Modal isOpen={this.state.isAuthenticateOpened}>
                    <ModalHeader toggle={() => {
                        this.toggle('isAuthenticateOpened');
                    }}>Authenticate</ModalHeader>
                    <ModalBody>
                        <div
                            className={this.state.isErrorDisplayed ? 'alert alert-danger' : 'alert alert-danger hidden'}>
                            <strong>Error !</strong> Either your login or your password is invalid
                        </div>
                        <div className={this.state.isLoading ? 'loading' : 'loading hidden'}><i
                            className='fa fa-spinner fa-spin'></i></div>
                        <div className={this.state.isLoading ? 'hidden' : ''}>
                            <form onSubmit={this.authenticate}>
                                <div className="form-group">
                                    <label className="">Login</label>
                                    <input type='text' className='form-control' name='login'
                                           onChange={this.handleInputChange}/>
                                </div>
                                <div className="form-group">
                                    <label className="">Password</label>
                                    <input type='password' className='form-control' name='password'
                                           onChange={this.handleInputChange}/>
                                </div>
                                <div className="form-group">
                                    <input type="submit" className="btn btn-success" value="Login"/>
                                </div>
                            </form>
                            <div className="separator">
                                <p>or</p>
                            </div>
                            <div className="form-group">
                                <button className="btn btn-default" onClick={this.externalAuthenticate}>Use external
                                    provider
                                </button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default withRouter(Header);
