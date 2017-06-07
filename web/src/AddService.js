import React, {Component} from "react";
import {Alert, TabContent, TabPane, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import {NavLink} from "react-router-dom";
import {DescriptionTab, PlanningTab} from './addservicetabs';
import {ShopsService,ShopServices} from './services/index';
import {withRouter} from "react-router";

class AddService extends Component {
  constructor(props) {
    super(props);
    this._data = {};
    this.closeWarning = this.closeWarning.bind(this);
    this.closeError = this.closeError.bind(this);
    this.save = this.save.bind(this);
    this.state = {
      activeTab: '1',
      isLoading: false,
      errorMessage: null,
      warningMessage: null,
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
  save(occurrence) {
    var json = this._data['1'],
      self = this;
    json['occurrence'] = occurrence;
    self.setState({
      isLoading: true
    });
    json['shop_id'] = this.props.match.params.id;
    ShopServices.add(json).then(function() {      
        self.setState({
          isLoading: false
        });
        self.props.history.push('/');
    }).catch(function() {
      self.setState({
        isLoading: false,
        errorMessage: 'An error occured while trying to add the service'
      });
    });
  }
  render() {
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
                <li className={(parseInt(this.state.activeTab) >= 2) ? 'active' : ''}>Planning</li>
            </ul>
            <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert>
            <Alert color="warning" isOpen={this.state.warningMessage !== null} toggle={this.closeWarning}>{this.state.warningMessage}</Alert>
            <TabContent activeTab={this.state.activeTab} className="white-section progressbar-content">
                <div className={this.state.isLoading ? 'loading' : 'loading hidden'}><i className='fa fa-spinner fa-spin'></i></div>
                <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
                  <DescriptionTab onNext={(json) => {this.toggle('2', json); }} />
                </TabPane>
                <TabPane tabId='2' className={this.state.isLoading ? 'hidden' : ''}>
                  <PlanningTab onPrevious={() => { this.toggle('1'); } } onNext={(json) => { this.save(json); }} />
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
    }).catch(function(e) {
      self.setState({
        isLoading: false,
        errorMessage: 'The shop doesn\'t exist'
      });
    });
  }
}

export default withRouter(AddService);