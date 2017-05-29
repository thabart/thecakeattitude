import React, {Component} from "react";
import {Tooltip} from "reactstrap";
import {Address} from '../components';
import TagsInput from "react-tagsinput";

class ProductForm extends Component {
  constructor(props) {
    super(props);
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
  handleTags(tags) {
    this.setState({
      tags: tags
    });
  }
  addFilterLine() {
    var filters = this.state.filters;
    filters.push({
      id: filters.length,
      tags: []
    });
    this.setState({
      filters: filters
    });
  }
  previous() {
    if (this.props.onPrevious) this.props.onPrevious();
  }
  next() {
    var filters = this.state.filters;
    var filtersJson = [],
      productCategoriesJson = this.state.tags;
    filters.map(function(filter) {
      var record = {
        name: filter.name,
        values : filter.tags
      };
      filtersJson.push(record);
    });

    if (this.props.onNext) this.props.onNext({ filters : filtersJson, product_categories: productCategoriesJson });
  }
  render() {
    var filters = [],
      self = this;
    if (this.state.filters && this.state.filters.length > 0) {
      this.state.filters.forEach(function(filter) {
        filters.push(<div className="row col-md-12">
          <div className="col-md-4"><input type="text" className="form-control" placeholder="Filter name" onChange={(e) => {
            var fs = self.state.filters;
            var sf = null;
            fs.forEach(function(f) {
              if (f.id === filter.id) {
                sf = f;
                return;
              }
            });

            if (sf === null) {
              return;
            }

            sf.name = e.target.value;
            self.setState({
              filters: fs
            });
          }} /></div>
          <div className="col-md-6"><TagsInput value={filter.tags} onChange={(e) => {
            var fs = self.state.filters;
            var sf = null;
            fs.forEach(function(f) {
              if (f.id === filter.id) {
                sf = f;
                return;
              }
            });

            if (sf === null) {
              return;
            }

            sf.tags = e;
            self.setState({
              filters: fs
            });
          }}   inputProps={{placeholder: "Values"}} /></div>
          <div className="col-md-2"><button className="btn btn-outline-secondary btn-sm" onClick={() => {
            var fs = self.state.filters;
            var sf = null;
            fs.forEach(function(f) {
              if (f.id === filter.id) {
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
          }}><i className="fa fa-close"></i></button></div>
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
