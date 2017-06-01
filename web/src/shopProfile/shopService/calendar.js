import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import { Alert } from 'reactstrap';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import { ShopServices } from '../../services/index';
import AppDispatcher from "../../appDispatcher";

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

class Calendar extends Component {
  constructor(props) {
    super(props);
    this._waitForToken = null;
    this.onNavigate = this.onNavigate.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.state = {
      errorMessage: null,
      events : []
    };
  }
  onNavigate(e) {
    var start = moment(e).startOf('month').format(),
      end = moment(e).endOf('month').format();
    this.request = { from_datetime: start, to_datetime: end, shop_id: this.props.shop.id };
    this.refresh();
  }
  onSelectEvent(obj) {
    this.props.history.push('/services/'+obj.id);
  }
  toggleError() {
    this.setState({
      errorMessage: null
    });
  }
  refresh() {
    var self = this;
    ShopServices.searchOccurrences(self.request).then(function(r) {
      var embedded = r['_embedded'];
      var evts = [];
      embedded.forEach(function(e) {
        evts.push({
          start: new Date(e.start_datetime),
          end: new Date(e.end_datetime),
          desc: e.description,
          title: e.name,
          id: e.id
        });
      });
      self.setState({
        events: evts
      });
    }).catch(function() {
      self.setState({
        errorMessage: 'an error occured while trying to retrieve the services'
      });
    });
  }
  render() {
    return (<div className="col-md-12">
        { this.state.errorMessage !== null && (<div className="row col-md-12"><Alert color="danger col-md-12" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert></div>) }
        <div className="shop-service-calendar">
            <BigCalendar ref="calendar"
                events={this.state.events}
                onNavigate={this.onNavigate}
                defaultDate={this.defaultDate}
                onSelectEvent={this.onSelectEvent}
              />
        </div>
      </div>
      );
  }
  componentDidMount() {
    var start = moment().startOf('month').format(),
      end = moment().endOf('month').format(),
      self = this,
      shopId = this.props.shop.id;
    this.request = { from_datetime: start, to_datetime: end, shop_id: this.props.shop.id };
    this.refresh();
    self._waitForToken = AppDispatcher.register(function (payload) {
        switch (payload.actionName) {
            case 'new-service':
                if (payload.data && payload.data.shop_id === shopId) {
                  self.refresh();
                }
                break;
            break;
        }
    });
  }
  componentWillUnmount() {
    AppDispatcher.unregister(this._waitForToken);
  }
}

export default Calendar;
