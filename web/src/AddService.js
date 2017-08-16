import React, {Component} from "react";
import { Alert, TabContent, TabPane, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { NavLink } from "react-router-dom";
import { DescriptionTab, PlanningTab } from './addservicetabs';
import { ShopsService, ShopServices } from './services/index';
import { translate } from 'react-i18next';
import { withRouter } from "react-router";
import { ApplicationStore } from './stores/index';
import { Guid } from './utils/index';
import AppDispatcher from './appDispatcher';
import MainLayout from './MainLayout';
import Constants from '../Constants';

class AddService extends Component {
  constructor(props) {
    super(props);
    this._data = {};
    this._commonId = null;
    this._waitForToken = null;
    this.save = this.save.bind(this);
    this.state = {
      activeTab: '1',
      isLoading: false,
      errorMessage: null,
      warningMessage: null,
      shop: {}
    };
  }

  toggle(tab, json) { // Toggle tab.
    var self = this;
    if (json) {
      self._data[self.state.activeTab] = json;
    }

    if (self.state.activeTab !== tab) {
      self.setState({
        activeTab: tab
      });
    }
  }

  save(occurrence) { // Save shop service.
    var json = this._data['1'],
      self = this;
    const {t} = this.props;
    json['occurrence'] = occurrence;
    self.setState({
      isLoading: true
    });
    json['shop_id'] = this.props.match.params.id;
    self._commonId = Guid.generate();
    ShopServices.add(json, self._commonId).catch(function() {
      ApplicationStore.sendMessage({
        message: t('errorAddShopService'),
        level: 'success',
        position: 'tr'
      });
      self.setState({
        isLoading: false
      });
    });
  }

  render() { // Display view.
    if (this.state.errorMessage !== null) {
        return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
          <div className="container">
            <Alert color="danger" isOpen={this.state.errorMessage !== null}>{this.state.errorMessage}</Alert>
          </div>
      </MainLayout>);
    }

    const {t} = this.props;
    return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <div className="mt-1 mb-1 p-1 bg-white rounded">
            <ul className="progressbar progressbar-with-counter" style={{width: "100%"}}>
              <li className={(parseInt(this.state.activeTab) >= 1) ? 'col-6 active' : 'col-6'}><div className="counter-rounded">1</div>{t('description')}</li>
              <li className={(parseInt(this.state.activeTab) >= 2) ? 'col-6 active' : 'col-6'}><div className="counter-rounded">2</div>{t('planning')}</li>
            </ul>
          </div>
          <TabContent activeTab={this.state.activeTab} className="white-section progressbar-content">
            {this.state.shop.name && this.state.shop.name !== null && (
              <Breadcrumb>
                <BreadcrumbItem>
                  <NavLink to={'/shops/' + this.state.shop.id + '/view/profile'}>
                    {this.state.shop.name}
                  </NavLink>
                </BreadcrumbItem>
                <BreadcrumbItem active>{t('addShopService')}</BreadcrumbItem>
              </Breadcrumb>
            )}
            <div className={this.state.isLoading ? 'loading' : 'loading hidden'}>
              <i className='fa fa-spinner fa-spin'></i>
            </div>
            <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
              <DescriptionTab onNext={(json) => {this.toggle('2', json); }} />
            </TabPane>
            <TabPane tabId='2' className={this.state.isLoading ? 'hidden' : ''}>
              <PlanningTab onPrevious={() => { this.toggle('1'); } } onNext={(json) => { this.save(json); }} />
            </TabPane>
          </TabContent>
      </div>
    </MainLayout>);
  }

  componentDidMount() { // Execute before the render.
    var self = this;
    self.setState({
      isLoading: true
    });
    const {t} = this.props;
    ShopsService.get(this.props.match.params.id).then(function(s) {
      self.setState({
        isLoading: false,
        shop: s['_embedded']
      });
    }).catch(function(e) {
      self.setState({
        isLoading: false,
        errorMessage: t('shopDoesntExistError')
      });
    });
    self._waitForToken = AppDispatcher.register(function (payload) {
      switch (payload.actionName) {
          case Constants.events.NEW_SHOP_SERVICE_ARRIVED:
              if (payload.data && payload.data.common_id === self._commonId) {
                self.props.history.push('/services/' + payload.data.id);
              }
              break;
      }
    });
  }

  componentWillUnmount() { // Remove listener.
      AppDispatcher.unregister(this._waitForToken);
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(AddService));
