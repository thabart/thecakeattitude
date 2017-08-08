import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import DatePicker from "react-datepicker";
import { translate } from 'react-i18next';
import moment from 'moment';


class SelectDate extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.setDate = this.setDate.bind(this);
    this.state = {
      currentDate: moment(),
      isDropDownDisplayed: false,
      isDatePickerDisplayed: false
    };
  }

  toggle(name) { // Toggle a property.
    this.setState({
      [name] : !this.state[name]
    });
  }

  setDate(date) {
    this.setState({
      currentDate: date
    });
    
    if (this.props.onChange) {
      this.props.onChange(date);
    }
  }

  render() { // Display the component.
    var self = this;
    const {t} = this.props;
    var twoDay = moment().add(2, 'day').format('ddd DD MMM');
    var threeDay = moment().add(3, 'day').format('ddd DD MMM');
    return (<div>
      <Dropdown isOpen={self.state.isDropDownDisplayed} toggle={() => self.toggle('isDropDownDisplayed')}>
        <DropdownToggle style={{padding: "0"}}>
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
            <input type="text" className="form-control" value={self.state.currentDate.format('L')} />
          </div>
        </DropdownToggle>
        <DropdownMenu className="no-arrow">
          <DropdownItem onClick={() => { self.setDate(moment()) }}>{t('today')}</DropdownItem>
          <DropdownItem onClick={() => { self.setDate(moment().add(1, 'day')) }}>{t('tomorrow')}</DropdownItem>
          <DropdownItem onClick={() => { self.setDate(moment().add(2, 'day')) }}>{twoDay}</DropdownItem>
          <DropdownItem onClick={() => { self.setDate(moment().add(3, 'day')) }}>{threeDay}</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={() => self.toggle('isDatePickerDisplayed') }>{t('chooseDate')}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {this.state.isDatePickerDisplayed && (
        <DatePicker withPortal inline selected={self.state.currentDate} onChange={(date) => { self.setDate(date); self.toggle('isDatePickerDisplayed'); }} />
      )}
    </div>);
  }
}

export default translate('common', { wait: process && !process.release })(SelectDate);
