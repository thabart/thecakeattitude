import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { translate } from 'react-i18next';
import Rater from "react-rater";
import $ from "jquery";
import "../styles/serviceElt.css";

var daysMapping = {
    "0": "monday",
    "1": "tuesday",
    "2": "wednesday",
    "3": "thursday",
    "4": "friday",
    "5": "saturday",
    "6": "sunday"
};

class ServiceElt extends Component {
    constructor(props) {
        super(props);
    }

    render() { // Returns the view.
        var imageUrl = "/images/default-shop-service.png",
            service = this.props.service,
            occurrence = null,
            self = this;
        const {t} = this.props;
        if (service.images && service.images.length > 0) {
            imageUrl = service.images[0];
        }

        if (service.occurrence && service.occurrence !== null) {
            var days = (<span>{t('noOccurrence')}</span>);
            if (service.occurrence.days && service.occurrence.days.length > 0) {
                var list = $.map(service.occurrence.days, function (val) {
                    return (<li>{t(daysMapping[val])}</li>);
                });
                days = (<ul className="tags gray">{list}</ul>);
            }

            // TODO :  TRANSLATE THE DAYS
            occurrence = (<table>
                <tr>
                    <td colSpan="2">{days}</td>
                </tr>
            </table>);
        }

        var description = service.description.length > 70 ? service.description.substring(0, 67) + "..." : service.description;
        return (
            <div className={this.props.className + " service-item"}>
              <div className="content">
                <NavLink className="no-decoration row" to={'/services/' + service.id}>
                    <div className="col-md-3">
                        <img src={imageUrl} className="rounded" width="140" height="140"/>
                    </div>
                    <div className="col-md-4">
                        <h3>{service.name}</h3>
                        <Rater total={5} rating={service.average_score}
                               interactive={false}/>{service.comments && service.comments.length > 0 && (
                        <label>{t('comments')} : {service.nb_comments}</label>)}
                        <p style={{wordBreak: "break-all"}}>
                            {description}
                        </p>
                    </div>
                    <div className="col-md-5">
                      <h4 className="price">€ {service.price}</h4>
                      {occurrence}
                    </div>
                </NavLink>
              </div>
            </div>
        )
    }
}

export default translate('common', { wait: process && !process.release })(ServiceElt);
