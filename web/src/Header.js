import React, { Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,  Modal, ModalHeader, ModalBody, ModalFooter, Button, TabContent, TabPane } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import OpenIdService from './services/OpenId';
import SessionService from './services/Session';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleAccount = this.toggleAccount.bind(this);
    this.toggleAuthenticate = this.toggleAuthenticate.bind(this);
    this.toggleAuthenticateMethod = this.toggleAuthenticateMethod.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.externalAuthenticate = this.externalAuthenticate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      isMenuOpen: false,
      isAccountOpen: false,
      isAuthenticateOpened: false,
      isErrorDisplayed: false,
      isLoading: false,
      activeAuthenticateTab: '1'
    };
  }
  toggleMenu() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    });
  }
  toggleAccount() {
    this.setState({
      isAccountOpen: !this.state.isAccountOpen
    });
  }
  toggleAuthenticate() {
    this.setState({
      isAuthenticateOpened: !this.state.isAuthenticateOpened
    });
  }
  toggleAuthenticateMethod(tab) {
    if (this.state.activeAuthenticateTab === tab) {
      return;
    }

    this.setState({
      activeAuthenticateTab: tab
    })
  }
  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  authenticate(e) {
    e.preventDefault();
    var self = this;
    self.setState({
      isLoading : true
    });
    OpenIdService.passwordAuthentication(this.state.login, this.state.password).then(function(resp) {
      self.setState({
        isErrorDisplayed : false,
        isLoading : false,
        isAuthenticateOpened: false
      });
      SessionService.setSession(resp.access_token);
    }).catch(function(e) {
      self.setState({
        isErrorDisplayed : true,
        isLoading : false
      });
    });
  }
  externalAuthenticate() {
    OpenIdService.getAuthorizationurl().then(function(url) {
      window.location.href = url;
    });
  }
  render() {
    return (
      <div>
        <Navbar color="faded" light toggleable>
            <NavbarToggler right onClick={this.toggleMenu} />
            <NavbarBrand href="/">Application name</NavbarBrand>
            <Collapse isOpen={this.state.isMenuOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <Link to="/" className="nav-link">Map</Link>
                </NavItem>
                <NavItem>
                  <Link to="/sellers" className="nav-link">Sellers</Link>
                </NavItem>
                <NavItem>
                  <a href="#" className="nav-link" onClick={this.toggleAuthenticate}>Connect</a>
                </NavItem>
              </Nav>
            </Collapse>
        </Navbar>
        <Modal isOpen={this.state.isAuthenticateOpened}>
          <ModalHeader toggle={this.toggleAuthenticate}>Authenticate</ModalHeader>
          <ModalBody>
            <div className={this.state.isErrorDisplayed ? 'alert alert-danger' : 'alert alert-danger hidden'}>
              <strong>Error !</strong> Either your login or your password is invalid
            </div>
            <div className={this.state.isLoading ? 'loading': 'loading hidden'}><i className='fa fa-spinner fa-spin'></i></div>
            <div className={this.state.isLoading ? 'hidden' : ''}>
              <form onSubmit={this.authenticate}>
                <div className="form-group">
                  <label className="">Login</label>
                  <input type='text' className='form-control' name='login' onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="">Password</label>
                  <input type='password' className='form-control' name='password' onChange={this.handleInputChange} />
                </div>
                <div className="form-group">
                  <input type="submit" className="btn btn-success" value="Login" />
                </div>
              </form>
              <div className="separator">
                <p>or</p>
              </div>
              <div className="form-group">
                <button className="btn btn-default" onClick={this.externalAuthenticate}>Use external provider</button>
              </div>
              </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Header;
