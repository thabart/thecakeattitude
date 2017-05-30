import React, {Component} from "react";
import {Tooltip} from "reactstrap";
import TagsInput from "react-tagsinput";
import {ShopProductFilter, ProductCategories} from '../components';

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this._indexFilter = 0;
    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.handleTags = this.handleTags.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.state = {
      tooltip: {
        toggleProductCategories: false,
        toggleProductFilters: false
      },
      tags: []
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
  previous() {
    if (this.props.onPrevious) this.props.onPrevious();
  }
  next() {
    var filters = this.refs.shopProductFilter.getFilters();
    var filtersJson = [],
      productCategoriesJson = this.refs.productCategories.getCategories().map(function(cat) {
        return { name: cat.name };
      });
    filters = filters.filter(function(filter) {
      return filter.isCorrect === true && filter.isNotComplete === false;
    });
    filters.map(function(filter) {
      var record = {
        name: filter.name,
        values : filter.tags.map(function(t) { return t.content; })
      };
      filtersJson.push(record);
    });

    if (this.props.onNext) this.props.onNext({ filters : filtersJson, product_categories: productCategoriesJson });
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
        return tag.toLowerCase() === changedValue;
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
    return (<div>
        <section className="col-md-12 section">
          <div className="form-group">
            <label className="form-label">Product categories</label> <i className="fa fa-exclamation-circle" id="productCategories"></i>
            <Tooltip placement="right" target="productCategories" isOpen={this.state.tooltip.toggleProductCategories} toggle={() => { this.toggleTooltip('toggleProductCategories'); }}>
                You can add 5 product categories (max)
            </Tooltip>
            <ProductCategories ref="productCategories" />
          </div>
          <div className="row">
            <div className="col-md-12">
              <label className="form-label">Product filters</label> <i className="fa fa-exclamation-circle" id="productFilters"></i>
              <Tooltip placement="right" target="productFilters" isOpen={this.state.tooltip.toggleProductFilters} toggle={() => { this.toggleTooltip('toggleProductFilters');}}>
                  Add product filters and their values
              </Tooltip>
            </div>
            <ShopProductFilter ref="shopProductFilter" />
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
