import React, { Component } from 'react';
import {NavLink} from "react-router-dom";
import { Calendar, List } from './shopService';
import {withRouter} from "react-router";
import './services.css';

class ShopServices extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var action = this.props.match.params.subaction,
      content = null,
      self = this;
    if (action === "calendar") {
      content = (<Calendar shop={this.props.shop} history={this.props.history} />);
    } else {
      content = (<List shop={this.props.shop} history={this.props.history} />);
      action = "list";
    }

    var calendarUrl = null,
      listUrl = null;
    if (this.props.isEditable) {
      calendarUrl = '/shops/' + this.props.shop.id + '/edit/services/calendar';
      listUrl = '/shops/' + this.props.shop.id + '/edit/services';
    } else {
      calendarUrl = '/shops/' + this.props.shop.id + '/view/services/calendar';
      listUrl = '/shops/' + this.props.shop.id + '/view/services';
    }

    return (<section className="row white-section shop-section shop-section-padding">
      <div className="row col-md-12 menu-service">
        <div className="shop-options">
          <NavLink to={listUrl} className="no-decoration"><i className={action === 'list' ? "fa fa-list active" : "fa fa-list"}></i></NavLink>
          <NavLink to={calendarUrl} className="no-decoration"><i className={action === 'calendar' ? "fa fa-calendar active" : "fa fa-calendar"}></i></NavLink>
        </div>
      </div>
      {content}
    </section>);
  }
}

export default withRouter(ShopServices);
