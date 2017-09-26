import React, {Component} from "react";
import { translate } from 'react-i18next';
import { ProductsService } from '../services/index';
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
        <ul className="progressbar progressbar-with-counter" style={{width: "100%"}}>
          <li className="col-2 active"><div className="counter-rounded">1</div>{t('status_created')}</li>
          <li className={this.state.activeTab >= '2' ? "col-2 active" : "col-2"}><div className="counter-rounded">2</div>{t('status_confirmed')}</li>
          <li className={this.state.activeTab >= '3' ? "col-2 active" : "col-2"}><div className="counter-rounded">3</div>{t('payment_status_approved')}</li>
          <li className={this.state.activeTab >= '4' ? "col-2 active" : "col-2"}><div className="counter-rounded">4</div>{t('purchased')}</li>
          <li className={this.state.activeTab === '5' ? "col-2 active" : "col-2"}><div className="counter-rounded">5</div>{t('received')}</li>
        </ul>
    </div>);
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(Workflow);
