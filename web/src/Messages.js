import React, { Component } from "react";
import { translate } from 'react-i18next';
import { MessageService } from './services/index';
import { ApplicationStore } from './stores/index';
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import MainLayout from './MainLayout';
import moment from 'moment';

class Messages extends Component {
  constructor(props) {
    super(props);
    var sub = ApplicationStore.getUser().sub;
    this._request = { count: 10, start_index: 0, is_parent: true, to: sub };
    this.refresh = this.refresh.bind(this);
    this.displayReceived = this.displayReceived.bind(this);
    this.displaySent = this.displaySent.bind(this);
    this.navToReceived = this.navToReceived.bind(this);
    this.navToSent = this.navToSent.bind(this);
    this.state = {
      isLoading: false,
      messages: []
    };
  }

  refresh() { // Refresh the list of messages.
    var self = this;
    self.setState({
      isLoading: true
    });
    MessageService.search(self._request).then(function(r) {
      var messages = r['_embedded'];
      if (!(messages instanceof Array)) {
        messages = [messages];
      }
      self.setState({
        isLoading: false,
        messages: messages
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        messages: []
      });
    });
  }

  displayReceived(e) { // Display received messages.
    e.preventDefault();
    this.props.history.push('/messages');
    this.navToReceived();
  }

  displaySent(e) { // Display sent messages.
    e.preventDefault();
    this.props.history.push('/messages/sent');
    this.navToSent();
  }

  navToReceived() { // Navigate to received messages.
    var sub = ApplicationStore.getUser().sub;
    delete this._request.from;
    this._request['to'] = sub;
    this.refresh();
  }

  navToSent() { // Navigate to sent messages.
    var sub = ApplicationStore.getUser().sub;
    delete this._request.to;
    this._request['from'] = sub;
    this.refresh();
  }

  render() { // Display the view.
    const {t} = this.props;
    var self = this;
    if (self.state.isLoading) {
      return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <div className="section" style={{padding: "20px"}}>
            <i className="fa fa-spinner fa-spin"></i>
          </div>
        </div>
      </MainLayout>);
    }

    var action = self.props.match.params.action;
    if (!action || action !== "sent") {
      action = "received";
    }

    var messageLst = [];
    if (self.state.messages) {
      self.state.messages.forEach(function(message) {
        messageLst.push((
          <li>
            <div className="row" style={{padding: "0px 5px"}}>
              <div className="col-md-2">
                <b>UNKNOWN</b><br />
                <span>{moment(message.create_datetime).format('lll')}</span>
              </div>
              <div className="col-md-8">
                <p>{message.content}</p>
              </div>
              <div className="col-md-2">
                <NavLink to={"/message/" + message.id} className="btn-light green"><i className="fa fa-external-link"></i> View</NavLink>
              </div>
            </div>
          </li>
        ));
      });
    }

    return (
      <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <h2>Your messages</h2>
          <div className="section" style={{padding: "20px"}}>
            <ul className="nav nav-pills red">
              <li className="nav-item"><a href="#" className={action === "received" ? "nav-link active" : "nav-link"} onClick={self.displayReceived}>Reçus</a></li>
              <li className="nav-item"><a href="#" className={action === "sent" ? "nav-link active" : "nav-link"} onClick={self.displaySent}>Envoyés</a></li>
            </ul>
            <ul className="list-group-default list-group-default-border" style={{marginTop: "5px"}}>
              { messageLst.length > 0 ? (messageLst) : (<span><i>No messages</i></span>) }
            </ul>
          </div>
        </div>
      </MainLayout>
    );
  }

  componentDidMount() { // Execute before the render.
    var self = this;
    var action = self.props.match.params.action;
    if (!action || action !== "sent") {
      action = "received";
    }

    if (action === "received") {
      this.navToReceived();
    } else {
      this.navToSent();
    }
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(Messages));
