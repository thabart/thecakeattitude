import React, {Component} from "react";
import {ManageAnnounces, ManageProfile, ManageShops} from './manageTabs/index';
import {NavLink} from "react-router-dom";
import {withRouter} from "react-router";

class Manage extends Component {
  render() {
    var action = this.props.match.params.action;
    var content = (<ManageProfile />);
    if (action === "announces") {
      content = (<ManageAnnounces />);
    } else if (action === "shops") {
      content = (<ManageShops />);
    }

    return (<div className="row">
      <nav className="col-sm-3 col-md-2 navbar-light">
        <ul className="nav nav-pills navbar-nav flex-column">
          <li className="nav-item"><NavLink to="/manage/profile" className="nav-link" activeClassName="text-white rounded bg-info">PROFILE</NavLink></li>
          <li className="nav-item"><NavLink to="/manage/announces" className="nav-link" activeClassName="text-white rounded bg-info">ANNOUNCES</NavLink></li>
          <li className="nav-item"><NavLink to="/manage/shops" className="nav-link" activeClassName="text-white rounded bg-info">SHOPS</NavLink></li>
        </ul>
      </nav>
      <section className="col-sm-9 col-md-10">
        {content}
      </section>
    </div>);
  }
}

export default withRouter(Manage);
