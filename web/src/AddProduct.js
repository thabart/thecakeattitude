import React, {Component} from "react";
import { Alert, TabContent, TabPane, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { NavLink } from "react-router-dom";
import { DescriptionTab, CharacteristicsTab } from './addproductabs';
import { ProductsService, ShopsService } from './services/index';
import { withRouter } from "react-router";
import { translate } from 'react-i18next';
import { Guid } from './utils/index';
import { ApplicationStore } from './stores/index';
import MainLayout from './MainLayout';
import AppDispatcher from './appDispatcher';
import Constants from '../Constants';

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this._data = {};
    this._commonId = null;
    this.confirm = this.confirm.bind(this);
    this.toggle = this.toggle.bind(this);
    this.refresh = this.refresh.bind(this);
    this.state = {
      activeTab : '2',
      errorMessage: null,
      isLoading: false,
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

  refresh() { // Refresh the view.
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
      AppDispatcher.dispatch({
        actionName: Constants.events.ADD_PRODUCT_LOADED,
        data: s['_embedded']
      });
    }).catch(function(e) {
      self.setState({
        isLoading: false,
        errorMessage: t('shopDoesntExistError')
      });
    });
  }

  confirm(filters) { // Save the product.
    var json = this._data['1'],
      self = this;
    json['filters'] = filters;
    self.setState({
      isLoading: true
    });
    const {t} = this.props;
    self._commonId = Guid.generate();
    ProductsService.add(json, self._commonId).catch(function() {
      ApplicationStore.sendMessage({
        message: t('errorAddProduct'),
        level: 'error',
        position: 'tr'
      });
      self.setState({
        isLoading: false
      });
    });
  }

  render() {
    var shopId = this.props.match.params.id;
    const {t} = this.props;

    if (this.state.errorMessage !== null) {
        return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
          <div className="container">
            <Alert color="danger" isOpen={this.state.errorMessage !== null}>{this.state.errorMessage}</Alert>
          </div>
      </MainLayout>);
    }

    return (
      <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
            { /* Navigation */ }
            <div className="mt-1 mb-1 p-1 bg-white rounded">
              <ul className="progressbar progressbar-with-counter" style={{width: "100%"}}>
                  <li className="col-6 active"><div className="counter-rounded">1</div>{t('description')}</li>
                  <li className={this.state.activeTab >= '2' ? "col-6 active" : "col-6"}><div className="counter-rounded">2</div>{t('characteristics')}</li>
              </ul>
            </div>
            { /* Display tab content */ }
            <TabContent activeTab={this.state.activeTab}>
                {this.state.shop.name && this.state.shop.name !== null && (
                  <Breadcrumb>
                      <BreadcrumbItem>
                          <NavLink to={'/shops/' + this.state.shop.id + '/view/profile'}>
                            {this.state.shop.name}
                          </NavLink>
                      </BreadcrumbItem>
                      <BreadcrumbItem active>{t('addProduct')}</BreadcrumbItem>
                  </Breadcrumb>
                )}
                { /* Loader */ }
                <div className={this.state.isLoading ? 'loading' : 'loading hidden'}>
                  <i className='fa fa-spinner fa-spin'></i>
                </div>
                { /* Description */ }
                <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
                  <DescriptionTab next={(json) => {this.toggle('2', json); }} shop={this.state.shop} />
                </TabPane>
                { /* Filters */ }
                <TabPane tabId='2' className={this.state.isLoading ? 'hidden' : ''}>
                  <CharacteristicsTab previous={() => { this.toggle('1');}} confirm={(j) => { this.confirm(j); }} />
                </TabPane>
            </TabContent>
        </div>
      </MainLayout>);
  }

  componentDidMount() { // Execute before the render view.
    this.refresh();
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(AddProduct));
