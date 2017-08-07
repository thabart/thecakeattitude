import React, {Component} from "react";
import { CommentLst } from "../components";
import { ProductsService } from "../services/index";
import { ApplicationStore } from '../stores';
import { translate } from 'react-i18next';
import Constants from '../../Constants';
import AppDispatcher from "../appDispatcher";

class ProductComment extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
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

    componentWillMount() { // Execute before the render.
        var self = this;
        const {t} = this.props;
        self._waitForToken = AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case Constants.events.NEW_PRODUCT_COMMENT_ARRIVED:
                    if (payload && payload.data && payload.data.product_id == self.props.product.id) {
                        ApplicationStore.sendMessage({
                            message: t('commentAdded'),
                            level: 'info',
                            position: 'tr'
                        });
                        self.refs.comments.getWrappedInstance().refreshComments();
                    }
                    break;
                case Constants.events.REMOVE_PRODUCT_COMMENT_ARRIVED:
                    if (payload && payload.data && payload.data.product_id == self.props.product.id) {
                        ApplicationStore.sendMessage({
                            message: t('commentRemoved'),
                            level: 'info',
                            position: 'tr'
                        });
                        self.refs.comments.getWrappedInstance().refreshComments();
                    }
                  break;
            }
        });
    }

  componentWillUnmount() { // Remove listener.
      AppDispatcher.unregister(this._waitForToken);
  }
}

export default translate('common', { wait: process && !process.release })(ProductComment);
