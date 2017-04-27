import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import { CommentsService, UserService, SessionService, ShopsService } from '../services';
import Promise from 'bluebird';
import moment from 'moment';
import Rater from 'react-rater';
import Constants from '../../Constants';
import './comment.css';
import $ from 'jquery';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.navigateComment = this.navigateComment.bind(this);
    this.addComment = this.addComment.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      comments: [],
      navigations: [],
      isCommentsLoading: false,
      comment: '',
      rating: 0,
      isContentInvalid: false,
      isRatingInvalid: false,
      isAuthenticated: false,
      tooltip: {
        isRatingInvalid: false,
        isContentInvalid: false
      },
      valid: {
        isRatingInvalid: false,
        isContentInvalid: false
      }
    };
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
  // Add a comment
  addComment() {
    var self = this,
      isContentInvalid  = false,
      isRatingInvalid = false,
      isValid = true;
    // 1. Check rating exists
    if (self.state.rating === 0) {
      isRatingInvalid = true;
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
          isRatingInvalid: isRatingInvalid
        }
      });
      return;
    }

    self.setState({
      valid: {
        isContentInvalid: isContentInvalid,
        isRatingInvalid: isRatingInvalid
      }
    });
    var json = {
      content: self.state.comment,
      score: self.state.rating,
      shop_id: self.props.shop.id
    };
    ShopsService.addComment(json).then(function() {

    }).catch(function(error) {

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
    var ratingError = self.buildErrorTooltip('isRatingInvalid', 'Rating is mandatory');
    var commentError = self.buildErrorTooltip('isContentInvalid', 'Should contains 0 to 255 characters');
    if (this.state.comments) {
      this.state.comments.forEach(function(comment) {
        var date = moment(comment.update_datetime).format('LLL');
        var picture = comment.user.picture;
        if (!picture) {
          picture = "/images/profile-picture.png";
        } else {
          picture = Constants.openIdUrl + picture;
        }

        comments.push((<div className="col-md-6">
          <div className="comment">
            <div className="row header">
              <div className="col-md-3">
                <img src={picture} className="rounded-circle" width="60" height="60" />
              </div>
              <div className="col-md-9">
                <b>{comment.user.name}</b><br />
                {date}<br />
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

    if (this.state.navigations) {
      this.state.navigations.forEach(function(nav) {
        navigations.push((<li className="page-item"><a href="#" className="page-link" onClick={(e) => { self.navigateComment(e, nav.href); }}>{nav.name}</a></li>));
      });
    }

    console.log(this.state.isAuthenticated);
    return (
      <section className="row white-section shop-section shop-section-padding">
        <h5 className="col-md-12">Comments</h5>
        {this.state.isCommentsLoading ?
          (<div className="col-md-12"><i className='fa fa-spinner fa-spin'></i></div>) :
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
              <label>Score</label>
              <Rater total={5} name="rating"  onClick={this.handleInputChange} /> {ratingError}
            </div>
            <div className="form-group">
              {commentError}
              <textarea className="form-control" placeholder="Your comment ..." name="comment" onChange={this.handleInputChange}/>
            </div>
            <div className="form-group">
              <button className="btn btn-default" onClick={this.addComment}>Add</button>
            </div>
          </div>)
        }
      </section>);
  }
  // Execute after the render
  componentWillMount() {
    var self = this;
    self.setState({
      isCommentsLoading: true,
      isAuthenticated: SessionService.isLoggedIn()
    });
    CommentsService.search({ shop_id: this.props.shop.id, count: 4 }).then(function(obj) {
      self.displayComments(obj);
    }).catch(function() {
      self.setState({
        isCommentsLoading: false,
        isAuthenticated: SessionService.isLoggedIn()
      });
    });
  }
}


export default Comment;
