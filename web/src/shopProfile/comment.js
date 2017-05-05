import React, { Component } from 'react';
import { Tooltip, Alert, Modal, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { CommentsService, UserService, SessionService, ShopsService, OpenIdService } from '../services';
import { withRouter } from 'react-router';
import Promise from 'bluebird';
import moment from 'moment';
import Rater from 'react-rater';
import Constants from '../../Constants';
import './comment.css';
import $ from 'jquery';
import AppDispatcher from '../appDispatcher';

class Comment extends Component {
  constructor(props) {
    super(props);
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
  // Toggle remove modal window
  toggleRemoveComment() {
    var self = this;
    this.setState({
      isRemoveCommentOpened: !self.state.isRemoveCommentOpened
    });
  }
  // Toggle the error
  toggleError() {
    this.setState({
      errorMessage: null
    });
  }
  // Remove the comment
  displayRemoveComment(id) {
    this.setState({
      isRemoveCommentOpened: true,
      currentComment: id
    })
  }
  // Remove the selected comment
  removeComment() {
    var self = this;
    self.setState({
      isRemoveCommentOpened: false
    });
    ShopsService.removeComment(this.props.shop.id, this.state.currentComment).then(function() {
      self.refreshComments();
      self.props.onRefreshScore();
    }).catch(function(e) {
      var json = e.responseJSON;
      var error = "an error occured while trying to remove the comment";
      if (json) {
        error = json.error_description;
      }

      self.setState({
        errorMessage: error
      });
    });
  }
  // Handle all input change which occures in the view.
  handleInputChange(e) {
    const target = e.target;
    var value = null,
      name = null;
    if ($(target).hasClass('will-be-active')) {
      var parent = $(target).parent();
      var children = parent.find('a');
      value = children.index(target) + 1;
      name = parent.attr('name');
    } else {
      value = target.type === 'checkbox' ? target.checked : target.value;
      name = target.name;
    }

    this.setState({
      [name]: value
    });
  }
  // Toggle the tooltip
  toggleTooltip(name) {
    var tooltip = this.state.tooltip;
    tooltip[name] = !tooltip[name];
    this.setState({
      tooltip: tooltip
    });
  }
  // Navigate between comments
  navigateComment(e, href) {
    e.preventDefault();
    var self = this;
    self.setState({
      isCommentsLoading: true
    })
    $.get(Constants.apiUrl + href).then(function(obj) {
      self.displayComments(obj);
    });
  }
  // Refresh comments
  refreshComments() {
    var self = this;
    self.setState({
      isCommentsLoading: true
    });
    CommentsService.search({ shop_id: this.props.shop.id, count: 4 }).then(function(obj) {
      self.displayComments(obj);
    }).catch(function() {
      self.setState({
        isCommentsLoading: false
      });
    });
  }
  // Add a comment
  addComment() {
    var self = this,
      isContentInvalid  = false,
      isScoreInvalid = false,
      isValid = true;
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
      score: self.state.score,
      shop_id: self.props.shop.id
    };
    ShopsService.addComment(json).then(function(e) {
      self.setState({
        isAddingComment: false
      });
    }).catch(function(error) {
      var json = error.responseJSON;
      var errorMessage = "an error occured while trying to add the comment";
      if (json) {
        errorMessage = json.error_description;
      }

      self.setState({
        errorMessage: errorMessage,
        isAddingComment: false
      });
    });
  }
  // Build error tooltip
  buildErrorTooltip(validName, description) {
    var result;
    if (this.state.valid[validName]) {
      result = (<span><i className="fa fa-exclamation-triangle validation-error" id={validName}></i>
      <Tooltip placement="right" target={validName} isOpen={this.state.tooltip[validName]} toggle={() => { this.toggleTooltip(validName); }}>
        {description}
      </Tooltip></span>);
    }

    return result;
  }
  // Display comments
  displayComments(obj) {
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
          if (u.sub == comment.subject) {
            user = u;
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
  // Render the view
  render() {
    var comments = [],
      navigations = [],
      self = this;
    var scoreError = self.buildErrorTooltip('isScoreInvalid', 'Score is mandatory');
    var commentError = self.buildErrorTooltip('isContentInvalid', 'Should contains 0 to 255 characters');
    if (this.state.comments) {
      this.state.comments.forEach(function(comment) {
        var date = moment(comment.update_datetime).format('LLL');
        var picture = comment.user.picture;
        if (!picture)
        {
          picture = "/images/profile-picture.png";
        }
        else
        {
          picture = Constants.openIdUrl + picture;
        }

        comments.push((<div className="col-md-6">
          {comment.subject === self.state.subject && <div className="close-comment"><i className="fa fa-times" onClick={() => { self.displayRemoveComment(comment.id); }}></i></div> }
          <div className="element">
            <div className="row header">
              <div className="col-md-3">
                <img src={picture} className="rounded-circle" width="60" height="60" />
              </div>
              <div className="col-md-9">
                <b>{comment.user.name}</b><br />
                {date} <br />
                <Rater total={5} rating={comment.score} interactive={false} /> Score : {comment.score}
              </div>
            </div>
            <div className="content">
              <p>{comment.content}</p>
            </div>
          </div>
        </div>));
      });
    }

    if (this.state.navigations && this.state.navigations.length > 1) {
      this.state.navigations.forEach(function(nav) {
        navigations.push((<li className="page-item"><a href="#" className="page-link" onClick={(e) => { self.navigateComment(e, nav.href); }}>{nav.name}</a></li>));
      });
    }

    return (
      <section className="row white-section shop-section shop-section-padding">
        <h5 className="col-md-12">Comments</h5>
        <div className="col-md-12"><Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert></div>
        {this.state.isCommentsLoading ?
          (<div className="col-md-12"><i className='fa fa-spinner fa-spin'></i></div>) :
          comments.length == 0 ? (<span>No comment</span>) :
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
              <label>Score</label> {scoreError}
              <Rater total={5} name="score" onClick={this.handleInputChange} />
            </div>
            <div className="form-group">
              <label>Comment</label> {commentError}
              <textarea className="form-control" placeholder="Your comment ..." name="comment" onChange={this.handleInputChange}/>
            </div>
            <div className="form-group">
              {!this.state.isAddingComment ?
                (<button className="btn btn-primary" onClick={this.addComment}>Add</button>) :
                (<button className="btn btn-primary previous" disabled><i className='fa fa-spinner fa-spin'></i> Processing update ...</button>)
              }
            </div>
          </div>)
        }
        <Modal isOpen={this.state.isRemoveCommentOpened}>
          <ModalHeader toggle={this.toggleRemoveComment}>Do-you want to remove the comment ?</ModalHeader>
          <ModalFooter>
            <Button color='success' onClick={this.removeComment}>Yes</Button>
            <Button color='danger' onClick={this.toggleRemoveComment}>No</Button>
          </ModalFooter>
        </Modal>
      </section>);
  }
  // Execute after the render
  componentWillMount() {
    var self = this;
    // Refresh the comments.
    AppDispatcher.register(function(payload) {
      switch(payload.actionName) {
        case 'new-comment':
        case 'remove-comment':
          if (payload && payload.data && payload.data.shop_id == self.props.shop.id) {
            self.refreshComments();
            self.props.onRefreshScore();
          }
        break;
      }
    });
    var session = SessionService.getSession();
    if (session || session !== null) {
      OpenIdService.introspect(session.access_token).then(function(introspect) {
        if (introspect && introspect.active) {
          self.setState({
            isAuthenticated: true,
            subject: introspect.sub
          });
        }
        else {
          SessionService.remove();
        }
      }).catch(function() {
        SessionService.remove();
        return;
      });
    }

    self.refreshComments();
  }
}

export default withRouter(Comment);
