import React, { Component } from "react";
import { TabContent, TabPane, Alert } from "reactstrap";
import { translate } from 'react-i18next';
import { ProductsTab, TransportMethodsTab } from './basketabs/index';
import { OrdersService } from './services/index';
import $ from "jquery";
import MainLayout from './MainLayout';

class Basket extends Component {
    constructor(props) {
        super(props);
        this.data = {};
        this.toggle = this.toggle.bind(this);
        this.refresh = this.refresh.bind(this);
        this.state = {
          activeTab: '1',
          isLoading: false
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

    refresh() {
      /*
        OrdersService.search({ }).then(function(res) {
          console.log(res);
        }).catch(function() {

        });
      */
    }

    render() { // Renders the view.
      const {t} = this.props;
        return (
            <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
              <div className="container">
                <h2>Your Shopping Cart</h2>
                <div className="mt-1 mb-1 p-1 bg-white rounded">
                    <ul className="progressbar progressbar-with-counter" style={{width: "100%"}}>
                      <li className="col-2 active"><div className="counter-rounded">1</div>Products</li>
                      <li className={this.state.activeTab >= '2' ? "col-2 active" : "col-2"}><div className="counter-rounded">2</div>Transports</li>
                    </ul>
                </div>
                <TabContent activeTab={this.state.activeTab}>
                  <div className={this.state.isLoading ? 'loading' : 'loading hidden'}>
                      <i className='fa fa-spinner fa-spin'/>
                  </div>
                  <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
                      <ProductsTab onNext={(json) => {
                          this.toggle('2', json);
                      }} />
                  </TabPane>
                  <TabPane tabId='2' className={this.state.isLoading ? 'hidden': ''}>
                    <TransportMethodsTab onPrevious={() => {
                        this.toggle('1');
                    }} onNext={(json) => {
                        this.toggle('3', json);
                    }}/>
                  </TabPane>
                </TabContent>
              </div>
            </MainLayout>
        );
    }
}

export default translate('common', { wait: process && !process.release })(Basket);
