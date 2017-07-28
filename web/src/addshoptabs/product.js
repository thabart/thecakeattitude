import React, {Component} from "react";
import {Tooltip} from "reactstrap";
import TagsInput from "react-tagsinput";
import { translate } from 'react-i18next';
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
    const {t} = this.props;
    return (<div className="container">
        {/* Form */}
        <div className="row p-1">
          <div className="col-md-12">
            <p><i className="fa fa-exclamation-triangle txt-info"></i> {t('productAddShopDescription')}</p>
            <p>{t('productAddShopReminder')}</p>
            {/* Product categories */}
            <div className="form-group">
              <label className="form-label">{t('productCategories')}</label> <i className="fa fa-info-circle txt-info" id="productCategories"></i>
              <Tooltip placement="right" target="productCategories" isOpen={this.state.tooltip.toggleProductCategories} toggle={() => { this.toggleTooltip('toggleProductCategories'); }}>
                  {t('maxEightProductCategories')}
              </Tooltip>
              <ProductCategories ref="productCategories" />
            </div>
            {/* Product filters */}
            <div className="form-group">
              <label className="form-label">{t('productFilters')}</label> <i className="fa fa-info-circle txt-info" id="productFilters"></i>
              <Tooltip placement="right" target="productFilters" isOpen={this.state.tooltip.toggleProductFilters} toggle={() => { this.toggleTooltip('toggleProductFilters');}}>
                  Add product filters and their values
              </Tooltip>
              <ShopProductFilter ref="shopProductFilter" />
            </div>
          </div>
        </div>
        <div className="form-group">
            <button className="btn btn-default previous" onClick={() => {
              self.previous();
            }}>{t('previous')}
            </button>
            <button style={{marginLeft: "5px"}} className="btn btn-default next" onClick={() => {
              self.next();
            }}>{t('next')}
            </button>
        </div>
      </div>);
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(ProductForm);
