import React, { Component } from "react";
import { TabContent, TabPane, Alert } from "reactstrap";
import { translate } from 'react-i18next';
import { ProductsTab, TransportMethodsTab, ShopsTab } from './basketabs/index';
import { OrdersService } from './services/index';
import AppDispatcher from './appDispatcher';
import MainLayout from './MainLayout';
import Constants from '../Constants';
import $ from "jquery";

class Basket extends Component {
    constructor(props) {
        super(props);
        this.data = {};
        this.toggle = this.toggle.bind(this);
        this.refresh = this.refresh.bind(this);
        this.displayProducts = this.displayProducts.bind(this);
        this.state = {
          activeTab: '1',
          isLoading: false,
          orders: []
        };
    }

    toggle(tab, json) { // Change tab.
        var self = this;
        if (json) {
            self.data[self.state.activeTab] = json;
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
      OrdersService.search({  }).then(function(res) {
        var embedded = res['_embedded'];
        if (!(embedded instanceof Array)) {
          embedded = [embedded];
        }

        self.setState({
          isLoading: false,
          orders: embedded
        });
        AppDispatcher.dispatch({
          actionName: Constants.events.BASKET_LOADED,
          data: embedded
        });
      }).catch(function() {
        self.setState({
          isLoading: false,
          orders: []
        });
      });
    }

    displayProducts(order) { // Display the products.
      this.refs.productTab.getWrappedInstance().display(order);
    }

    render() { // Renders the view.
      const {t} = this.props;
        return (
            <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
              <div className="container">
                <h2>{t('yourShoppingCartTitle')}</h2>
                <div className="mt-1 mb-1 p-1 bg-white rounded">
                    <ul className="progressbar progressbar-with-counter" style={{width: "100%"}}>
                      <li className="col-2 active"><div className="counter-rounded">1</div>{t('shops')}</li>
                      <li className={this.state.activeTab >= '2' ? "col-2 active" : "col-2"}><div className="counter-rounded">2</div>{t('products')}</li>
                      <li className={this.state.activeTab >= '3' ? "col-2 active" : "col-2"}><div className="counter-rounded">3</div>{t('transports')}</li>
                    </ul>
                </div>
                <TabContent activeTab={this.state.activeTab}>
                  <div className={this.state.isLoading ? 'loading' : 'loading hidden'}>
                      <i className='fa fa-spinner fa-spin'/>
                  </div>
                  { /* Shops tab */ }
                  <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
                    <ShopsTab onNext={(json) => {
                        this.toggle('2');
                        this.displayProducts(json.order);
                    }} orders={this.state.orders} />
                  </TabPane>
                  { /* Products tab */ }
                  <TabPane tabId='2' className={this.state.isLoading ? 'hidden' : ''}>
                      <ProductsTab ref="productTab" onPrevious={() => {
                          this.toggle('1');
                      }} onNext={(json) => {
                          this.toggle('3', json);
                      }} />
                  </TabPane>
                  { /* Transports tab */ }
                  <TabPane tabId='3' className={this.state.isLoading ? 'hidden': ''}>
                    <TransportMethodsTab onPrevious={() => {
                        this.toggle('2');
                    }} onNext={(json) => {
                        this.toggle('4', json);
                    }}/>
                  </TabPane>
                </TabContent>
              </div>
            </MainLayout>
        );
    }

    componentDidMount() { // Execute before the render.
      this.refresh();
    }
}

export default translate('common', { wait: process && !process.release })(Basket);
