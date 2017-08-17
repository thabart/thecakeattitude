import React, { Component } from "react";
import { Alert } from 'reactstrap';
import { ShopsService } from '../services/index';
import { translate } from 'react-i18next';
import TagsInput from "react-tagsinput";
import $ from 'jquery';

class FilterSelector extends Component {
  constructor(props) {
    super(props);
    this.elt = null;
    this._selectedFilter = null;
    this._isInitialized = false;
    this.handleTags = this.handleTags.bind(this);
    this.closeError = this.closeError.bind(this);
    this.initialize = this.initialize.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.addFilter = this.addFilter.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.state = {
      isLoading: false,
      tags: [],
      productFilters: [],
      filters: [],
      errorMessage: null
    };
  }

  handleTags(tags, changed, changedIndexes) { // Handle tags modification.
    if (changedIndexes[0] === this.state.tags.length) {
      var changedValue = changed[0].toLowerCase();
      var selectedValue = this._selectedFilter.values.filter(function(value) {
        return value.content.toLowerCase().indexOf(changedValue) !== -1;
      });
      if (selectedValue.length !== 1) {
        return;
      }

      tags.pop();
      tags.push(selectedValue[0].content);
    }

    this.setState({
      tags: tags
    });
    this.hidePopup();
  }

  closeError() { // Close error message.
    this.setState({
      errorMessage: null
    });
  }

  hidePopup() { // Hide popup.
      var ul = $(this.popup).find('ul');
      $(ul).empty();
      $(this.popup).hide();
  }

  displayFilters(filters) { // Display filters.
    $(this.popup).show();
    var ul = $(this.popup).find('ul');
    var self = this;
    $(ul).empty();
    filters.forEach(function (filter) {
      $(self.popup).find('ul').append('<li>' + filter.content + '</li>');
    });
  }

  changeFilter(e) { // Execute when the user changes the filter.
    var value = e.target.value;
    var filter = this.state.filters.find(function(elt) {
      return elt.id === value;
    });
    this._selectedFilter = filter;
    this.setState({
      tags: []
    });
  }

  updatePopupContent(value) { // Update popup content.
    var self = this;
    if (self._selectedFilter === null) {
      self.hidePopup();
      return;
    }

    var arr = [],
      tags = self.state.tags;
    if (value && value !== '') {
      self._selectedFilter.values.forEach(function(f) {
        if (f.content.toLowerCase().indexOf(value.toLowerCase()) !== -1 && $.inArray(f.content, tags) === -1) {
          arr.push(f);
        }
      });
    } else {
      self._selectedFilter.values.forEach(function(f) {
        if ($.inArray(f.content, tags) === -1) {
          arr.push(f);
        }
      });
    }

    self.displayFilters(arr);
    self.popup.find('li').click(function() {
      var tags = self.state.tags;
      tags.push($(this).html());
      self.setState({
        tags: tags
      });
      self.hidePopup();
    });
  }

  updatePopupPosition() { // Update popup position.
    var self = this,
      container = self.elt.refs.div,
      parent = $(container).parent();
    $(self.popup).width($(container).width() + 5);
    $(self.popup).css('left', $(container).offset().left);
    $(self.popup).css('top', $(parent).offset().top + $(parent).height());
  }

  initialize(elt) { // Called only one time to initialize the popup.
    if (this._isInitialized) return;
    var self = this,
      input = elt.refs.input,
      paddingLeft = 5,
      paddingTop = 5;
    self.elt = elt;
    self.popup = $("<div class='react-tagsinput-popup' style='position: absolute;display: none;'><ul></ul></div>");
    $(document.body).append(self.popup);
    $(window).resize(self.updatePopupPosition);
    $(input).on('input', function () {
      self.updatePopupPosition();
      self.updatePopupContent(this.value);
    });
    self._isInitialized = true;
  }

  addFilter() { // Add a filter.
    const {t} = this.props;
    if (!this.state.tags || this.state.tags.length === 0) {
      this.setState({
        errorMessage: t('oneCharacteristicValueInsertedError')
      });
      return;
    }

    var productFilter = {
      filter : this._selectedFilter,
      tags: this.state.tags
    };
    var productFilters = this.state.productFilters;
    var filters = this.state.filters;
    filters.splice(filters.indexOf(this._selectedFilter), 1);
    productFilters.push(productFilter);
    this.initSelectedFilter();
    this.setState({
      productFilters: productFilters,
      filters: filters,
      tags: []
    });
  }

  removeFilter(r) { // Remove filter.
    var productFilters = this.state.productFilters;
    var filters = this.state.filters;
    var index = productFilters.indexOf(r);
    if (index === -1) {
      return;
    }

    productFilters.splice(index, 1);
    filters.push(r.filter);
    this.initSelectedFilter();
    this.setState({
      productFilters: productFilters,
      filters: filters,
      tags: []
    });
  }

  initSelectedFilter() {
    if (this.state.filters.length === 0) {
      this._selectedFilter = null;
    } else {
      this._selectedFilter = this.state.filters[0];
    }
  }

  getFilters() { // Get the filters.
    var productFilters = this.state.productFilters,
      arr = [];
    productFilters.forEach(function(productFilter) {
      var filterValues = [];
      productFilter.tags.forEach(function(tagName) {
        filterValues.push(productFilter.filter.values.find(function(val) {
          return val.content === tagName;
        }));
      });
      filterValues.forEach(function(filterValue) {
        arr.push({
          value_id: filterValue.id,
          filter_id: productFilter.filter.id
        });
      });
    });
    return arr;
  }

  render() { // Display the view.
    var filters = [],
      productFilters = [],
      self = this;
    if (this.state.filters && this.state.filters.length > 0) {
      this.state.filters.forEach(function(filter) {
        filters.push((<option value={filter.id}>{filter.name}</option>));
      });
    }

    if (this.state.productFilters && this.state.productFilters.length > 0) {
      this.state.productFilters.forEach(function(productFilter) {
        productFilters.push((<li className="list-group-item justify-content-between">
          {productFilter.filter.name} : {productFilter.tags.join(',')}
          <i className="fa fa-times" onClick={(e) => { self.removeFilter(productFilter); }} style={{ cursor: "pointer" }}></i>
        </li>))
      });
    }

    const {t} = self.props;
    return (<div>
      <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert>
      <div className={this.state.filters.length === 0 ? "row col-md-12 hidden" : "row col-md-12"}>
        <div className="col-md-4">
          <select className="form-control" onChange={this.changeFilter}>
            {filters}
          </select>
        </div>
        <div className="col-md-4">
          <TagsInput ref={(elt) => {
            this.initialize(elt);
          }} value={this.state.tags} onChange={this.handleTags} inputProps={{placeholder: t('characteriticValuePlaceHolder')}}/>
        </div>
        <div className="col-md-4">
          <input type="submit" className="btn btn-default" value={t('add')} onClick={this.addFilter} />
        </div>
      </div>
      <ul className="list-group">
        {productFilters}
      </ul>
    </div>);
  }

  componentWillMount() { // Execute before after the render.
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

export default translate('common', { wait: process && !process.release, withRef: true })(FilterSelector);
