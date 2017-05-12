import React, { Component } from 'react';
import Widget from '../components/widget';
import Service  from '../services/ShopServices';
import Rater from 'react-rater';
import $ from 'jquery';

class ShopServices extends Component {
  constructor(props) {
    super(props);
    this.navigateService = this.navigateService.bind(this);
    this.state = {
      isLoading: false
    };
  }
  navigateService(e, serviceId) {
    e.preventDefault();
    this.props.history.push('/services/'+serviceId);
  }
  refresh(json) {
    var request = $.extend({}, json, {
      orders: [
        { target: "total_score", method : 'desc' },
        { target: "update_datetime", method: 'desc' }
      ],
      count: 5
    });
    this.request = request;
    this.display(request);
  }
  display(request) {
    var self = this;
    self.setState({
      isLoading: true
    });
    Service.search(request).then(function(r) {
      var services = r['_embedded'],
        navigation = r['_links']['navigation'];
      if (!(services instanceof Array))
      {
        services = [services];
      }

      if (!(navigation instanceof Array)) {
        navigation = [navigation];
      }

      self.setState({
        services: services,
        navigation: navigation,
        isLoading: false
      });
    }).catch(function() {
      self.setState({
        isLoading: false
      });
    });
  }
  render() {
    var title = "Best services",
        content = [],
        navigations = [],
        self = this;
    if (self.state.isLoading) {
      return (
        <Widget title={title}>
          <i className='fa fa-spinner fa-spin'></i>
        </Widget>);
    }

    if (self.state.services && self.state.services.length > 0) {
      self.state.services.forEach(function(service) {
        var image = "/images/default-service.jpg";
        if (!service.images && service.images.length > 0) {
          image = service.images[0];
        }

        content.push((
          <a key={service.id} href="#" className="list-group-item list-group-item-action flex-column align-items-start no-padding" onClick={(e) => { self.navigateService(e, service.id); }}>
            <div className="d-flex w-100">
              <img src={image} className="img-thumbnail rounded float-left picture" />
              <div className="d-flex flex-column">
                <div className="mb-1">{service.name}</div>
                <div className="mb-1">
                  <Rater total={5} rating={service.average_score} interactive={false} /><i>Comments : {service.nb_comments}</i>
                </div>
              </div>
            </div>
          </a>));
      });
    }

    if (self.state.navigation && self.state.navigation.length > 1) {
      self.state.navigation.forEach(function(nav) {
        navigations.push((
          <li key={nav.name} className="page-item"><a href="#" className="page-link" onClick={(e) => { self.navigate(e, nav.name); }} >{nav.name}</a></li>
        ));
      });
    }

    return (
      <Widget title={title}>
        {navigations.length > 0 && (
            <ul className="pagination">
              {navigations}
            </ul>
        )}
        {content.length == 0
          ? (<span>No services</span>) :
          (<ul className="list-group list-group-flush">
            {content}
          </ul>)
        }
      </Widget>
    );
  }
}

export default ShopServices;
