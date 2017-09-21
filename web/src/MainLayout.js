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
    this.displayLoading = this.displayLoading.bind(this);
    this.state = {
      isLoadingDisplayed: false,
      loadingMessage: null
    };
  }

  render() {
    return (<div>
      <div id="app-container" className="red-theme">
        { this.state.isLoadingDisplayed && (
          <div>
            <div className="loader-overlay"></div>
            <div className="loader-spinner fixed">
              <h2 className="font-secondary redColor">{this.state.loadingMessage}</h2>
              <img src="/images/loader-spinner.gif" />
            </div>
          </div>
        ) }
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

  displayLoading() {
    var loading = ApplicationStore.getLoading();
    this.setState({
      isLoadingDisplayed: loading.display,
      loadingMessage: loading.message
    });
  }

  componentDidMount() {
    ApplicationStore.addMessageListener(this.displayNotification);
    ApplicationStore.addLoadingListener(this.displayLoading);
  }

  componentWillUnmount() {
    ApplicationStore.removeMessageListener(this.displayNotification);
    ApplicationStore.removeLoadingListener(this.displayLoading);
  }
}

export default MainLayout;
