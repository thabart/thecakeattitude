import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { translate } from 'react-i18next';
import { SessionService, ShopServices } from '../services/index';
import { ApplicationStore } from '../stores/index';
import moment from 'moment';
import Rater from "react-rater";
import $ from "jquery";
import "../styles/serviceElt.css";

var daysMapping = {
    "0": "sunday",
    "1": "monday",
    "2": "tuesday",
    "3": "wednesday",
    "4": "thursday",
    "5": "friday",
    "6": "saturday"
};

class ServiceElt extends Component {
    constructor(props) {
        super(props);
        this.remove = this.remove.bind(this);
        this.state = {
            shop: this.props.shop || {},
            isLoading: false
        };
    }    

    remove(e, serviceId) { // Remove the service.
      e.preventDefault();
      var self = this;
      const {t} = self.props;
      self.setState({
        isLoading: true
      });
      ShopServices.remove(serviceId).catch(function(e) {
          var json = e.responseJSON;
          var error = t('errorRemoveService');
          if (json && json.error_description) {
              error = json.error_description;
          }

          ApplicationStore.sendMessage({
            message: error,
            level: 'error',
            position: 'tr'
          });
          self.setState({
            isLoading: false
          });
      });
    }

    render() { // Returns the view.
        var imageUrl = "/images/default-shop-service.png",
            service = this.props.service,
            self = this;
        const {t} = this.props;
        if (service.images && service.images.length > 0) {
            imageUrl = service.images[0];
        }

        var days = null;
        if (service.occurrence && service.occurrence !== null) {
            if (service.occurrence.days && service.occurrence.days.length > 0) {
                var list = $.map(service.occurrence.days, function (val) {
                    return (<li>{t(daysMapping[val])}</li>);
                });
                days = (<ul className="tags gray inline">{list}</ul>);
            }
        }
        
        var isLoggedIn = SessionService.isLoggedIn();
        var user = ApplicationStore.getUser();
        var isOwner = false;
        if (isLoggedIn && user && this.state.shop) {
          isOwner = user.sub === this.state.shop.subject;
        }

        var description = service.description.length > 70 ? service.description.substring(0, 67) + "..." : service.description;
        return (
            <div className={this.props.className + " service-item"}>
              { this.state.isLoading && ( <div className="content"><i className='fa fa-spinner fa-spin'></i></div> ) }
              { !this.state.isLoading && (
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
                          <h4>€ {service.price}</h4>
                          {days === null ? (<div><i>{t('noOccurrence')}</i></div>) : (
                            <div>
                              <div><span>{t('days')} </span>{days}</div>
                              <span className="badge badge-default">{t('fromToHours').replace('{0}', moment(service.occurrence.start_time, 'HH:mm:ss').format('LT')).replace('{1}', moment(service.occurrence.end_time, 'HH:mm:ss').format('LT'))}</span>
                            </div>
                          )}
                          { isOwner && ( <a href="#" className="btn btn-default" onClick={(e) => this.remove(e, service.id)}>{t('remove')}</a>) }
                        </div>
                    </NavLink>
                  </div>
              )}
            </div>
        )
    }
}

export default translate('common', { wait: process && !process.release })(ServiceElt);
