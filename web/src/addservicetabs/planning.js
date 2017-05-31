import React, {Component} from "react";
import {Tooltip} from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import moment from "moment";
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';

class PlanningTab extends Component {
  constructor(props) {
    super(props);
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.toggleDays = this.toggleDays.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
    this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
    this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
    this.validate = this.validate.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      days: [0, 1, 2, 3, 4, 5, 6],
      startTime: moment('08:00:00', 'HH:mm:ss'),
      endTime:  moment('23:00:00', 'HH:mm:ss'),
      startDate: moment(),
      endDate: moment().add(2, 'months'),
      tooltip: {
        toggleTimePeriodTooltip: false,
        toggleDatePeriodTooltip: false,
        toggleDaysTooltip: false
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
  handleChangeStart(date) {
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
  validate() {

  }
  previous() {
    if (this.props.onPrevious) this.props.onPrevious();
  }
  render() {
    return (<div>
      <section className="row">
          <div className='form-group col-md-12'>
            <p><i className="fa fa-exclamation-triangle"></i> Specify the occurence of your service. For example : <i>Repare your shoes : monday, tuesday</i></p>
          </div>
          <div className="form-group col-md-12">
            <label className="form-label">Time period</label> <i className="fa fa-exclamation-circle" id="timePeriodTooltip"></i>
            <Tooltip placement="right" target="timePeriodTooltip" isOpen={this.state.tooltip.toggleTimePeriodTooltip} toggle={() => { this.toggleTooltip('toggleTimePeriodTooltip'); }}>
              Time period
            </Tooltip>
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
          <div className="form-group col-md-12">
            <label className="form-label">Date period</label> <i className="fa fa-exclamation-circle" id="datePeriodTooltip"></i>
            <Tooltip placement="right" target="datePeriodTooltip" isOpen={this.state.tooltip.toggleDatePeriodTooltip} toggle={() => { this.toggleTooltip('toggleDatePeriodTooltip'); }}>
              Date period
            </Tooltip>
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
          <div className="form-group col-md-12">
            <label className="form-label">Days</label> <i className="fa fa-exclamation-circle" id="daysTooltip"></i>
            <Tooltip placement="right" target="daysTooltip" isOpen={this.state.tooltip.toggleDaysTooltip} toggle={() => { this.toggleTooltip('toggleDaysTooltip'); }}>
              Days
            </Tooltip>
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
