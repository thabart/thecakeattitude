import React, {Component} from "react";
import { CommentLst } from "../components";
import { ApplicationStore } from '../stores';
import { translate } from 'react-i18next';
import ShopServices from "../services/ShopServices";
import AppDispatcher from "../appDispatcher";
import Constants from '../../Constants';

class Comments extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
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

    componentDidMount() {
        var self = this;
        const {t} = this.props;
        self._waitForToken = AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                  case Constants.events.NEW_SERVICE_COMMENT_ARRIVED:
                    if (payload && payload.data && payload.data.service_id === self.props.service.id) {
                        ApplicationStore.sendMessage({
                            message: t('commentAdded'),
                            level: 'info',
                            position: 'tr'
                        });
                        self.refs.comments.getWrappedInstance().refreshComments();
                    }
                    break;
                  case Constants.events.REMOVE_SERVICE_COMMENT_ARRIVED:
                    if (payload && payload.data && payload.data.service_id === self.props.service.id) {
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

    componentWillUnmount() {
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(Comments);
