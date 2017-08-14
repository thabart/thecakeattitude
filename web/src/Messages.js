import React, { Component } from "react";
import { translate } from 'react-i18next';
import { MessageService, UserService } from './services/index';
import { ApplicationStore } from './stores/index';
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import MainLayout from './MainLayout';
import moment from 'moment';

const defaultCount = 3;

class Messages extends Component {
  constructor(props) {
    super(props);
    var sub = ApplicationStore.getUser().sub;
    this._page = '1';
    this._request = { count: defaultCount, start_index: 0, is_parent: true, to: sub };
    this.refresh = this.refresh.bind(this);
    this.displayReceived = this.displayReceived.bind(this);
    this.displaySent = this.displaySent.bind(this);
    this.navToReceived = this.navToReceived.bind(this);
    this.navToSent = this.navToSent.bind(this);
    this.changePage = this.changePage.bind(this);
    this.state = {
      isLoading: false,
      messages: [],
      pagination: []
    };
  }

  refresh() { // Refresh the list of messages.
    var self = this;
    self.setState({
      isLoading: true
    });
    MessageService.search(self._request).then(function(r) {
      var messages = r['_embedded'];
      var pagination = r['_links'].navigation;
      if (!(messages instanceof Array)) {
        messages = [messages];
      }

      var subjects = messages.map(function(m) { return m.from; });
      UserService.searchPublicClaims({ subs: subjects }).then(function(usersObj) {
        if (!(usersObj instanceof Array)) {
          usersObj = [usersObj];
        }

        messages.forEach(function(m) {
          var user = usersObj.filter(function(u) { return u.claims.sub === m.from; });
          if (user && user.length === 1) {
            m['user_name'] = user[0].claims.name;
          }
        });

        self.setState({
          isLoading: false,
          messages: messages,
          pagination: pagination
        });
      }).catch(function() {
        self.setState({
          isLoading: false,
          messages: messages,
          pagination: pagination
        });
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        messages: [],
        pagination: []
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

  changePage(e, page) { // Change page.
    e.preventDefault();
    this._page = page;
    this._request['start_index'] = (page - 1) * defaultCount;
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
    var paginationLst = [];
    if (self.state.messages) {
      self.state.messages.forEach(function(message) {
        messageLst.push((
          <li>
            <div className="row" style={{padding: "0px 5px"}}>
              <div className="col-md-2">
                <b>{message.user_name ? (<NavLink className="no-decoration red" to={"/users/" + message.from}>{message.user_name}</NavLink>) : t('unknown')}</b><br />
                <span>{moment(message.create_datetime).format('lll')}</span>
              </div>
              <div className="col-md-8">
                <p>{message.content}</p>
              </div>
              <div className="col-md-2">
                <NavLink to={"/message/" + message.id} className="btn-light green"><i className="fa fa-external-link"></i> {t('view')}</NavLink>
              </div>
            </div>
          </li>
        ));
      });
    }

    if (this.state.pagination && this.state.pagination.length > 1) {
        this.state.pagination.forEach(function (page) {
            paginationLst.push((<li className="page-item">
              <a className={self._page === page.name ? "page-link active" : "page-link"} href="#" onClick={(e) => { self.changePage(e, page.name);}}>
                {page.name}
              </a>
            </li>))
        });
    }

    return (
      <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <h2>{t('yourMessages')}</h2>
          <div className="section" style={{padding: "20px"}}>
            <ul className="nav nav-pills red">
              <li className="nav-item"><a href="#" className={action === "received" ? "nav-link active" : "nav-link"} onClick={self.displayReceived}>{t('received')}</a></li>
              <li className="nav-item"><a href="#" className={action === "sent" ? "nav-link active" : "nav-link"} onClick={self.displaySent}>{t('sent')}</a></li>
            </ul>
            <ul className="list-group-default list-group-default-border" style={{marginTop: "5px"}}>
              { messageLst.length > 0 ? (messageLst) : (<span><i>{t('noMessage')}</i></span>) }
            </ul>
            { paginationLst.length > 0 && (<ul className="pagination">
                {paginationLst}
            </ul>) }
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
