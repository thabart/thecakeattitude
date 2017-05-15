import React, {Component} from "react";
import Widget from "../components/widget";
import { AnnouncementsService } from '../services/index';
import $ from 'jquery';

class PublicAnnouncements extends Component {
    constructor(props) {
        super(props);
        this.navigate = this.navigate.bind(this);
        this.state = {
            errorMessage: null,
            isLoading: false,
            products: [],
            navigation: []
        };
    }
    refresh(json) {
        var request = $.extend({}, json, {
            orders: [
                {target: "update_datetime", method: "desc"}
            ],
            count: 5
        });
        this.request = request;
        this.display(request);
    }
    navigate(e, name) {
        e.preventDefault();
        var startIndex = name - 1;
        var request = $.extend({}, this.request, {
            start_index: startIndex
        });
        this.display(request);
    }
    display(request) {
        var self = this;
        self.setState({
            isLoading: true
        });
        AnnouncementsService.search(request).then(function (r) {
            console.log(r);
            var announcements = r['_embedded'],
                navigation = r['_links']['navigation'];
            if (!(announcements instanceof Array)) {
                announcements = [announcements];
            }
            if (!(navigation instanceof Array)) {
                navigation = [navigation];
            }

            self.setState({
                announcements: announcements,
                navigation: navigation,
                isLoading: false
            });
        }).catch(function () {
            self.setState({
                announcements: [],
                navigation: [],
                isLoading: false
            });
        });
    }
    render() {
        var title = "Public announcements";
        if (this.state.isLoading) {
            return (
                <Widget title={title}>
                    <i className='fa fa-spinner fa-spin'></i>
                </Widget>);
        }

        return (
            <Widget title={title}>
            </Widget>
        );
    }
    componentWillMount() {
        var self = this;
    }
}

export default PublicAnnouncements;
