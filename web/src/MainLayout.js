import React, {Component} from "react";
import $ from "jquery";
import Header from "./Header";
import Footer from './Footer';
import NotificationSystem from 'react-notification-system';
import {ApplicationStore} from './stores';

class MainLayout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div>
      <div id="app-container" className="red-theme">
        {this.props.isHeaderDisplayed ? (<Header />) : (<span></span>)}
        <div id="app-body">
          {this.props.children}
        </div>
        {this.props.isFooterDisplayed ? (<div className="footer-bg"></div>) : (<span></span>)}
        <NotificationSystem ref="notificationSystem" />
      </div>
      {this.props.isFooterDisplayed ? (<Footer />) : (<span></span>)}
    </div>);
  }

  componentDidMount() {
    var self = this;
    ApplicationStore.addMessageListener(function() {
      var message = ApplicationStore.getMessage();
      self.refs.notificationSystem.addNotification(message);
    });
  }
}

export default MainLayout;
