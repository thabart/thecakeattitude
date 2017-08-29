import React, { Component } from "react";
import { TabContent, TabPane, Alert } from "reactstrap";
import { translate } from 'react-i18next';
import { ProductsTab } from './basketabs/index';
import $ from "jquery";
import MainLayout from './MainLayout';

class Basket extends Component {
    constructor(props) {
        super(props);
        this.state = {
          activeTab: '1',
          isLoading: false
        };
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
                    </ul>
                </div>
                <TabContent activeTab={this.state.activeTab}>
                  <div className={this.state.isLoading ? 'loading' : 'loading hidden'}>
                      <i className='fa fa-spinner fa-spin'/>
                  </div>
                  <TabPane tabId='1' className={this.state.isLoading ? 'hidden' : ''}>
                      <ProductsTab />
                  </TabPane>
                </TabContent>
              </div>
            </MainLayout>
        );
    }
}

export default translate('common', { wait: process && !process.release })(Basket);
