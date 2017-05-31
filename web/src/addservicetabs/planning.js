import React, {Component} from "react";
import {Tooltip} from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import moment from "moment";
import '../styles/rc-time-picker.css';
import TimePicker from 'rc-time-picker';

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
              <i className="fa fa-exclamation-triangle validation-error" id={validName}></i>
              <Tooltip placement="right" target={validName} isOpen={this.state.tooltip[validName]} toggle={() => {
                  this.toggleTooltip(validName);
              }}>
                {description}
              </Tooltip>
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
      start_date: self.state.startDate.format(),
      end_date: self.state.endDate.format(),
      days: self.state.days
    };
    if (this.props.onNext) this.props.onNext(json);
  }
  previous() {
    if (this.props.onPrevious) this.props.onPrevious();
  }
  render() {
    var daysError = this.buildErrorTooltip('isDaysInvalid', 'At least one day should be selected'),
      datePeriodError = this.buildErrorTooltip('isDatePeriodInvalid', 'Period is invalid : start < end AND end > now'),
      timePeriodError = this.buildErrorTooltip('isTimePeriodInvalid', 'Time period is invalid : start < end');
    return (<div>
      <section className="row">
          {/* Information */ }
          <div className='form-group col-md-12'>
            <p><i className="fa fa-exclamation-triangle"></i> Specify the occurence of your service. For example : <i>Repare your shoes</i>
            <ul className="no-padding tags gray">
              <li>Monday</li>
              <li>Wednesday</li>
            </ul></p>
          </div>
          {/* Time period */}
          <div className="form-group col-md-12">
            <label className="form-label">Time period</label> <i className="fa fa-exclamation-circle" id="timePeriodTooltip"></i>
            <Tooltip placement="right" target="timePeriodTooltip" isOpen={this.state.tooltip.toggleTimePeriodTooltip} toggle={() => { this.toggleTooltip('toggleTimePeriodTooltip'); }}>
              Time period
            </Tooltip> {timePeriodError}
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">From time</label>
                <TimePicker value={this.state.startTime} onChange={this.handleChangeStartTime} />
              </div>
              <div className="col-md-6">
                <label className="form-label">To time</label>
                <TimePicker value={this.state.endTime} onChange={this.handleChangeEndTime} />
              </div>
            </div>
          </div>
          {/* Date period */}
          <div className="form-group col-md-12">
            <label className="form-label">Date period</label> <i className="fa fa-exclamation-circle" id="datePeriodTooltip"></i>
            <Tooltip placement="right" target="datePeriodTooltip" isOpen={this.state.tooltip.toggleDatePeriodTooltip} toggle={() => { this.toggleTooltip('toggleDatePeriodTooltip'); }}>
              Date period
            </Tooltip> {datePeriodError}
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">From date</label>
                <DatePicker selected={this.state.startDate}
                            selectsStart
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeStartDate}
                            className="form-control"
                            placeholderText="Start date" />
              </div>
              <div className="col-md-6">
                <label className="form-label">To date</label>
                <DatePicker selected={this.state.endDate}
                            selectsEnd
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeEndDate}
                            className="form-control"
                            placeholderText="End date" />
              </div>
            </div>
          </div>
          {/* Days */}
          <div className="form-group col-md-12">
            <label className="form-label">Days</label> <i className="fa fa-exclamation-circle" id="daysTooltip"></i>
            <Tooltip placement="right" target="daysTooltip" isOpen={this.state.tooltip.toggleDaysTooltip} toggle={() => { this.toggleTooltip('toggleDaysTooltip'); }}>
              Days
            </Tooltip>  {daysError}
            <div className="list-group">
            <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 0); }}>
                {this.state.days.includes(0) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                Monday
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 1); }}>
                {this.state.days.includes(1) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                Tuesday
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 2); }}>
                {this.state.days.includes(2) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                Wednesday
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 3); }}>
                {this.state.days.includes(3) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                Thursday
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 4); }}>
                {this.state.days.includes(4) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                Friday
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 5); }}>
                {this.state.days.includes(5) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                Saturday
              </a>
              <a href="#" className='list-group-item list-group-item-action active-payment' onClick={(e) => { this.toggleDays(e, 6); }}>
                {this.state.days.includes(6) ? (<div className="checkbox-container"><i className="fa fa-check checkbox"></i></div>) : ''}
                Sunday
              </a>
            </div>
          </div>
      </section>
      <section className="col-md-12 sub-section">
          <button className="btn btn-primary previous" onClick={this.previous}>Previous</button>
          <button className="btn btn-success next" onClick={this.validate}>Confirm</button>
      </section>
  </div>);
  }
}

export default PlanningTab;
