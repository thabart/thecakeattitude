import React, { Component } from "react";
import { translate } from 'react-i18next';
import MainLayout from './MainLayout';

class Messages extends Component {
  render() {
    const {t} = this.props;
    return (
      <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <h2>Your messages</h2>
          <div className="section" style={{padding: "20px"}}>
            <ul className="nav nav-pills red">
              <li className="nav-item"><a href="#" className="nav-link active">All</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Services</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Products</a></li>
            </ul>
            <ul className="list-group-default list-group-default-border">
              <li>
                
              </li>
            </ul>
          </div>
        </div>
      </MainLayout>
    );
  }
}

export default translate('common', { wait: process && !process.release })(Messages);
