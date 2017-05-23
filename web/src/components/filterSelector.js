import React, {Component} from "react";
import TagsInput from "react-tagsinput";
import {Alert} from 'reactstrap';
import {ShopsService} from '../services/index';
import $ from 'jquery';

class FilterSelector extends Component {
  constructor(props) {
    super(props);
    this._selectedFilter = null;
    this._isInitialized = false;
    this.handleTags = this.handleTags.bind(this);
    this.closeError = this.closeError.bind(this);
    this.initialize = this.initialize.bind(this);
    this.state = {
      isLoading: false,
      tags: [],
      productFilters: [],
      errorMessage: null
    };
  }
  handleTags(tags) {
    this.setState({
      tags: tags
    });
  }
  closeError() {
    this.setState({
      errorMessage: null
    });
  }
  hidePopup() {
      var ul = $(this.popup).find('ul');
      $(ul).empty();
      $(this.popup).hide();
  }
  displayFilters(filters) {
    $(this.popup).show();
    var ul = $(this.popup).find('ul');
    var self = this;
    $(ul).empty();
    filters.forEach(function (filter) {
      $(self.popup).find('ul').append('<li>' + filter.content + '</li>');
    });
  }
  initialize(elt) {
    if (this._isInitialized) return;
    var self = this,
      input = elt.refs.input,
      container = elt.refs.div,
      paddingLeft = 5,
      paddingTop = 5;
    self.popup = $("<div class='popup' style='position: absolute;display: none;'><ul></ul></div>");
    $(document.body).append(self.popup);
    $(input).on('input', function () {
      var value = this.value;
      $(self.popup).width($(container).width() + 5);
      $(self.popup).css('left', $(container).offset().left);
      $(self.popup).css('top', $(container).offset().top + $(container).height());
      if (!this.value || this.value === "" || self._selectedFilter === null) {
        self.hidePopup();
        return;
      }

      var arr = [];
      self._selectedFilter.values.forEach(function(f) {
        if (f.content.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          arr.push(f);
        }
      });

      self.displayFilters(arr);
    });
    self._isInitialized = true;
  }
  render() {
    var filters = [],
      productFilters = [];
    if (this.state.filters && this.state.filters.length > 0) {
      this.state.filters.forEach(function(filter) {
        filters.push((<option value={filter.id}>{filter.name}</option>));
      });
    }

    if (this.state.productFilters && this.state.productFilters.length > 0) {
      this.state.productFilters.forEach(function(productFilter) {
        productFilters.push((<li className="list-group-item justify-content-between">
          {productFilter.name} : {productFilter.filters.join(',')}
          <i className="fa fa-times" onClick={(e) => { self.removeFilter(productFilter); }}></i>
        </li>))
      });
    }

    return (<div>
      <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert>
      {filters.length > 0 &&
        (<div className="row col-md-12">
            <div className="col-md-4">
                <select className="form-control">
                  {filters}
                </select>
            </div>
            <div className="col-md-4">
              <TagsInput ref={(elt) => {
                  this.initialize(elt);
              }} value={this.state.tags} onChange={this.handleTags} inputProps={{placeholder: "Add a filter"}}/>
            </div>
            <div className="col-md-4">
            <div className="col-md-4">
              <input type="submit" className="btn btn-success" value="Add" />
            </div>
          </div>
        </div>)
      }
      <ul className="list-group">
        {productFilters}
      </ul>
    </div>);
  }
  componentWillMount() {
    var shopId = this.props.shopId,
      self = this;
    self.setState({
      isLoading: true
    });
    ShopsService.get(shopId).then(function(shop) {
      var filters = shop['_embedded'].filters;
      self._selectedFilter = filters[0];
      self.setState({
        isLoading: false,
        filters: filters
      });
    }).catch(function() {
      self.setState({
        isLoading: false
      });
    });
  }
}

export default FilterSelector;
