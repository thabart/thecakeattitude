import React, {Component} from "react";
import { CommentLst } from "../components";
import { ShopsService } from "../services/index";
import AppDispatcher from "../appDispatcher";
import Constants from '../../Constants';

class Comment extends Component {
    constructor(props) {
      super(props);
      this._waitForToken = null;
      this.removeCommentCallback = this.removeCommentCallback.bind(this);
      this.searchCommentsCallback = this.searchCommentsCallback.bind(this);
      this.addCommentCallback = this.addCommentCallback.bind(this);
    }

    searchCommentsCallback(json) { // Search comments.
      return ShopsService.searchComments(this.props.shop.id, json);
    }

    removeCommentCallback(comment) { // Remove comment.
      return ShopsService.removeComment(this.props.shop.id, comment);
    }

    addCommentCallback(comment) { // Add comment.
      comment['shop_id'] = this.props.shop.id;
      return ShopsService.addComment(comment);
    }

    render() { // Display the view.
        return (<div><CommentLst ref="comments" className="col-md-6" removeCommentCallback={this.removeCommentCallback}
                            searchCommentsCallback={this.searchCommentsCallback}
                            addCommentCallback={this.addCommentCallback}/>
                            </div>);
    }

    componentDidMount() { // Execute before the render.
        var self = this;
        this._waitForToken = AppDispatcher.register(function(payload) {
            switch (payload.actionName) {
                case Constants.events.NEW_COMMENT:
                case Constants.events.REMOVE_COMMENT:
                    if (payload && payload.data && payload.data.shop_id === self.props.shop.id) {
                        self.refs.comments.getWrappedInstance().refreshComments();
                    }
                    break;
            }
        });
    }

    componentWillUnmount() { // Unregister.
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default Comment;
