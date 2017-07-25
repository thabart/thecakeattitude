import React, {Component} from "react";
import Widget from "../components/widget";
import Service from "../services/ShopServices";
import moment from "moment";
import {Button} from 'reactstrap';
import Rater from "react-rater";
import $ from "jquery";
import { translate } from 'react-i18next';
import AppDispatcher from "../appDispatcher";

var daysMapping = {
    "0": "Monday",
    "1": "Tuesday",
    "2": "Wednesday",
    "3": "Thursday",
    "4": "Friday",
    "5": "Saturday",
    "6": "Sunday"
};

class ShopServices extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
        this.navigateService = this.navigateService.bind(this);
        this.localize = this.localize.bind(this);
        this.state = {
            isLoading: false
        };
    }

    localize(e, service) {
      e.preventDefault();
      e.stopPropagation();
      this.props.setCurrentMarker(service.shop_id);
    }

    navigate(e, name) {
        e.preventDefault();
        var startIndex = (name - 1) * 5;
        var request = $.extend({}, this.request, {
            start_index: startIndex
        });
        this.display(request);
    }

    navigateService(e, serviceId) {
        e.preventDefault();
        this.props.history.push('/services/' + serviceId);
    }

    reset() {
      this.setState({
          services: [],
          navigation: []
      });
    }

    refresh(json) {
        var request = $.extend({}, json, {
            orders: [
                {target: "total_score", method: 'desc'}
            ],
            from_datetime: moment().format(),
            to_datetime: moment().format(),
            count: 5
        });
        this.request = request;
        this.display(request);
    }

    display(request) {
        var self = this;
        self.setState({
            isLoading: true
        });
        Service.search(request).then(function (r) {
            var services = r['_embedded'],
                navigation = r['_links']['navigation'];
            if (!(services instanceof Array)) {
                services = [services];
            }

            if (!(navigation instanceof Array)) {
                navigation = [navigation];
            }

            self.setState({
                services: services,
                navigation: navigation,
                isLoading: false
            });
        }).catch(function () {
            self.setState({
                isLoading: false,
                services: [],
                navigation: []
            });
        });
    }

    enableMove(b) {
      this.refs.widget.enableMove(b);
    }

    render() {
        const {t} = this.props;
        var title = t('bestServicesWidgetTitle'),
            content = [],
            navigations = [],
            self = this;
        if (self.state.isLoading) {
            return (
                <Widget title={title} onClose={this.props.onClose} ref="widget">
                    <i className='fa fa-spinner fa-spin'></i>
                </Widget>);
        }

        if (self.state.services && self.state.services.length > 0) {
            self.state.services.forEach(function (service) {
                var image = "/images/default-shop-service.png";
                if (!service.images && service.images.length > 0) {
                    image = service.images[0];
                }

                var days = (<span>No occurrence</span>);
                if (service.occurrence.days && service.occurrence.days.length > 0) {
                    var list = $.map(service.occurrence.days, function (val) {
                        return (<li>{daysMapping[val]}</li>);
                    });
                    days = (<ul className="no-padding tags gray">{list}</ul>);
                }

                content.push((
                    <a key={service.id} href="#" className="list-group-item list-group-item-action no-padding"
                       onClick={(e) => {
                           self.navigateService(e, service.id);
                       }}>
                       <div className="first-column">
                           <img src={image} className="img-thumbnail rounded picture image-small"/>
                       </div>
                       <div className="second-column">
                        <div>{service.name}</div>
                        <div>
                            <Rater total={5} rating={service.average_score} interactive={false}/><i>{t('comments')}: {service.nb_comments}</i>
                        </div>
                        <div>
                          {days}
                        </div>
                       </div>
                       <div className="last-column">
                        <Button outline color="secondary" size="sm"  onClick={(e) => { self.localize(e, service); }}>
                          <i className="fa fa-map-marker localize" aria-hidden="true" onClick={(e) => { self.localize(e, service); }}></i>
                        </Button>
                       </div>
                    </a>));
            });
        }

        if (self.state.navigation && self.state.navigation.length > 1) {
            self.state.navigation.forEach(function (nav) {
                navigations.push((
                    <li key={nav.name} className="page-item"><a href="#" className="page-link" onClick={(e) => {
                        self.navigate(e, nav.name);
                    }}>{nav.name}</a></li>
                ));
            });
        }

        return (
            <Widget title={title} onClose={this.props.onClose} ref="widget">
                {navigations.length > 0 && (
                    <ul className="pagination">
                        {navigations}
                    </ul>
                )}
                {content.length == 0
                    ? (<span>No services</span>) :
                    (<ul className="list-group list-group-flush">
                        {content}
                    </ul>)
                }
            </Widget>
        );
    }

    componentDidMount() {
        var self = this;
        this._waitForToken = AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case 'new-service':
                case 'new-service-comment':
                case 'remove-service-comment':
                    var request = $.extend({}, self.request, {
                        start_index: 0
                    });
                    self.refresh(request);
                    break;
            }
        });
    }

    componentWillUnmount() {
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release, withRef: true })(ShopServices);
