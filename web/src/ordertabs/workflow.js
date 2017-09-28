import React, {Component} from "react";
import { translate } from 'react-i18next';
import { ProductsService, OrdersService } from '../services/index';
import { ApplicationStore } from '../stores/index';
import { NavLink } from "react-router-dom";

const defaultCount = 5;

class Workflow extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.state = {
      activeTab: '1',
      isParcelHistoryDisplayed: false,
      isParcelHistoryLoading: false,
      parcelHistory: {}
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

    const {t} = self.props;
    if (order.is_label_purchased === true) {
      self.setState({
        isParcelHistoryLoading: true,
        isParcelHistoryDisplayed: true
      });
      OrdersService.track(order.id).then(function(activities) {
        self.setState({
          isParcelHistoryLoading: false,
          parcelHistory: activities
        });
      }).catch(function(e) {
        var errorMsg = t('trackOrderError');
        if (e.responseJSON && e.responseJSON.error_description) {
          errorMsg = e.responseJSON.error_description;
        }

        self.setState({
          isParcelHistoryLoading: false
        });
        ApplicationStore.sendMessage({
          message: errorMsg,
          level: 'error',
          position: 'tr'
        });
      });
    }

    self.setState({
      activeTab : activeTab
    });
  }

  render() { // Display the products.
    var self = this;
    const {t} = self.props;
    var parcelHistories = [];
    if (self.state.parcelHistory && self.state.parcelHistory.activities) {
      self.state.parcelHistory.activities.forEach(function(activity) {
        parcelHistories.push(<div className="list-group-item" >
          <div className="col-md-4">
            <span>{activity.date}</span>
          </div>
          <div className="col-md-8">
            <p>{activity.description}</p>
          </div>
        </div>);
      });
    }

    return (<div>
        <ul className="progressbartriangle" style={{width: "100%"}}>
          <li className="active"><a href="#">{t('status_created')}</a></li>
          <li className={self.state.activeTab > '1' && 'active'}><a href="#" className="no-decoration red">{t('status_confirmed')}</a></li>
          <li className={self.state.activeTab > '2' && 'active'}><a href="#" className="no-decoration red">{t('payment_status_approved')}</a></li>
          <li className={self.state.activeTab > '3' && 'active'}><a href="#" className="no-decoration red">{t('purchased')}</a></li>
          <li className={self.state.activeTab > '4' && 'active'}><a href="#" className="no-decoration red">{t('received')}</a></li>
        </ul>
        { self.state.isParcelHistoryDisplayed && self.state.isParcelHistoryLoading && (<i className='fa fa-spinner fa-spin'></i>) }
        { self.state.isParcelHistoryDisplayed && !self.state.isParcelHistoryLoading && (
          <section>
            <h5>{t('trackParcel')}</h5>
            <div className="list-group-default">
              {parcelHistories}
            </div>
          </section>
        )}
    </div>);
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(Workflow);
