import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import DatePicker from 'react-datepicker';
import Rater from 'react-rater';
import moment from 'moment';
import prettyCron from 'prettycron';
import 'react-datepicker/dist/react-datepicker.css';
import './services.css';

class ShopServices extends Component {
  constructor(props) {
    super(props);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.state = {
      startDate: moment().subtract(10, 'days'),
      endDate: moment()
    };
  }
  handleChangeStart(date) {
    this.setState({
      startDate: date
    });
  }
  handleChangeEnd(date) {
    this.setState({
      endDate: date
    });
  }
  // Return the view.
  render() {
    return (<div>
        <section className="row white-section shop-section shop-section-padding">
          <div className="row col-md-12">
            <div className="col-md-3">
              <div className="form-group">
                <label>Service's name</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-group">
                <button className="btn btn-default">Search</button>
              </div>
              <div className="form-group">
                <label>Period</label>
                <DatePicker
                      selected={this.state.startDate}
                      selectsStart
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      onChange={this.handleChangeStart}
                      className="form-control"
                      placeholderText="Start date"
                  />
                <DatePicker selected={this.state.endDate}
                      selectsEnd
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      onChange={this.handleChangeEnd}
                      className="form-control"
                      placeholderText="End date"
                  />
              </div>
            </div>
            <div className="col-md-9">
              <section className="row product-item">
                <div className="col-md-3">
                  <img src="/images/jean.jpg" className="rounded" width="140" height="140"/>
                </div>
                <div className="col-md-5">
                  <h3>Birthday cake</h3>
                  <Rater total={5} interactive={false} />
                  <p>
                    Description
                  </p>
                </div>
                <div className="col-md-4">
                  <h4 className="price">€ 223</h4>
                  <p>
                    {prettyCron.toString("37 10 * * * *")}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>);
  }
}

export default ShopServices;
