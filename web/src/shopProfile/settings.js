import React, {Component} from "react";
import {ShopProductFilter, ProductCategories} from "../components";
import {ShopsService} from "../services/index";
import {Tooltip} from "reactstrap";
import AppDispatcher from "../appDispatcher";
import NotificationSystem from 'react-notification-system';

class ShopSettings extends Component {
    constructor(props) {
        super(props);
        var filters = [];
        var index = 0;
        if (props.shop && props.shop.filters) {
          props.shop.filters.forEach(function(filter) {
            filters.push({
              externalId: filter.id,
              id: index,
              name: filter.name,
              tags: filter.values,
              isNotComplete: false
            });
            index++;
          });
        }

        this.save = this.save.bind(this);
        this.state = {
          tooltip:  {
            toggleProductFilters: false
          },
          filters: filters,
          productCategories: props.shop.product_categories
        };
    }

    toggleTooltip(name) {
        var tooltip = this.state.tooltip;
        tooltip[name] = !tooltip[name];
        this.setState({
            tooltip: tooltip
        });
    }

    save() {
      var productCategories = this.refs.productCategories,
        shopProductFilter = this.refs.shopProductFilter;
      var categories = productCategories.getCategories(),
        filters = shopProductFilter.getFilters().map(function(filter) {
          return {
            id: filter.externalId,
            name: filter.name,
            values: filter.tags
          }
        });
      // TODO :Call ShopUpdate service.
    }

    render() {
        var self = this;
        return (<div>
          <section className="col-md-12 white-section shop-section shop-section-padding">
            <div className="form-group">
              <label className="form-label">Product categories</label> <i className="fa fa-exclamation-circle" id="productCategories"></i>
              <Tooltip placement="right" target="productCategories" isOpen={self.state.tooltip["toggleProductCategories"]} toggle={() => {
                self.toggleTooltip("toggleProductCategories");
              }}>
                You can add 5 product categories (max)
              </Tooltip>
              <ProductCategories ref="productCategories" categories={this.state.productCategories} />
            </div>
            <div className="form-group">
              <label className="form-label">Product filters</label> <i className="fa fa-exclamation-circle" id="productFilters"></i>
              <Tooltip placement="right" target="productFilters" isOpen={self.state.tooltip["toggleProductFilters"]} toggle={() => {
                self.toggleTooltip("toggleProductFilters");
              }}>
                Add product filters and their values
              </Tooltip>
            </div>
            <div className="form-group">
              <ShopProductFilter ref="shopProductFilter" filters={this.state.filters} />
            </div>
            <div className="form-group">
              <button className="btn btn-success" onClick={this.save}>Save</button>
            </div>
          </section>
        </div>);
    }
}

export default ShopSettings;
