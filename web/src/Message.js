import React, { Component } from "react";
import { translate } from 'react-i18next';
import { MessageService, UserService } from './services/index';
import { Alert } from 'reactstrap';
import { NavLink} from "react-router-dom";
import { ApplicationStore } from './stores/index';
import moment from 'moment';
import MainLayout from './MainLayout';
import Promise from "bluebird";
import './styles/message-bubble.css';

class Message extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this._request = {
      orders: [
        { create_datetime: 'desc' }
      ],
      count: 10,
      start_index: 0
    };
    this.state = {
      isLoading: true,
      messages: [],
      subject: null,
      errorMessage: null
    };
  }

  refresh() { // Refresh the messages.
    var self = this;
    self.setState({
      isLoading: true
    });
    Promise.all([ MessageService.search(self._request), MessageService.get(self._request.parent_id) ]).then(function(result) {
      var messages = result[0]['_embedded'];
      var parentMessage = result[1]['_embedded'];
      if (!(messages instanceof Array)) {
        messages = [messages];
      }

      messages.unshift(parentMessage);
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
          subject: parentMessage.subject
        });
      }).catch(function() {
        self.setState({
          isLoading: false,
          messages: messages,
          subject: parentMessage.subject
        });
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        messages: [],
        subject: null
      });
    });
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
    return (
      <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <h2>{t('messagesTitle')}</h2>
          <div className="section" style={{padding: "20px"}}>
            <h4>{this.state.subject}</h4>
            { messageLst.length === 0 ? (<i>{t('noMessage')}</i>) : messageLst }
            <form>
              <textarea className="form-control" />
              <button className="btn btn-default">{t('sendMessage')}</button>
            </form>
          </div>
        </div>
      </MainLayout>
    );
  }

  componentDidMount() { // Execute before the render.
    var messageId = this.props.match.params.id;
    this._request['parent_id'] = messageId;
    this.refresh();
  }
}

export default translate('common', { wait: process && !process.release })(Message);
