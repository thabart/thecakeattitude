import React, {Component} from "react";
import { ShopProductFilter, ProductCategories } from "../components";
import { ShopsService } from "../services/index";
import { Tooltip } from "reactstrap";
import { translate } from 'react-i18next';
import AppDispatcher from "../appDispatcher";
import NotificationSystem from 'react-notification-system';
import Constants from '../../Constants';

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

        this.toggle = this.toggle.bind(this);
        this.setProductCategories = this.setProductCategories.bind(this);
        this.setProductFilters = this.setProductFilters.bind(this);
        this.state = {
          toggleProductCategories: false, // Display tooltip
          toggleProductFilters: false,
          filters: filters, // Used in the view.
          productCategories: props.shop.product_categories
        };
    }

    toggle(name) { // Toggle the tooltip.
        this.setState({
            [name]: !this.state[name]
        });
    }

    setProductCategories(value) { // Set product categories.
      AppDispatcher.dispatch({
        actionName: Constants.events.UPDATE_SHOP_INFORMATION_ACT,
        data: { product_categories: value }
      });
    }

    setProductFilters(value) { // Set product filters.
      AppDispatcher.dispatch({
        actionName: Constants.events.UPDATE_SHOP_INFORMATION_ACT,
        data: { filters: value }
      });
    }

    render() { // Display the view.
        var self = this;
        const {t} = this.props;
        return (<div className="section row" style={{marginTop: "20px", paddingTop: "20px"}}>
          <div className="col-md-12">
            <p><i className="fa fa-exclamation-triangle txt-info"></i> {t('productAddShopDescription')}</p>
            <p>{t('productAddShopReminder')}</p>
            {/* Product categories */}
            <div className="form-group">
              <label className="form-label">{t('productCategories')}</label> <i className="fa fa-info-circle txt-info" id="productCategories"></i>
              <Tooltip placement="right" className="red-tooltip-inner" target="productCategories" isOpen={this.state.toggleProductCategories} toggle={() => { this.toggle('toggleProductCategories'); }}>
                  {t('maxEightProductCategories')}
              </Tooltip>
              <ProductCategories ref="productCategories" productCategories={self.state.productCategories} onChange={(cats) => this.setProductCategories(cats)} />
            </div>
            {/* Product filters */}
            <div className="form-group">
              <label className="form-label">{t('productFilters')}</label> <i className="fa fa-info-circle txt-info" id="productFilters"></i>
              <Tooltip placement="right" className="red-tooltip-inner" target="productFilters" isOpen={this.state.toggleProductFilters} toggle={() => { this.toggle('toggleProductFilters');}}>
                  {t('characteristicsTooltip')}
              </Tooltip>
              <ShopProductFilter ref="shopProductFilter" filters={this.state.filters} onChange={ (filters) => this.setProductFilters(filters) }/>
            </div>
          </div>
        </div>);
    }
}

export default translate('common', { wait: process && !process.release })(ShopSettings);
