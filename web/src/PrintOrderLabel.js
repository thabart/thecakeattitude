import React, {Component} from "react";
import { translate } from 'react-i18next';
import { Alert, TabContent, TabPane, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { NavLink } from "react-router-dom";
import { OrdersService } from './services/index';
import { withRouter } from "react-router";
import { PrintOrderLabelStore, ApplicationStore } from './stores/index';
import { PackagingTypeTab, PaymentTab, SummaryTab } from './printOrderLabelTabs/index';
import MainLayout from './MainLayout';
import AppDispatcher from './appDispatcher';
import Constants from '../Constants';

class PrintOrderLabel extends Component {
  constructor(props) {
    super(props);
    this._waitForToken  = null;
    this._paymentTab = null;
    this.refresh = this.refresh.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      order: {},
      isLoading: false,
      errorMessage: null,
      isPaypalLoading: false
    };
  }

  refresh() { // Get the order.
    var self = this;
    self.setState({
      isLoading: true
    });
    const {t} = self.props;
    OrdersService.get(this.props.match.params.id).then(function(res) {
      var order = res['_embedded'];
      order.package.parcel = {
        weight: 2,
        length: 50,
        width: 80,
        height: 35
      };
      self.setState({
        isLoading: false,
        order: order
      });
      AppDispatcher.dispatch({
        actionName: Constants.events.PRINT_ORDER_LABEL_LOADED,
        data: order
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        order: {},
        errorMessage: t('orderDoesntExistError')
      });
    });
  }

  toggle(tab) { // Toggle the tab content.
    var self = this;
    if (self.state.activeTab !== tab) {
      self.setState({
        activeTab: tab
      });
    }
  }

  render() { // Display the component.
    const {t} = this.props;
    var self = this;
    if (this.state.errorMessage !== null) {
      return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <Alert color="danger" isOpen={this.state.errorMessage !== null}>{this.state.errorMessage}</Alert>
        </div>
      </MainLayout>);
    }

    return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <div className="mt-1 mb-1 p-1 bg-white rounded">
            <ul className="progressbar progressbar-with-counter" style={{width: "100%"}}>
              <li className={(parseInt(this.state.activeTab) >= 1) ? 'col-4 active' : 'col-4'}><div className="counter-rounded">1</div>{t('parcel')}</li>
              <li className={(parseInt(this.state.activeTab) >= 2) ? 'col-4 active' : 'col-4'}><div className="counter-rounded">2</div>{t('summary')}</li>
              <li className={(parseInt(this.state.activeTab) >= 3) ? 'col-4 active' : 'col-4'}><div className="counter-rounded">3</div>{t('payment')}</li>
            </ul>
          </div>
          <TabContent activeTab={this.state.activeTab} className="white-section progressbar-content">
            {this.state.order !== null && (
              <Breadcrumb>
                <BreadcrumbItem>
                  <NavLink to={'/orders/' + this.state.order.id }>
                    {t('orderTitle')}
                  </NavLink>
                </BreadcrumbItem>
                <BreadcrumbItem active>{t('printLabel')}</BreadcrumbItem>
              </Breadcrumb>
            )}
            <div className={this.state.isLoading ? 'loading' : 'loading hidden'}>
              <i className='fa fa-spinner fa-spin'></i>
            </div>
            {/* Packaging type */}
            <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
              <PackagingTypeTab onNext={() => {
                self.toggle('2');
                self.refs.summary.getWrappedInstance().refresh();
              }} />
            </TabPane>
            {/* Display summary */}
            <TabPane tabId="2" className={this.state.isLoading ? 'hidden' : ''}>
              <SummaryTab ref="summary" onPrevious={() => self.toggle('1')} onNext={() => {
                self.toggle('3');
                console.log(self._paymentTab);
                self._paymentTab.display();
              }} />
            </TabPane>
            {/* Display payment */}
            <TabPane tabId="3" className={this.state.isLoading ? 'hidden' : ''}>
              <PaymentTab ref={(r) => { if (r) { self._paymentTab  = r.getWrappedInstance(); }}} onPrevious={() => self.toggle('2')} history={self.props.history} />
            </TabPane>
          </TabContent>
      </div>
    </MainLayout>);
  }

  componentDidMount() { // Execute before the render.
    this.refresh();
    var self = this;
    self._waitForToken = AppDispatcher.register(function (payload) {
      switch (payload.actionName) {
        case Constants.events.ORDER_LABEL_PURCHASED_ARRIVED:
          self.props.history.push('/orders/' + payload.data.id);
        break;
      }
    });
  }

  componentWillUnmount() { // Remove listener.
    AppDispatcher.unregister(this._waitForToken);
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(PrintOrderLabel));
