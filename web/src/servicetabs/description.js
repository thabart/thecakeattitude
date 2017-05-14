import React, {Component} from "react";
import moment from "moment";
import $ from "jquery";
import {NavLink} from "react-router-dom";

var daysMapping = {
    "0": "Monday",
    "1": "Tuesday",
    "2": "Wednesday",
    "3": "Thursday",
    "4": "Friday",
    "5": "Saturday",
    "6": "Sunday"
}

class Description extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var occurrence = (<p></p>),
            self = this;
        if (self.props.service.occurrence && self.props.service.occurrence !== null) {
            var days = (<span>No occurrence</span>);
            if (self.props.service.occurrence.days && self.props.service.occurrence.days.length > 0) {
                var list = $.map(self.props.service.occurrence.days, function (val) {
                    return (<li>{daysMapping[val]}</li>);
                });
                days = (<ul className="no-padding tags gray">{list}</ul>);
            }

            occurrence = (<table className="table table-striped">
                <tr>
                    <td>Start</td>
                    <td>{moment(self.props.service.occurrence.start_datetime).format('LLL')}</td>
                </tr>
                <tr>
                    <td>End</td>
                    <td>{moment(self.props.service.occurrence.end_datetime).format('LLL')}</td>
                </tr>
                <tr>
                    <td colSpan="2">{days}</td>
                </tr>
            </table>);
        }

        return (
            <div className="row">
                <div className="col-md-12">
                    <h5 className="title col-md-12">Description</h5>
                    <p className="col-md-12">{this.props.service.description}</p>
                    <h5 className="title col-md-12">Occurrence</h5>
                    <p className="col-md-12">
                        <NavLink to={"/shops/" + self.props.service.shop_id + '/services/calendar'}>View
                            Calendar</NavLink>
                        {occurrence}
                    </p>
                </div>
            </div>
        );
    }
}

export default Description;
