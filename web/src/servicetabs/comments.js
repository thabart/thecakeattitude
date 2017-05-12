import React, { Component } from 'react';
import { CommentLst } from '../components';
import ShopServices from '../services/ShopServices';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.removeCommentCallback = this.removeCommentCallback.bind(this);
    this.searchCommentsCallback = this.searchCommentsCallback.bind(this);
    this.addCommentCallback = this.addCommentCallback.bind(this);
  }
  searchCommentsCallback(json) {
    return ShopServices.searchComments(this.props.service.id, json);
  }
  removeCommentCallback(comment) {
    return ShopServices.removeComment(this.props.service.id, comment);
  }
  addCommentCallback(comment) {
    comment['service_id'] = this.props.service.id;
    return ShopServices.addComment(comment);
  }
  render() {
    return (<CommentLst removeCommentCallback={this.removeCommentCallback} searchCommentsCallback={this.searchCommentsCallback} addCommentCallback={this.addCommentCallback} />);
  }
  componentWillMount() {
    // Refresh the comments.
    /*
    AppDispatcher.register(function(payload) {
      switch(payload.actionName) {
        case 'new-product-comment':
        case 'remove-product-comment':
          if (payload && payload.data && payload.data.product_id == self.props.product.id) {
            self.refreshComments();
            self.props.onRefreshScore();
          }
        break;
      }
    });
    */
  }
}

export default Comments;
