import React, {Component} from "react";
import { translate } from 'react-i18next';
import { ProductsService, OrdersService } from '../services/index';
import { NavLink } from "react-router-dom";

const defaultCount = 5;

class Workflow extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  refresh(order) { // Refresh the products.
    var self = this;
    var activeTab;
    if (order.status === 'created') {
      activeTab = '1';
    }

    if (order.status === 'confirmed' && order.payment && order.payment.status === 'created') {
      activeTab = '2';
    }

    if (order.status === 'confirmed' && order.payment && order.payment.status === 'approved' && order.is_label_purchased === false) {
      activeTab = '3';
    }

    if (order.status === 'confirmed' && order.payment && order.payment.status === 'approved' && order.is_label_purchased === true) {
      activeTab = '4';
    }

    if (order.status === 'received') {
      activeTab = '5';
    }

    self.setState({
      activeTab : activeTab
    });
  }

  render() { // Display the products.
    var self = this;
    const {t} = this.props;
    return (<div>
        <ul className="progressbartriangle" style={{width: "100%"}}>
          <li className="active"><a href="#">{t('status_created')}</a></li>
          <li className={this.state.activeTab > '1' && 'active'}><a href="#" className="no-decoration red">{t('status_confirmed')}</a></li>
          <li className={this.state.activeTab > '2' && 'active'}><a href="#" className="no-decoration red">{t('payment_status_approved')}</a></li>
          <li className={this.state.activeTab > '3' && 'active'}><a href="#" className="no-decoration red">{t('purchased')}</a></li>
          <li className={this.state.activeTab > '4' && 'active'}><a href="#" className="no-decoration red">{t('received')}</a></li>
        </ul>
    </div>);
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(Workflow);
