import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { translate } from 'react-i18next';
import moment from "moment";
import $ from "jquery";

var daysMapping = {
    "0": "sunday",
    "1": "monday",
    "2": "tuesday",
    "3": "wednesday",
    "4": "thursday",
    "5": "friday",
    "6": "saturday",
}

class Description extends Component {
    constructor(props) {
        super(props);
    }

    render() { // Display the component.
        var occurrence = (<p></p>),
            self = this;
        const {t} = this.props;
        var days = null;
        if (self.props.service.occurrence && self.props.service.occurrence !== null) {
            if (self.props.service.occurrence.days && self.props.service.occurrence.days.length > 0) {
                var list = $.map(self.props.service.occurrence.days, function (val) {
                    return (<li>{t(daysMapping[val])}</li>);
                });
                days = (<ul className="no-padding tags gray inline">{list}</ul>);
            }
        }

        return (
            <div className="row">
                <div className="col-md-12">
                    <h5 className="title col-md-12">{t('description')}</h5>
                    <p className="col-md-12">{this.props.service.description}</p>
                    <h5 className="title col-md-12">{t('occurrence')}</h5>
                    <p className="col-md-12">
                        {days === null ? (<div><i>{t('noOccurrence')}</i></div>) : (
                          <div>
                            <div><span>{t('days')} </span>{days}</div>
                            <span className="badge badge-default">{t('fromToHours').replace('{0}', moment(self.props.service.occurrence.start_time, 'HH:mm:ss').format('LT')).replace('{1}', moment(self.props.service.occurrence.end_time, 'HH:mm:ss').format('LT'))}</span>
                          </div>
                        )}
                        <NavLink to={"/shops/" + self.props.service.shop_id + '/view/services/calendar'}>{t('viewCalendar')}</NavLink>
                    </p>
                </div>
            </div>
        );
    }
}

export default translate('common', { wait: process && !process.release })(Description);
