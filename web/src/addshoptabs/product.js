import React, {Component} from "react";
import {Tooltip} from "reactstrap";
import {Address} from '../components';
import TagsInput from "react-tagsinput";
import $ from 'jquery';

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this._indexFilter = 0;
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleTags = this.handleTags.bind(this);
    this.addFilterLine = this.addFilterLine.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.state = {
      tooltip: {
        toggleProductCategories: false,
        toggleProductFilters: false
      },
      tags: [],
      filters: []
    };
  }
  toggleTooltip(name) {
      var tooltip = this.state.tooltip;
      tooltip[name] = !tooltip[name];
      this.setState({
          tooltip: tooltip
      });
  }
  handleTags(tags, changed, changedIndexes) {
    if (this.isTagsExist(tags, changed, changedIndexes, this.state.tags)) {
      return;
    }

    this.setState({
      tags: tags
    });
  }
  addFilterLine() {
    var filters = this.state.filters;
    filters.push({
      id: this._indexFilter,
      tags: [],
      name: '',
      isNotComplete: true
    });
    this.setState({
      filters: filters
    });
    this._indexFilter++;
  }
  previous() {
    if (this.props.onPrevious) this.props.onPrevious();
  }
  next() {
    var filters = this.state.filters;
    var filtersJson = [],
      productCategoriesJson = this.state.tags;
    filters = filters.filter(function(filter) {
      return filter.isCorrect === true && filter.isNotComplete === false;
    });
    filters.map(function(filter) {
      var record = {
        name: filter.name,
        values : filter.tags
      };
      filtersJson.push(record);
    });

    // if (this.props.onNext) this.props.onNext({ filters : filtersJson, product_categories: productCategoriesJson });
  }
  getFilter(filter, filters) {
    var sf = null;
    filters.forEach(function(f) {
      if (f.id === filter.id) {
        sf = f;
        return;
      }
    });

    return sf;
  }
  isTagsExist(tags, changed, changedIndexes, innerTags) {
    if (changedIndexes[0] === innerTags.length ) {
      var changedValue = changed[0].toLowerCase();
      var selectedValue = innerTags.filter(function(tag) {
        return tag.toLowerCase().indexOf(changedValue) !== -1;
      });

      if (selectedValue.length > 0) {
        return true;
      }
    }

    return false;
  }
  render() {
    var filters = [],
      self = this;
    if (this.state.filters && this.state.filters.length > 0) {
      this.state.filters.forEach(function(filter) {
        filters.push(<div className="row col-md-12">
          <div className="col-md-4"><input type="text" className="form-control" value={filter.name} placeholder="Filter name" onChange={(e) => {
            var fs = self.state.filters.slice(0);
            var sf = self.getFilter(filter, fs);
            if (sf === null) {
              return;
            }

            sf.name = e.target.value;
            var names = fs.filter(function(m) { return m.name.toLowerCase() === e.target.value.toLowerCase(); });
            sf.isCorrect = names.length <= 1;
            sf.isNotComplete = e.target.value === null || e.target.value === '' || sf.tags.length === 0;
            self.setState({
              filters: fs
            });
          }} /></div>
          <div className="col-md-6"><TagsInput value={filter.tags} onChange={(tags, changed, changedIndexes) => {
            var fs = self.state.filters.slice(0);
            var sf = self.getFilter(filter, fs);
            if (sf === null) {
              return;
            }

            if (self.isTagsExist(tags, changed, changedIndexes, sf.tags)) {
                return;
            }

            sf.tags = tags;
            sf.isNotComplete = sf.name === null || sf.name === '' || sf.tags.length === 0;
            self.setState({
              filters: fs
            });
          }}   inputProps={{placeholder: "Values"}} /></div>
          <div className="col-md-2"><button className="btn btn-outline-secondary btn-sm" data-target={filter.id} onClick={(e) => {
            var id = parseInt($(e.target).attr('data-target'));
            var fs = self.state.filters.slice(0);
            var sf = null;
            fs.forEach(function(f) {
              if (f.id === id) {
                sf = f;
                return;
              }
            });

            if (sf === null) {
              return;
            }

            var index = fs.indexOf(sf);
            if (index === -1) {
              return;
            }

            fs.splice(index, 1);
            self.setState({
              filters: fs
            });
          }}><i className="fa fa-close" data-target={filter.id}></i></button>
           { filter.isCorrect === false && (<span>
             <i className="fa fa-exclamation-triangle validation-error" id={"validationError_"+filter.id}></i>
             <Tooltip placement="right" target={"validationError_"+filter.id} isOpen={self.state.tooltip["validationError_"+filter.id]} toggle={() => {
                 self.toggleTooltip("validationError_"+filter.id);
             }}>
              A filter with the same name has already been specified
             </Tooltip>
           </span>) }
           { filter.isNotComplete && (<span>
            <i className="fa fa-exclamation" id={"warningError"+filter.id}></i>
            <Tooltip placement="right" target={"warningError"+filter.id} isOpen={self.state.tooltip["warningError"+filter.id]} toggle={() => {
                self.toggleTooltip("warningError"+filter.id);
            }}>
             At least one tag must be specified and the name must be filled-in
            </Tooltip>
           </span>) }
          </div>
        </div>);
      });
    }

    return (<div>
        <section className="col-md-12 section">
          <div className="form-group">
            <label className="form-label">Product categories</label> <i className="fa fa-exclamation-circle" id="productCategories"></i>
            <Tooltip placement="right" target="productCategories" isOpen={this.state.tooltip.toggleProductCategories} toggle={() => { this.toggleTooltip('toggleProductCategories'); }}>
                You can add 5 product categories (max)
            </Tooltip>
            <TagsInput value={this.state.tags} onChange={this.handleTags}  inputProps={{placeholder: "Category"}}/>
          </div>
          <div className="row">
            <div className="col-md-12">
              <label className="form-label">Product filters</label> <i className="fa fa-exclamation-circle" id="productFilters"></i>
              <Tooltip placement="right" target="productFilters" isOpen={this.state.tooltip.toggleProductFilters} toggle={() => { this.toggleTooltip('toggleProductFilters');}}>
                  Add product filters and their values
              </Tooltip>
            </div>
            <div className="col-md-12"><button className="btn btn-success" onClick={this.addFilterLine}><i className="fa fa-plus"></i> Add filter</button></div>
            {filters}
          </div>
        </section>
        <section className="col-md-12 sub-section">
            <button className="btn btn-primary previous" onClick={() => {
              self.previous();
            }}>Previous
            </button>
            <button className="btn btn-primary next" onClick={() => {
              self.next();
            }}>Next
            </button>
        </section>
      </div>);
  }
}

export default ProductForm;
