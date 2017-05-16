import React, {Component} from "react";
import {CommentLst} from "../components";
import {ProductsService} from "../services/index";
import AppDispatcher from "../appDispatcher";

class ProductComment extends Component {
    constructor(props) {
        super(props);
        this.removeCommentCallback = this.removeCommentCallback.bind(this);
        this.searchCommentsCallback = this.searchCommentsCallback.bind(this);
        this.addCommentCallback = this.addCommentCallback.bind(this);
    }

    searchCommentsCallback(json) {
        return ProductsService.searchComments(this.props.product.id, json);
    }

    removeCommentCallback(comment) {
        return ProductsService.removeComment(this.props.product.id, comment);
    }

    addCommentCallback(comment) {
        comment['product_id'] = this.props.product.id;
        return ProductsService.addComment(comment);
    }

    render() {
        return (<CommentLst ref="comments" className="col-md-12" removeCommentCallback={this.removeCommentCallback}
                            searchCommentsCallback={this.searchCommentsCallback}
                            addCommentCallback={this.addCommentCallback}/>);
    }

    componentWillMount() {
        // Refresh the comments.
        var self = this;
        AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case 'new-product-comment':
                case 'remove-product-comment':
                    if (payload && payload.data && payload.data.product_id == self.props.product.id) {
                        self.refs.comments.refreshComments();
                        self.props.onRefreshScore(payload.data);
                    }
                    break;
            }
        });
    }
}

export default ProductComment;
