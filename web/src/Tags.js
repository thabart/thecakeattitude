import React, { Component } from 'react';
import { translate } from 'react-i18next';
import MainLayout from './MainLayout';

class Tags extends Component {
  render() { // Display the view.
    return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
      <div className="container">
        <h2>Tags Eco</h2>
      </div>
    </MainLayout>);
  }

  componentWillMount() { // Execute after the render.

  }
}


export default translate('common', { wait: process && !process.release })(Tags);
