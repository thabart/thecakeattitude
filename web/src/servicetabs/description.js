import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { translate } from 'react-i18next';
import { EditableTextArea, EditableShopServicePlanning } from '../components';
import { EditServiceStore } from '../stores/index';
import { UncontrolledTooltip } from 'reactstrap';
import moment from "moment";
import $ from "jquery";
import AppDispatcher from "../appDispatcher";
import Constants from "../../Constants";

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
        this.updateDescription = this.updateDescription.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.state = {            
            isEditable : this.props.isEditable || false,
            service: this.props.service || {},
            tooltip: {
                toggleDescription: false
            }
        };
    }

    updateDescription(description) { // Update the description.
        var service = this.state.service;
        service.description = description;
        this.setState({
            service: service
        });
        AppDispatcher.dispatch({
            actionName: Constants.events.UPDATE_SERVICE_INFORMATION_ACT,
            data: { description: description }
        });
    }

    changeMode() { // Change the mode.
        var mode = EditServiceStore.getMode();
        this.setState({
            isEditable   : mode !== 'view'
        });
    }

    toggleTooltip(name) { // Toggle the tooltip.
        var tooltip = this.state.tooltip;
        tooltip[name] = !tooltip[name];
        this.setState({
            tooltip: tooltip
        });
    }

    render() { // Display the component.
        var occurrence = (<p></p>),
            self = this;
        const {t} = this.props;
        var days = null;
        if (self.state.service.occurrence && self.state.service.occurrence !== null) {
            if (self.state.service.occurrence.days && self.state.service.occurrence.days.length > 0) {
                var list = $.map(self.state.service.occurrence.days, function (val) {
                    return (<li>{t(daysMapping[val])}</li>);
                });
                days = (<ul className="no-padding tags gray inline">{list}</ul>);
            }
        }

        return (
            <div className="row">
                <div className="col-md-12">
                    {/* Description */}
                    {this.state.isEditable && (
                      <div>
                        <h5>
                          {t('description')} <i className="fa fa-info-circle txt-info" id="descriptionToolTip"></i>
                          <UncontrolledTooltip placement="right" target="descriptionToolTip" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleDescription} toggle={() => { this.toggleTooltip('toggleDescription'); }}>
                            {t('addShopServiceDescriptionTooltip')}
                          </UncontrolledTooltip>
                        </h5>
                        <EditableTextArea value={this.state.service.description} validate={this.updateDescription} minLength={1} maxLength={255} />
                      </div>
                    )}
                    {!this.state.isEditable && (
                      <div>
                        <h5>{t('description')}</h5>
                        <p>{this.state.service.description}</p>
                      </div>
                    )}
                    { this.state.isEditable && (
                        <div>
                            <h5>
                                {t('occurrence')}
                            </h5>
                            <EditableShopServicePlanning ref="shopServicePlanning" />
                        </div>
                    )}
                    { !this.state.isEditable && (
                        <div>
                            <h5>
                                {t('occurrence')}
                            </h5>
                            <p>
                                {days === null ? (<div><i>{t('noOccurrence')}</i></div>) : (
                                  <div>
                                    <div><span>{t('days')} </span>{days}</div>
                                    <span className="badge badge-default">{t('fromToHours').replace('{0}', moment(self.state.service.occurrence.start_time, 'HH:mm:ss').format('LT')).replace('{1}', moment(self.state.service.occurrence.end_time, 'HH:mm:ss').format('LT'))}</span>
                                  </div>
                                )}
                                <NavLink to={"/shops/" + self.state.service.shop_id + '/view/services/calendar'}>{t('viewCalendar')}</NavLink>
                            </p>
                        </div>
                    )}
                    
                </div>
            </div>
        );
    }

    componentWillMount() { // Execute before the render.
        EditServiceStore.addModeChangeListener(this.changeMode);
    }

    componentWillUnmount() { // Unregister the events.
        EditServiceStore.removeModeChangeListener(this.changeMode);
    }
}

export default translate('common', { wait: process && !process.release })(Description);
