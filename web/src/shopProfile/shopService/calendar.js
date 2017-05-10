import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

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
  render() {
    console.log(myEvts);
    return (<div className="shop-service-calendar">
      <BigCalendar
            events={myEvts}
          />
      </div>);
  }
}

export default Calendar;
