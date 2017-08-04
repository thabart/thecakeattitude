import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import { ShopServices } from '../../services/index';
import { translate } from 'react-i18next';
import AppDispatcher from "../../appDispatcher";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

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

  onNavigate(e) { // Calendar navigation.
    var start = moment(e).startOf('month').format(),
      end = moment(e).endOf('month').format();
    this.request = { from_datetime: start, to_datetime: end, shop_id: this.props.shop.id };
    this.refresh();
  }

  onSelectEvent(obj) { // Navigate to the service.
    this.props.history.push('/services/'+obj.id);
  }

  toggleError() { // Toggle error message.
    this.setState({
      errorMessage: null
    });
  }

  refresh() { // Refresh services.
    var self = this;
    const {t} = this.props;
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
        errorMessage: t('errorRetrieveServices')
      });
    });
  }

  render() {
    return (<div className="col-md-12">
        { this.state.errorMessage !== null && (<div className="row col-md-12"><Alert color="danger col-md-12" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert></div>) }
        <div style={{height: "500px", paddingTop: "20px", paddingBottom: "20px"}}>
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

  componentDidMount() { // Execute before the render view.
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

  componentWillUnmount() { // Unregister view.
    AppDispatcher.unregister(this._waitForToken);
  }
}

export default translate('common', { wait: process && !process.release })(Calendar);
