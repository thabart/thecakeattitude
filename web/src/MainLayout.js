import React, {Component} from "react";
import $ from "jquery";
import Header from "./Header";
import Footer from './Footer';
import NotificationSystem from 'react-notification-system';
import { ApplicationStore } from './stores';
import { translate } from 'react-i18next';

class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.displayNotification = this.displayNotification.bind(this);
    this.displayLoading = this.displayLoading.bind(this);
    this.state = {
      isLoadingDisplayed: false
    };
  }

  render() {
    const {t} = this.props;
    return (<div>
      <div id="app-container" className="red-theme">
        { this.state.isLoadingDisplayed && (
          <div>
            <div className="loader-overlay"></div>
            <div className="loader-spinner fixed">
              <h2 className="font-secondary redColor">{t('loadingMessage')}</h2>
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
    var isLoading = ApplicationStore.getIsLoading();
    this.setState({
      isLoadingDisplayed: isLoading
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

export default translate('common', { wait: process && !process.release })(MainLayout);
