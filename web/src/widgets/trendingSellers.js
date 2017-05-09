import React, { Component } from 'react';
import { ShopsService } from '../services';
import Widget from '../components/widget';
import Rater from 'react-rater';
import $ from 'jquery';
import AppDispatcher from '../appDispatcher';

class TrendingSellers extends Component {
  constructor(props) {
    super(props);
    this.navigate = this.navigate.bind(this);
    this.navigateShop = this.navigateShop.bind(this);
    this.state = {
      errorMessage: null,
      isLoading: false,
      shops: [],
      navigation: []
    };
  }
  // Navigate through the pages
  navigate(e, name) {
    e.preventDefault();
    var startIndex = name - 1;
    var request = $.extend({}, this.request, {
      start_index: startIndex
    });
    this.display(request);
  }
  // Navigate to the shop
  navigateShop(e, shopId) {
    e.preventDefault();
    this.props.history.push('/shops/'+shopId);
  }
  // Refresh the view
  refresh(json) {
    var request = $.extend({}, json, {
      orders: [
        { target: "total_score", method: "desc" }
      ],
      count: 5
    });
    this.request = request;
    this.display(request);
  }
  // Display the list
  display(request) {
    var self = this;
    self.setState({
      isLoading: true
    });
    ShopsService.search(request).then(function(r) {
      var shops = r['_embedded'],
        navigation = r['_links']['navigation'];
      if (!(shops instanceof Array))
      {
        shops = [shops];
      }

      if (!(navigation instanceof Array)) {
        navigation = [navigation];
      }

      self.setState({
        shops: shops,
        navigation: navigation,
        isLoading: false
      });
    }).catch(function() {
      self.setState({
        shops: [],
        navigation: [],
        isLoading: false
      });
    });
  }
  // Render the view
  render() {
    var content = [],
      navigations = [],
      self = this,
      title = "Trending shops";
    if (this.state.isLoading) {
      return (
        <Widget title={title}>
          <i className='fa fa-spinner fa-spin'></i>
        </Widget>);
    }
    if (this.state.shops && this.state.shops.length > 0) {
      this.state.shops.forEach(function(shop) {
        var profileImage = shop.profile_image;
        if (!profileImage) {
          profileImage = "/images/profile-picture.png";
        }

        content.push((
          <a key={shop.id} href="#" className="list-group-item list-group-item-action flex-column align-items-start no-padding" onClick={(e) => { self.navigateShop(e, shop.id); }}>
            <div className="d-flex w-100">
              <img src={profileImage} className="img-thumbnail rounded float-left picture" />
              <div className="d-flex flex-column">
                <div className="mb-1">{shop.name}</div>
                <div className="mb-1">
                  <Rater total={5} rating={shop.average_score} interactive={false} /><i>Comments : {shop.nb_comments}</i>
                </div>
              </div>
            </div>
          </a>));
      });
    }

    if (this.state.navigation && this.state.navigation.length > 0) {
      this.state.navigation.forEach(function(nav) {
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
          ? (<span>No shops</span>) :
          (<ul className="list-group list-group-flush">
            {content}
          </ul>)
        }
      </Widget>
    );
  }
  // Execute after the render
  componentWillMount() {
    var self = this;
    AppDispatcher.register(function(payload) {
      switch(payload.actionName) {
        case 'new-shop':
        case 'new-shop-comment':
        case 'remove-shop-comment':
          var request = $.extend({}, self.request, {
            start_index: 0
          });
          self.refresh(request);
        break;
      }
    });
  }
}

export default TrendingSellers;
