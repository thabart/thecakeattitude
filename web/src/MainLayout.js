import React, {Component} from "react";
import $ from "jquery";
import Header from "./Header";
import Footer from './Footer';
import NotificationSystem from 'react-notification-system';
import { ApplicationStore } from './stores';

class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.displayNotification = this.displayNotification.bind(this);
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

  displayNotification() {
    var message = ApplicationStore.getMessage();
    this.refs.notificationSystem.addNotification(message);
  }

  componentDidMount() {
    ApplicationStore.addMessageListener(this.displayNotification);
  }

  componentWillUnmount() {
    ApplicationStore.removeMessageListener(this.displayNotification);
  }
}

export default MainLayout;
