import React, {Component} from "react";
import {CommentLst} from "../components";
import ShopServices from "../services/ShopServices";
import AppDispatcher from "../appDispatcher";

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
        return (<CommentLst ref="comments" className="col-md-12" removeCommentCallback={this.removeCommentCallback}
                            searchCommentsCallback={this.searchCommentsCallback}
                            addCommentCallback={this.addCommentCallback}/>);
    }

    componentWillMount() {
        var self = this;
        // Refresh the comments.
        AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case 'new-service-comment':
                case 'remove-service-comment':
                    if (payload && payload.data && payload.data.service_id === self.props.service.id) {
                        self.refs.comments.refreshComments();
                        self.props.onRefreshScore(payload.data);
                    }
                    break;
            }
        });
    }
}

export default Comments;
