import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import 'react-datepicker/dist/react-datepicker.css';
import { Alert } from 'reactstrap';
import DatePicker from 'react-datepicker';
import Rater from 'react-rater';
import moment from 'moment';
import { ShopServices } from '../../services';
import Constants from '../../../Constants';
import $ from 'jquery';

let countServices = 1;

class List extends Component {
  constructor(props) {
    super(props);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.toggleError = this.toggleError.bind(this);
    this.changePage = this.changePage.bind(this);
    this.search = this.search.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      startDate: moment().subtract(10, 'days'),
      endDate: moment(),
      errorMessage: null,
      services: [],
      pagination: [],
      serviceName: null
    };
    this.request = {
      from_datetime: this.state.startDate.format(),
      to_datetime: this.state.endDate.format(),
      count: countServices
    };
  }
  handleInputChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  toggleError() {
    this.setState({
      errorMessage: null
    });
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
  refresh() {
    var self = this;
    self.setState({
      isLoading: true
    });
    ShopServices.search(self.request).then(function(r) {
      var embedded = r['_embedded'];
      var pagination = r['_links'].navigation;
      if(!(embedded instanceof Array)) {
        embedded = [embedded];
      }

      self.setState({
        isLoading: false,
        services: embedded,
        pagination: pagination
      });
    }).catch(function() {
      self.setState({
        isLoading: false,
        errorMessage: 'An error occured while trying to retrieve the services'
      });
    });
  }
  changePage(e, name) {
    e.preventDefault();
    this.request = $.extend({}, this.request, {
      start_index: countServices * (name - 1)
    });
    this.refresh();
  }
  search() {
    this.request = $.extend({}, this.request, {
      name: this.state.serviceName,
      from_datetime: this.state.startDate.format(),
      to_datetime: this.state.endDate.format()
    });
    this.refresh();
  }
  render() {
    var services = [],
      pagination = [],
      self = this;

    if (self.state.services && self.state.services.length > 0) {
      self.state.services.forEach(function(service) {
        var image = "/images/default-service.jpg";
        if (service.images && service.images.length > 0) {
          image = Constants.apiUrl + service.images[0];
        }

        services.push((<section className="row product-item" key={service.id}>
          <div className="col-md-3">
            <img src={image} className="rounded" width="140" height="140"/>
          </div>
          <div className="col-md-5">
            <h3>{service.name}</h3>
            <Rater total={5} interactive={false} />
            <p>
              {service.description}
            </p>
          </div>
          <div className="col-md-4">
            <h4 className="price">€ {service.price}</h4>
          </div>
        </section>));
      });
    }

    if (this.state.pagination && this.state.pagination.length > 1) {
      this.state.pagination.forEach(function(page) {
        pagination.push((<li className="page-item"><a className="page-link" href="#" onClick={(e) => { self.changePage(e, page.name); }}>{page.name}</a></li>))
      });
    }

    return (
          <div className="col-md-12">
            { this.state.errorMessage !== null && (<div className="row col-md-12"><Alert color="danger col-md-12" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert></div>) }
            <div className="row col-md-12">
              <div className="col-md-3">
                <div className="form-group">
                  <label>Service s name</label>
                  <input type="text" className="form-control" name='serviceName' onChange={this.handleInputChange} />
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
                <div className="form-group">
                  <button className="btn btn-default" onClick={this.search}>Search</button>
                </div>
              </div>
              <div className="col-md-9">
                { this.state.isLoading ? (<i className='fa fa-spinner fa-spin'></i>) :  (
                  <div>
                    { services.length === 0 ? (<span>No services</span>) : services }
                  </div>
                )}
                { pagination.length > 0 && (<ul className="pagination">
                  {pagination}
                </ul>) }
              </div>
            </div>
          </div>
    );
  }
  componentWillMount() {
    this.request = $.extend({}, this.request, {
       shop_id: this.props.shop.id
     });
    this.refresh();
  }
}

export default List;
