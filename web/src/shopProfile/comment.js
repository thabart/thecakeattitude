import React, {Component} from "react";
import {CommentLst} from "../components";
import {ShopsService} from "../services/index";
import AppDispatcher from "../appDispatcher";

class Comment extends Component {
    constructor(props) {
        super(props);
        this.removeCommentCallback = this.removeCommentCallback.bind(this);
        this.searchCommentsCallback = this.searchCommentsCallback.bind(this);
        this.addCommentCallback = this.addCommentCallback.bind(this);
    }

    searchCommentsCallback(json) {
        return ShopsService.searchComments(this.props.shop.id, json);
    }

    removeCommentCallback(comment) {
        return ShopsService.removeComment(this.props.shop.id, comment);
    }

    addCommentCallback(comment) {
        comment['shop_id'] = this.props.shop.id;
        return ShopsService.addComment(comment);
    }

    render() {
        return (<CommentLst ref="comments" className="col-md-6" removeCommentCallback={this.removeCommentCallback}
                            searchCommentsCallback={this.searchCommentsCallback}
                            addCommentCallback={this.addCommentCallback}/>);
    }

    componentWillMount() {
        // Refresh the comments.
        var self = this;
        AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case 'new-shop-comment':
                case 'remove-shop-comment':
                    if (payload && payload.data && payload.data.shop_id === self.props.shop.id) {
                        self.refs.comments.refreshComments();
                        self.props.onRefreshScore();
                    }
                    break;
            }
        });
    }
}

export default Comment;
