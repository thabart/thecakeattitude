import React, {Component} from "react";
import { UncontrolledTooltip, FormGroup, FormFeedback, Label } from 'reactstrap';
import { translate } from 'react-i18next';
import DatePicker from "react-datepicker";
import TimePicker from 'rc-time-picker';
import moment from "moment";

class PlanningTab extends Component {
  constructor(props) {
    super(props);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.toggleDays = this.toggleDays.bind(this);
    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
    this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
    this.validate = this.validate.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      valid : true,
      days: [0, 1, 2, 3, 4, 5, 6],
      startTime: moment('08:00:00', 'HH:mm:ss'),
      endTime:  moment('23:00:00', 'HH:mm:ss'),
      startDate: moment(),
      endDate: moment().add(2, 'months'),
      tooltip: {
        toggleTimePeriodTooltip: false,
        toggleDatePeriodTooltip: false,
        toggleDaysTooltip: false
      },
      valid: {
        isDaysInvalid: false,
        isDatePeriodInvalid: false,
        isTimePeriodInvalid: false
      }
    };
  }

  toggleTooltip(name) {
      var tooltip = this.state.tooltip;
      tooltip[name] = !tooltip[name];
      this.setState({
          tooltip: tooltip
      });
  }

  toggleDays(e, day) {
    e.preventDefault();
    var days = this.state.days.slice(0);
    if (days.includes(day)) {
      var index = days.indexOf(day);
      days.splice(index, 1);
    }
    else {
      days.push(day);
    }

    this.setState({
      days: days
    });
  }

  handleChangeStartDate(date) {
      this.setState({
          startDate: date
      });
  }

  handleChangeEndDate(date) {
      this.setState({
          endDate: date
      });
  }

  handleChangeStartTime(time) {
      this.setState({
        startTime: time
      });
  }

  handleChangeEndTime(time) {
      this.setState({
        endTime: time
      });
  }

  buildErrorTooltip(validName, description) {
      var result;
      if (this.state.valid[validName]) {
          result = (
            <span>
                {description}
            </span> );
      }

      return result;
  }

  validate() {
    var self = this,
      valid = self.state.valid,
      isValid = true;
    // Check at least one days is checked.
    if (!self.state.days || self.state.days.length === 0) {
      valid.isDaysInvalid = true;
      isValid = false;
    } else {
      valid.isDaysInvalid = false;
    }

    // Check date.
    var startDate = self.state.startDate.toDate(),
      endDate = self.state.endDate.toDate(),
      now = moment().toDate();
    if (now > endDate || startDate > endDate) {
      isValid = false;
      valid.isDatePeriodInvalid = true;
    } else {
      valid.isDatePeriodInvalid = false;
    }

    var startTime = self.state.startTime,
      endTime = self.state.endTime;
    if (startTime > endTime) {
      isValid = false;
      valid.isTimePeriodInvalid = true;
    } else {
      valid.isTimePeriodInvalid = false;
    }

    this.setState({
      valid: valid
    });

    if (!isValid) {
      return;
    }

    var json = {
      start_time: startTime.format('HH:mm:ss'),
      end_time: endTime.format('HH:mm:ss'),
      start_date: self.state.startDate.format('YYYY-MM-DD'),
      end_date: self.state.endDate.format('YYYY-MM-DD'),
      days: self.state.days
    };
    if (this.props.onNext) this.props.onNext(json);
  }

  previous() {
    if (this.props.onPrevious) this.props.onPrevious();
  }

  render() { // Render the component.
    const {t} = this.props;
    var daysError = this.buildErrorTooltip('isDaysInvalid', t('oneSelectedDayError')),
      datePeriodError = this.buildErrorTooltip('isDatePeriodInvalid', t('periodInvalidError')),
      timePeriodError = this.buildErrorTooltip('isTimePeriodInvalid', t('timePeriodInvalidError'));
    return (<div className="container bg-white rounded">
      <section className="row p-1">
        <div className="col-md-12">
          {/* Information */ }
          <FormGroup>
            <p dangerouslySetInnerHTML={{__html: t('addShopServiceOccurrenceDescription')}}></p>
            <ul className="no-padding tags gray">
              <li>{t('monday')}</li>
              <li>{t('wednesday')}</li>
            </ul>
          </FormGroup>
          {/* Time period */}
          <FormGroup>
            <Label className="col-form-label">{t('timePeriod')} <i className="fa fa-info-circle txt-info" id="timePeriodTooltip"></i></Label>
            <UncontrolledTooltip className="red-tooltip-inner" placement="right" target="timePeriodTooltip" isOpen={this.state.tooltip.toggleTimePeriodTooltip} toggle={() => { this.toggleTooltip('toggleTimePeriodTooltip'); }}>
              {t('addShopServiceOccurrenceTimePeriodTooltip')}
            </UncontrolledTooltip>
            <FormFeedback>{timePeriodError}</FormFeedback>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">{t('fromTime')}</label>
                <TimePicker value={this.state.startTime} onChange={this.handleChangeStartTime} />
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('toTime')}</label>
                <TimePicker value={this.state.endTime} onChange={this.handleChangeEndTime} />
              </div>
            </div>
          </FormGroup>
          {/* Date period */}
          <FormGroup>
            <Label className="col-form-label">
              {t('datePeriod')} <i className="fa fa-info-circle txt-info" id="datePeriodTooltip"></i>
            </Label>
            <UncontrolledTooltip className="red-tooltip-inner" placement="right" target="datePeriodTooltip" isOpen={this.state.tooltip.toggleDatePeriodTooltip} toggle={() => { this.toggleTooltip('toggleDatePeriodTooltip'); }}>
              {t('addShopServiceOccurrenceDatePeriodTooltip')}
            </UncontrolledTooltip>
            <FormFeedback>{datePeriodError}</FormFeedback>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">{t('fromDate')}</label>
                <DatePicker selected={this.state.startDate}
                            selectsStart
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeStartDate}
                            className="form-control"
                            placeholderText={t('fromDate')} />
              </div>
              <div className="col-md-6">
                <label className="form-label">{t('toDate')}</label>
                <DatePicker selected={this.state.endDate}
                            selectsEnd
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeEndDate}
                            className="form-control"
                            placeholderText={t('toDate')} />
              </div>
            </div>
          </FormGroup>
          {/* Days */}
          <FormGroup>
            <Label className="col-form-label">
              {t('days')} <i className="fa fa-info-circle txt-info" id="daysTooltip"></i>
            </Label>
            <UncontrolledTooltip className="red-tooltip-inner" placement="right" target="daysTooltip" isOpen={this.state.tooltip.toggleDaysTooltip} toggle={() => { this.toggleTooltip('toggleDaysTooltip'); }}>
              {t('addShopServiceOccurrenceDaysTooltip')}
            </UncontrolledTooltip>
            {daysError}
            { /* Days */ }
            <div className="list-group">
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 0); }}>
                {this.state.days.includes(0) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                {t('sunday')}
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 1); }}>
                {this.state.days.includes(1) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                {t('monday')}
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 2); }}>
                {this.state.days.includes(2) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                {t('tuesday')}
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 3); }}>
                {this.state.days.includes(3) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                {t('wednesday')}
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 4); }}>
                {this.state.days.includes(4) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                {t('thursday')}
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 5); }}>
                {this.state.days.includes(5) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                {t('friday')}
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 6); }}>
                {this.state.days.includes(6) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                {t('saturday')}
              </a>
            </div>
          </FormGroup>
        </div>
      </section>
      <section className="row p-1">
          <button className="btn btn-default" onClick={this.previous}>{t('previous')}</button>
          <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={this.validate}>{t('confirm')}</button>
      </section>
  </div>);
  }
}

export default translate('common', { wait: process && !process.release })(PlanningTab);
