import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { Calendar, List } from './shopService';
import { withRouter } from "react-router";
import { translate } from 'react-i18next';

class ShopServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: this.props.isEditable
    };
  }

  render() { // Display the view.
    var action = this.props.match.params.subaction,
      content = null,
      self = this;
    const {t} = this.props;
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

    return (<section className="section row" style={{marginTop: "20px", paddingBottom: "20px", paddingTop: "20px"}}>
      { this.state.isEditable && (
        <div className="col-md-12">
          <NavLink className="btn btn-default" to={'/addservice/' + this.props.shop.id}>
            <i className="fa fa-plus"></i> {t('addService')}
          </NavLink>
        </div>)
      }
      <div className="col-md-12" style={{paddingTop: "20px"}}>
        <ul className="nav nav-pills shop-products-menu">
          <li className="nav-item"><a href="#" onClick={(e) => { e.preventDefault(); self.props.history.push(listUrl); }} className={action === "list" ? "nav-link active" : "nav-link"}>{t('list')}</a></li>
          <li className="nav-item"><NavLink to={calendarUrl} className="nav-link">{t('calendar')}</NavLink></li>
        </ul>
      </div>
      {content}
    </section>);
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(ShopServices));
