import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import { ShopServices } from '../../services';

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

var myEvts = [
  {
   'title': 'All Day Event',
   'start': new Date(2017, 4, 10, 17, 0, 0, 0),
   'end': new Date(2017, 4, 10, 17, 30, 0, 0),
   'desc': 'IMPORTANT'
 }
];

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.onNavigate = this.onNavigate.bind(this);
    this.onView = this.onView.bind(this);
  }
  onNavigate(e, p) {
    console.log(e);
  }
  onView(v) {
    console.log(v);
  }
  render() {
    return (<div className="shop-service-calendar">
      <BigCalendar ref="calendar"
            events={myEvts}
            onNavigate={this.onNavigate}
            onView={this.onView}
          />
      </div>);
  }
  componentWillMount() {
    var start = moment().startOf('week'),
      end = moment().endOf('week');
    console.log(start);
    console.log(end);
  }
}

export default Calendar;
