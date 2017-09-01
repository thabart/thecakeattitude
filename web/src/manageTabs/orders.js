import React, {Component} from "react";
import { OrdersService } from '../services/index';
import { translate } from 'react-i18next';
import { withRouter } from "react-router";
import { ApplicationStore } from '../stores/index';
import $ from 'jquery';

const defaultCount = 1;

class ManageOrders extends Component {
  constructor(props) {
    super(props);
    this._page = '1';
    // var sub = ApplicationStore.getUser().sub;
    this._request = {
      count: defaultCount,
      start_index: 0,
      orders: [
        { target: 'create_datetime', method: 'desc' }
      ]
    };
    this.displaySent = this.displaySent.bind(this);
    this.displayReceived = this.displayReceived.bind(this);
    this.navToSent = this.navToSent.bind(this);
    this.navToReceived = this.navToReceived.bind(this);
    this.changePage = this.changePage.bind(this);
    this.refresh = this.refresh.bind(this);
    this.state = {
      isLoading: false,
      orders: [],
      pagination: []
    };
  }

  displaySent(e) { // Display sent orders.
    e.preventDefault();
    this.props.history.push('/manage/orders');
    this.navToSent();
  }

  displayReceived(e) { // Display received orders.
    e.preventDefault();
    this.props.history.push('/manage/orders/received');
    this.navToReceived();
  }

  navToSent() { // Navigate to sent orders.
    var sub = ApplicationStore.getUser().sub;
    this._request['clients'] = [ sub ];
    delete this._request.sellers;
    this.refresh();
  }

  navToReceived() { // Navigate to received orders.
    var sub = ApplicationStore.getUser().sub;
    this._request['sellers'] = [ sub ];
    delete this._request.clients;
    this.refresh();
  }

  changePage(e, page) { // Change page.
    e.preventDefault();
    this._page = page;
    this._request['start_index'] = (page - 1) * defaultCount;
    this.refresh();
  }

  refresh() { // Refresh the list.
    var self = this;
    self.setState({
      isLoading: true
    });
    OrdersService.search(self._request).then(function(r) {
      var orders = r['_embedded'];
      var pagination = r['_links'].navigation;
      if (!(orders instanceof Array)) {
        orders = [orders];
      }

      self.setState({
        isLoading: false,
        orders: orders,
        pagination: pagination
      });
    }).catch(function(e) {
      self.setState({
        isLoading: false,
        orders: [],
        pagination: []
      });
    });
  }

  render() { // Display the component.
    const {t} = this.props;
    var self = this;
    var action = self.props.match.params.subaction;
    if (!action || action !== "received") {
      action = "sent";
    }

    return (<div className="container">
      <div className="section" style={{padding: "20px"}}>
        { this.state.isLoading ? (<i className="fa fa-spinner fa-spin"></i>) : (
          <div>
            <ul className="nav nav-pills red">
              <li className="nav-item"><a href="#" className={action === "sent" ? "nav-link active" : "nav-link"} onClick={self.displaySent}>{t('sent')}</a></li>
              <li className="nav-item"><a href="#" className={action === "received" ? "nav-link active" : "nav-link"} onClick={self.displayReceived}>{t('received')}</a></li>
            </ul>
          </div>
        ) }
      </div>
    </div>);
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(ManageOrders));
