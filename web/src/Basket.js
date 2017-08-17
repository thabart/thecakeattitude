import React, { Component } from "react";
import { TabContent, TabPane, Alert } from "reactstrap";
import { translate } from 'react-i18next';
import $ from "jquery";
import MainLayout from './MainLayout';

class Basket extends Component {
    constructor(props) {
        super(props);
    }

    render() { // Renders the view.
      const {t} = this.props;
        return (
            <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
              <div className="container">
                <h2>Your Shopping Cart</h2>
              </div>
            </MainLayout>
        );
    }
}

export default translate('common', { wait: process && !process.release })(Basket);
