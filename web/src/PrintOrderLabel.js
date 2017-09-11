import React, {Component} from "react";
import { translate } from 'react-i18next';
import { Alert, TabContent, TabPane, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { NavLink } from "react-router-dom";
import { OrdersService } from './services/index';
import { withRouter } from "react-router";
import { PackagingType } from './printOrderLabelTabs/index';
import MainLayout from './MainLayout';

class PrintOrderLabel extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.state = {
      activeTab: '1',
      order: {},
      isLoading: false,
      errorMessage: null
    };
  }

  refresh() { // Get the order.
    var self = this;
    self.setState({
      isLoading: true
    });
    const {t} = self.props;
    OrdersService.get(this.props.match.params.id).then(function(res) {
      self.setState({
        isLoading: false,
        order: res['_embedded']
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        order: {},
        errorMessage: t('orderDoesntExistError')
      });
    });
  }

  render() { // Display the component.
    const {t} = this.props;
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
              <li className={(parseInt(this.state.activeTab) >= 1) ? 'col-6 active' : 'col-6'}><div className="counter-rounded">1</div>{t('parcel')}</li>
              <li className={(parseInt(this.state.activeTab) >= 2) ? 'col-6 active' : 'col-6'}><div className="counter-rounded">2</div>{t('payment')}</li>
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
            <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
              <PackagingType />
            </TabPane>
            <TabPane tabId='2' className={this.state.isLoading ? 'hidden' : ''}>

            </TabPane>
          </TabContent>
      </div>
    </MainLayout>);
  }

  componentDidMount() {
    this.refresh();
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(PrintOrderLabel));
