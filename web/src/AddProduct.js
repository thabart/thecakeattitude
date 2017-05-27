import React, {Component} from "react";
import {Alert, TabContent, TabPane, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import {NavLink} from "react-router-dom";
import {DescriptionTab, CharacteristicsTab} from './addproductabs';
import {ProductsService, ShopsService} from './services/index';
import {withRouter} from "react-router";
import AppDispatcher from './appDispatcher';
import Constants from '../Constants';

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this._data = {};
    this.closeWarning = this.closeWarning.bind(this);
    this.closeError = this.closeError.bind(this);
    this.confirm = this.confirm.bind(this);
    this.state = {
      activeTab : '1',
      errorMessage: null,
      warningMessage: null,
      isLoading: false,
      shop: {}
    };
  }
  toggle(tab, json) {
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
  closeWarning() {
    this.setState({
      warningMessage: null
    });
  }
  closeError() {
    this.setState({
      errorMessage: null
    });
  }
  confirm(filters) {
    var json = this._data['1'],
      self = this;
    json['filters'] = filters;
    self.setState({
      isLoading: true
    });
    ProductsService.add(json).then(function() {
      self.setState({
        isLoading: false
      });
      self.props.history.push('/');
    }).catch(function() {
      self.setState({
        isLoading: false,
        errorMessage: 'An error occured while trying to add the product'
      });
    });
  }
  render() {
    var shopId = this.props.match.params.id;
    return (<div className="container">
            {this.state.shop.name && this.state.shop.name !== null && (
              <Breadcrumb>
                  <BreadcrumbItem>
                      <NavLink to={'/shops/' + this.state.shop.id + '/view/profile'}>
                        {this.state.shop.name}
                      </NavLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>Add product</BreadcrumbItem>
              </Breadcrumb>
            )}
            <ul className="progressbar">
                <li className={(parseInt(this.state.activeTab) >= 1) ? 'active' : ''}>Description</li>
                <li className={(parseInt(this.state.activeTab) >= 2) ? 'active' : ''}>Characteristics</li>
            </ul>
            <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert>
            <Alert color="warning" isOpen={this.state.warningMessage !== null} toggle={this.closeWarning}>{this.state.warningMessage}</Alert>
            <TabContent activeTab={this.state.activeTab} className="white-section progressbar-content">
                <div className={this.state.isLoading ? 'loading' : 'loading hidden'}><i className='fa fa-spinner fa-spin'></i></div>
                <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
                  <DescriptionTab next={(json) => {this.toggle('2', json); }} shop={this.state.shop} />
                </TabPane>
                <TabPane tabId='2' className={this.state.isLoading ? 'hidden' : ''}>
                  <CharacteristicsTab previous={() => { this.toggle('1');}} confirm={(j) => { this.confirm(j); }} />
                </TabPane>
            </TabContent>
      </div>);
  }
  componentDidMount() {
    var self = this;
    self.setState({
      isLoading: true
    });
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
        errorMessage: 'The shop doesn\'t exist'
      });
    });
  }
}

export default withRouter(AddProduct);
