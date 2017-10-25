import React, {Component} from "react";
import { translate } from 'react-i18next';
import { UncontrolledTooltip, FormGroup, FormFeedback, Label } from 'reactstrap';
import DatePicker from "react-datepicker";
import TimePicker from 'rc-time-picker';
import moment from "moment";

class EditableShopServicePlanning extends Component {
	constructor(props) {
		super(props);
	    this.toggleTooltip = this.toggleTooltip.bind(this);
	    this.toggleDays = this.toggleDays.bind(this);
	    this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
	    this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
	    this.handleChangeStartTime = this.handleChangeStartTime.bind(this);
	    this.handleChangeEndTime = this.handleChangeEndTime.bind(this);
    	this.validate = this.validate.bind(this);
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

  	toggleTooltip(name) { // Toggle the tooltip.
      var tooltip = this.state.tooltip;
      tooltip[name] = !tooltip[name];
      this.setState({
          tooltip: tooltip
      });
  	}

  	toggleDays(e, day) { // Toggle the days.
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

  	handleChangeStartDate(date) { // Handle change start date.
      this.setState({
          startDate: date
      });
  	}

  	handleChangeEndDate(date) { // Handle change end date.
      this.setState({
          endDate: date
      });
  	}

  	handleChangeStartTime(time) { // Handle change start time.
      this.setState({
        startTime: time
      });
  	}

  	handleChangeEndTime(time) { // Handle change end time.
      this.setState({
        endTime: time
      });
  	}

  	buildErrorTooltip(validName, description) { // Build error tooltip.
      var result;
      if (this.state.valid[validName]) {
          result = (
            <span>
                {description}
            </span> );
      }

      return result;
  	}

  	validate() { // Validate the form.
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
	    if (!self.state.startDate || !self.state.endDate || self.state.endDate === null || self.state.startDate === null) {
	      isValid = false;
	      valid.isDatePeriodInvalid = true;
	    } else {
	      var startDate = self.state.startDate.toDate(),
	        endDate = self.state.endDate.toDate(),
	        now = moment().toDate();
	        if (now > endDate || startDate > endDate) {
	          isValid = false;
	          valid.isDatePeriodInvalid = true;
	        } else {
	          valid.isDatePeriodInvalid = false;
	        }
	    }

	    var startTime = self.state.startTime,
	      endTime = self.state.endTime;
	    if (!startTime || !endTime || startTime === null || endTime === null || startTime > endTime) {
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
	    return json;
  	}

	render() {		
	    const {t} = this.props;
	    var daysError = this.buildErrorTooltip('isDaysInvalid', t('oneSelectedDayError')),
	      datePeriodError = this.buildErrorTooltip('isDatePeriodInvalid', t('periodInvalidError')),
	      timePeriodError = this.buildErrorTooltip('isTimePeriodInvalid', t('timePeriodInvalidError'));
	    const feedbackTimePeriod = timePeriodError ? "danger" : undefined;
	    const feedbackDatePeriod = datePeriodError ? "danger" : undefined;
	    const feedbackDays = daysError ? "danger" : undefined;
	    return (
	      <section>
	        <FormGroup color={feedbackTimePeriod}>
	        	<Label className="col-form-label">{t('timePeriod')} <i className="fa fa-info-circle txt-info" id="timePeriodTooltip"></i></Label>
	            <UncontrolledTooltip className="red-tooltip-inner" placement="right" target="timePeriodTooltip" isOpen={this.state.tooltip.toggleTimePeriodTooltip} toggle={() => { this.toggleTooltip('toggleTimePeriodTooltip'); }}>
	              {t('addShopServiceOccurrenceTimePeriodTooltip')}
	            </UncontrolledTooltip>
	            <div className="row">
	              <div className="col-md-6">
	                <Label className="col-form-label">{t('fromTime')}</Label>
	                <TimePicker value={this.state.startTime} onChange={this.handleChangeStartTime} />
	              </div>
	              <div className="col-md-6">
	                <Label className="col-form-label">{t('toTime')}</Label>
	                <TimePicker value={this.state.endTime} onChange={this.handleChangeEndTime} />
	              </div>
	            </div>
	            <FormFeedback>{timePeriodError}</FormFeedback>
	        </FormGroup>
	        {/* Date period */}
	        <FormGroup color={feedbackDatePeriod}>
	            <Label className="col-form-label">
	              {t('datePeriod')} <i className="fa fa-info-circle txt-info" id="datePeriodTooltip"></i>
	            </Label>
	            <UncontrolledTooltip className="red-tooltip-inner" placement="right" target="datePeriodTooltip" isOpen={this.state.tooltip.toggleDatePeriodTooltip} toggle={() => { this.toggleTooltip('toggleDatePeriodTooltip'); }}>
	              {t('addShopServiceOccurrenceDatePeriodTooltip')}
	            </UncontrolledTooltip>
	            <div className="row">
	              <div className="col-md-6">
	                <Label className="col-form-label">{t('fromDate')}</Label>
	                <DatePicker selected={this.state.startDate}
	                            selectsStart
	                            startDate={this.state.startDate}
	                            endDate={this.state.endDate}
	                            onChange={this.handleChangeStartDate}
	                            className="form-control" />
	              </div>
	              <div className="col-md-6">
	                <Label className="col-form-label">{t('toDate')}</Label>
	                <DatePicker selected={this.state.endDate}
	                            selectsEnd
	                            startDate={this.state.startDate}
	                            endDate={this.state.endDate}
	                            onChange={this.handleChangeEndDate}
	                            className="form-control" />
	              </div>
	            </div>
	            <FormFeedback>{datePeriodError}</FormFeedback>
	        </FormGroup>
	        {/* Days */}
	        <FormGroup color={feedbackDays}>
	            <Label className="col-form-label">
	              {t('days')} <i className="fa fa-info-circle txt-info" id="daysTooltip"></i>
	            </Label>
	            <UncontrolledTooltip className="red-tooltip-inner" placement="right" target="daysTooltip" isOpen={this.state.tooltip.toggleDaysTooltip} toggle={() => { this.toggleTooltip('toggleDaysTooltip'); }}>
	              {t('addShopServiceOccurrenceDaysTooltip')}
	            </UncontrolledTooltip>
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
	            <FormFeedback>{daysError}</FormFeedback>
	        </FormGroup>
	      </section>
	    );
	}
}

export default translate('common', { wait: process && !process.release, withRef: true })(EditableShopServicePlanning);