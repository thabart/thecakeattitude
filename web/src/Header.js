import React, { Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleAccount = this.toggleAccount.bind(this);
    this.state = {
      isMenuOpen: false,
      isAccountOpen: false
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
  render() {
    return (
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
              <NavItem className={this.state.isAccountOpen ? 'nav-item dropdown show' : 'nav-item dropdown'}>
                <a className="nav-link dropdown-toggle"  href="#" onClick={this.toggleAccount}>Account</a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="#">Disconnect</a>
                </div>
              </NavItem>
            </Nav>
          </Collapse>
      </Navbar>
    );
  }
}

export default Header;
