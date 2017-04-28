import React, { Component } from 'react';
import { ShopsService } from '../services';
import Widget from '../components/widget';
import $ from 'jquery';

class TrendingSellers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      shops: []
    };
  }
  // Refresh the view
  refresh(json) {
    var self = this;
    var rec = $.extend({}, json, {
      orders: [
        { target: "nb_comments", method: "desc" }
      ]
    });

    ShopsService.search(rec).then(function(r) {
      self.setState({
        shops: r['_embedded']
      });
    }).catch(function() {
      self.setState({
        shops: []
      });
    });
  }
  // Render the view
  render() {
    var content = [];
    if (this.state.shops && this.state.shops.length > 0) {
      this.state.shops.forEach(function(shop) {
        content.push((<a href="#" className="list-group-item list-group-item-action flex-column align-items-start no-padding">{shop.name}</a>));
      });
    }

    return (
      <Widget title="Trending sellers">
        {content.length == 0
          ? (<span>No shops</span>) :
          (<ul className="list-group list-group-flush">
            {content}
          </ul>)
        }
      </Widget>
    );
  }
}

export default TrendingSellers;
