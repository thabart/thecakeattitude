import React, { Component } from "react";
import { translate } from 'react-i18next';
import { MessageService, UserService } from './services/index';
import { Alert, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { NavLink} from "react-router-dom";
import { ApplicationStore } from './stores/index';
import { withRouter } from "react-router";
import AppDispatcher from './appDispatcher';
import moment from 'moment';
import MainLayout from './MainLayout';
import Promise from "bluebird";
import Constants from '../Constants';
import './styles/message-bubble.css';

const defaultCount = 10;

class Message extends Component {
  constructor(props) {
    super(props);
    this._waitForToken = null;
    this._page = '1';
    this._request = {
      orders: [
        { target: 'create_datetime', method: 'asc' }
      ],
      count: defaultCount,
      start_index: 0
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.refresh = this.refresh.bind(this);
    this.add = this.add.bind(this);
    this.changePage = this.changePage.bind(this);
    this.navigateMessages = this.navigateMessages.bind(this);
    this.state = {
      isLoading: true,
      messages: [],
      pagination: [],
      parentMessage: {},
      errorMessage: null,
      messageContent: null
    };
  }

  handleInputChange(e) { // Handle the input change.
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }

  refresh() { // Refresh the messages.
    var self = this;
    self.setState({
      isLoading: true
    });
    Promise.all([ MessageService.search(self._request), MessageService.get(self._request.parent_id) ]).then(function(result) {
      var messages = result[0]['_embedded'];
      var pagination = result[0]['_links'].navigation;
      var parentMessage = result[1]['_embedded'];
      if (!(messages instanceof Array)) {
        messages = [messages];
      }

      if (self._page === '1') {
        messages.unshift(parentMessage);
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
          parentMessage: parentMessage,
          pagination: pagination
        });
      }).catch(function() {
        self.setState({
          isLoading: false,
          messages: messages,
          subject: parentMessage.subject,
          pagination: pagination
        });
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        messages: [],
        subject: null,
        pagination: []
      });
    });
  }

  add(e) { // Send a message.
    e.preventDefault();
    var self = this;
    self.setState({
      isLoading: true
    });
    const {t} = this.props;
    var parentMessage = self.state.parentMessage;
    var to = ApplicationStore.getUser().sub === parentMessage.to ? parentMessage.from : parentMessage.to;
    var json = {
      to: to,
      parent_id: parentMessage.id,
      content: self.state.messageContent
    };
    MessageService.add(json).catch(function() {
      ApplicationStore.sendMessage({
        message: t('errorAddMessage'),
        level: 'error',
        position: 'tr'
      });
      self.refresh();
    });
  }

  changePage(e, page) { // Change the page.
    e.preventDefault();
    this._page = page;
    this._request['start_index'] = (page - 1) * defaultCount;
    this.refresh();
  }

  navigateMessages(e) { // Navigate to the messages view
    e.preventDefault();
    this.props.history.push('/messages');
  }

  render() { // Display component.
    if (this.state.isLoading) {
        return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
            <div className="container">
              <i className='fa fa-spinner fa-spin'></i>
            </div>
        </MainLayout>);
    }

    if (this.state.errorMessage !== null) {
        return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
          <div className="container">
            <Alert color="danger" isOpen={this.state.errorMessage !== null}>{this.state.errorMessage}</Alert>
          </div>
      </MainLayout>);
    }

    var messageLst = [];
    var paginationLst = [];
    var self = this;
    const {t} = this.props;
    if (this.state.messages) {
      var currentUserSub = ApplicationStore.getUser().sub;
      this.state.messages.forEach(function(message) {
        var isCurrentUser = message.from === currentUserSub;
        messageLst.push((<div className="row" style={{paddingBottom : "10px"}}>
          <div className={isCurrentUser ? "col-md-6 offset-md-6" : "col-md-6"}>
            <p style={{marginBottom: "0"}}>{message.user_name ? (<NavLink className="no-decoration red" to={"/users/" + message.from}>{message.user_name}</NavLink>) : t('unknown')} ({moment(message.create_datetime).format('lll')})</p>
            <div className={isCurrentUser ? "message sent" : "message received"}>
              {message.content}
            </div>
          </div>
        </div>));
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
          <h2>{t('messagesTitle')}</h2>
          <div className="section">
            <Breadcrumb>
              <BreadcrumbItem>
                <a href="#"
                 onClick={(e) => {
                 self.navigateMessages(e);
                }}>
                  {t('yourMessages')}
                </a>
               </BreadcrumbItem>
              <BreadcrumbItem active>{this.state.parentMessage.subject}</BreadcrumbItem>
            </Breadcrumb>
            <div style={{padding: "20px"}}>
              <h4>{this.state.parentMessage.subject}</h4>
              { messageLst.length === 0 ? (<i>{t('noMessage')}</i>) : messageLst }
              {paginationLst.length > 0 && (<ul className="pagination">
                  {paginationLst}
              </ul>)}
              <form onSubmit={this.add}>
                <textarea className="form-control" name='messageContent' onChange={this.handleInputChange} />
                <button className="btn btn-default">{t('sendMessage')}</button>
              </form>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  componentDidMount() { // Execute before the render.
    var messageId = this.props.id;
    var self = this;
    self._request['parent_id'] = messageId;
    self.refresh();
    const {t} = this.props;
    self._waitForToken = AppDispatcher.register(function (payload) {
      switch(payload.actionName) {
          case Constants.events.MESSAGE_ADDED:
              ApplicationStore.sendMessage({
                  message: t('messageAdded'),
                  level: 'success',
                  position: 'bl'
              });
              self.refresh();
          break;
      }
    });
  }

  componentWillUnmount() { // Remove listener.
      AppDispatcher.unregister(this._waitForToken);
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(Message));
