import React, { Component } from 'react';
import { Tooltip, Alert, Modal, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { UserService, SessionService, OpenIdService } from '../services/index';
import { withRouter } from 'react-router';
import { ApplicationStore } from '../stores';
import { translate } from 'react-i18next';
import AppDispatcher from '../appDispatcher';
import Promise from 'bluebird';
import moment from 'moment';
import Rater from 'react-rater';
import Constants from '../../Constants';
import $ from 'jquery';
import '../styles/comment.css';

class CommentLst extends Component {
  constructor(props) {
    super(props);
    this._waitForToken = null;
    this._page = '1';
    this.request = { count: 4, start_index: 0 };
    this.navigateComment = this.navigateComment.bind(this);
    this.addComment = this.addComment.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.displayRemoveComment = this.displayRemoveComment.bind(this);
    this.toggleRemoveComment = this.toggleRemoveComment.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.state = {
      comments: [],
      navigations: [],
      isCommentsLoading: false,
      comment: '',
      score: 0,
      isAuthenticated: false,
      subject: null,
      errorMessage: null,
      isAddingComment: false,
      isRemoveCommentOpened: false,
      tooltip: {
        isScoreInvalid: false,
        isContentInvalid: false
      },
      valid: {
        isScoreInvalid: false,
        isContentInvalid: false
      }
    };
  }

  toggleRemoveComment() { // Toggle remove comment.
    var self = this;
    this.setState({
      isRemoveCommentOpened: !self.state.isRemoveCommentOpened
    });
  }

  toggleError() { // Toggle error message.
    this.setState({
      errorMessage: null
    });
  }

  displayRemoveComment(id) { // Display remove icon.
    this.setState({
      isRemoveCommentOpened: true,
      currentComment: id
    })
  }

  removeComment() { // Remove the comment.
    var self = this;
    const {t} = this.props;
    self.setState({
      isRemoveCommentOpened: false
    });
    self.props.removeCommentCallback(this.state.currentComment).catch(function(e) {
      self.setState({
        errorMessage: t('errorRemovingComment')
      });
    });
  }

  handleInputChange(e) { // Handle input change & set states.
    const target = e.target;
    var value = null,
      name = null;
    if ($(target).hasClass('will-be-active')) {
      var parentDiv = $(target).parent();
      var reactRater = $(parentDiv).parent();
      var children = reactRater.find('> div');
      value = children.index(parentDiv) + 1;
      name = reactRater.attr('name');
    } else {
      value = target.type === 'checkbox' ? target.checked : target.value;
      name = target.name;
    }

    this.setState({
      [name]: value
    });
  }

  toggleTooltip(name) { // Toggle tooltip.
    var tooltip = this.state.tooltip;
    tooltip[name] = !tooltip[name];
    this.setState({
      tooltip: tooltip
    });
  }

  navigateComment(e, name) { // Navigate.
    e.preventDefault();
    this._page = name;
    this.request['start_index'] = (name - 1) * this.request.count;
    this.refreshComments();
  }

  refreshComments() { // Refresh the comments.
    var self = this;
    self.setState({
      isCommentsLoading: true
    });
    self.props.searchCommentsCallback(self.request).then(function(obj) {
      self.displayComments(obj);
    }).catch(function() {
      self.setState({
        isCommentsLoading: false
      });
    });
  }

  addComment() { // Add a comment.
    var self = this,
      isContentInvalid  = false,
      isScoreInvalid = false,
      isValid = true;
    const {t} = this.props;
    console.log(self.state.score);
    // 1. Check rating exists
    if (self.state.score === 0) {
      isScoreInvalid = true;
      isValid = false;
    }

    // 2. Check content length doesn't exceed 255 characters.
    if (self.state.comment && self.state.comment.length > 255) {
      isContentInvalid = true;
      isValid = false;
    }

    if (!isValid) {
      self.setState({
        valid: {
          isContentInvalid: isContentInvalid,
          isScoreInvalid: isScoreInvalid
        }
      });
      return;
    }

    self.setState({
      valid: {
        isContentInvalid: isContentInvalid,
        isScoreInvalid: isScoreInvalid
      },
      isAddingComment: true
    });

    var json = {
      content: self.state.comment,
      score: self.state.score
    };

    self.props.addCommentCallback(json).then(function(e) {
      self.setState({
        isAddingComment: false
      });
    }).catch(function(error) {
      var json = error.responseJSON;
      var errorMessage = t('errorAddingComment');
      if (json) {
        errorMessage = json.error_description;
      }

      self.setState({
        errorMessage: errorMessage,
        isAddingComment: false
      });
    });
  }

  buildErrorTooltip(validName, description) { // Build the error tooltip.
    var result;
    if (this.state.valid[validName]) {
      result = (<span><i className="fa fa-exclamation-triangle txt-info" id={validName}></i>
      <Tooltip className="red-tooltip-inner" placement="right" target={validName} isOpen={this.state.tooltip[validName]} toggle={() => { this.toggleTooltip(validName); }}>
        {description}
      </Tooltip></span>);
    }

    return result;
  }

  displayComments(obj) { // Display comments.
    var comments = obj['_embedded'],
      navigations = obj['_links']['navigation'],
      self = this;
    if (!(comments instanceof Array)) {
      comments = [ comments ];
    }

    var subjects = [];
    comments.forEach(function(comment) {
      if (subjects.indexOf(comment.subject) === -1) {
        subjects.push(comment.subject);
      }
    });

    var getUserInfos = [];
    subjects.forEach(function(subject) {
      getUserInfos.push(UserService.getPublicClaims(subject));
    });

    Promise.all(getUserInfos).then(function(users) {
      comments.forEach(function(comment) {
        var user = null;
        users.forEach(function(u) {
          if (u.claims.sub == comment.subject) {
            user = u.claims;
            return;
          }
        });

        comment.user = user;
      });

      self.setState({
        comments: comments,
        navigations: navigations,
        isCommentsLoading: false
      });
    }).catch(function(e) {
      self.setState({
        isCommentsLoading: false
      });
    });
  }

  render() { // Render the view.
    var comments = [],
      navigations = [],
      self = this;
    const {t} = this.props;
    var scoreError = self.buildErrorTooltip('isScoreInvalid', t('scoreMandatoryError'));
    var commentError = self.buildErrorTooltip('isContentInvalid', t('commentContentError'));
    if (this.state.comments) {
      this.state.comments.forEach(function(comment) {
        var date = moment(comment.update_datetime).format('LLL');
        var picture = comment.user.picture;
        if (!picture)
        {
          picture = "/images/profile-picture.png";
        }

        comments.push((<div className={self.props.className + " comment"}>
          {comment.subject === self.state.subject && <div className="close-comment"><i className="fa fa-times" onClick={() => { self.displayRemoveComment(comment.id); }}></i></div> }
          <div className="content">
            <div className="row header">
              <div className="col-md-3">
                <img src={picture} className="rounded-circle" width="60" height="60" />
              </div>
              <div className="col-md-9">
                <b>{comment.user.name}</b><br />
                {date} <br />
                <Rater total={5} rating={comment.score} interactive={false} /> {t('score')} : {comment.score}
              </div>
            </div>
            <div className="message">
              <p>{comment.content}</p>
            </div>
          </div>
        </div>));
      });
    }

    if (this.state.navigations && this.state.navigations.length > 1) {
      this.state.navigations.forEach(function(nav) {
        navigations.push((<li className="page-item"><a href="#" className={self._page === nav.name ? "page-link active" : "page-link"} onClick={(e) => { self.navigateComment(e, nav.name); }}>{nav.name}</a></li>));
      });
    }

    return (
      <section className="row">
        <h5 className="col-md-12">{t('comments')}</h5>
        <div className="col-md-12"><Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert></div>
        {this.state.isCommentsLoading ?
          (<div className="col-md-12"><i className='fa fa-spinner fa-spin'></i></div>) :
          comments.length == 0 ? (<div className="col-md-12"><i><span>{t('noComment')}</span></i></div>) :
          (<div className="col-md-12">
            <div className="col-md-12">
              <ul className="pagination">
                {navigations}
              </ul>
            </div>
            <div className="col-md-12">
                <div className="row">
                  {comments}
                </div>
            </div>
          </div>)
        }
        {this.state.isAuthenticated &&
          (<div className="col-md-12">
            <div className="form-group">
              <label>{t('score')}</label> {scoreError}
              <Rater total={5} name="score" onClick={this.handleInputChange} />
            </div>
            <div className="form-group">
              <label>{t('comment')}</label> {commentError}
              <textarea className="form-control" placeholder={t('enterCommentPlaceholder')} name="comment" onChange={this.handleInputChange}/>
            </div>
            <div className="form-group">
              {!this.state.isAddingComment ?
                (<button className="btn btn-default" onClick={this.addComment}>{t('addComment')}</button>) :
                (<button className="btn btn-default previous" disabled><i className='fa fa-spinner fa-spin'></i> {t('processingUpdate')}</button>)
              }
            </div>
          </div>)
        }
        { /* Remove modal window */ }
        <Modal isOpen={this.state.isRemoveCommentOpened} size="lg">
          <ModalHeader toggle={this.toggleRemoveComment} className="redColor"><h2>{t('wantToRemoveComment')}</h2></ModalHeader>
          <ModalFooter>
            <Button color='default' onClick={this.removeComment}>{t('yes')}</Button>
            <Button color='default' onClick={this.toggleRemoveComment}>{t('no')}</Button>
          </ModalFooter>
        </Modal>
      </section>);
  }

  componentWillMount() { // Unregister events.
    var self = this;
    var user = ApplicationStore.getUser();

    if (user && user !== null && user.sub && user.sub !== null) {
      self.setState({
        isAuthenticated: true,
        subject: user.sub
      });
    }

    self._waitForToken = AppDispatcher.register(function (payload) {
      switch(payload.actionName) {
          case Constants.events.USER_LOGGED_IN:
            self.setState({
              isAuthenticated: true,
              subject: payload.data.sub
            });
          break;
      }
    });

    self.refreshComments();
  }

  componentWillUnmount() { // Remove the registration.
      AppDispatcher.unregister(this._waitForToken);
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(CommentLst);
