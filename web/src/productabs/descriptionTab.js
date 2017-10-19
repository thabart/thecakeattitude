import React, {Component} from "react";
import { translate } from 'react-i18next';
import { FormGroup, Label, UncontrolledTooltip } from 'reactstrap';
import { EditableTextArea, FilterSelector } from '../components';
import { EditProductStore } from '../stores/index';
import AppDispatcher from "../appDispatcher";
import Constants from "../../Constants";

class DescriptionTab extends Component {
    constructor(props) {
        super(props);
        this.updateDescription = this.updateDescription.bind(this);
        this.updateFilters = this.updateFilters.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.state = {
            isEditable : this.props.isEditable || false,
            product: this.props.product || {},
            shop: this.props.shop || {},
            tooltip: {
                toggleDescription: false,
                toggleProductCategory: false,
                toggleProductCharacteritics: false
            }
        };
    }

    updateDescription(description) { // Update the description.
        var product = this.state.product;
        product.description = description;
        this.setState({
            product: product
        });
        AppDispatcher.dispatch({
            actionName: Constants.events.UPDATE_PRODUCT_INFORMATION_ACT,
            data: { description: description }
        });
    }

    updateFilters(filters) { // Update the filters.
        var product = this.state.product;
        product.filters = filters;
        this.setState({
            product: product
        });
        AppDispatcher.dispatch({
            actionName: Constants.events.UPDATE_PRODUCT_INFORMATION_ACT,
            data: { filters: product.filters }
        });
    }

    updateCategory(e) { // Update the category.
        var val = e.target.value;
        var product = this.state.product;
        product.category_id = val;
        this.setState({
            product: product
        });
        AppDispatcher.dispatch({
            actionName: Constants.events.UPDATE_PRODUCT_INFORMATION_ACT,
            data: { category_id: val }
        });
    }

    toggleTooltip(name) { // Toggle the tooltip.
        var tooltip = this.state.tooltip;
        tooltip[name] = !tooltip[name];
        this.setState({
            tooltip: tooltip
        });
    }

    changeMode() { // Change the mode.
        var mode = EditProductStore.getMode();
        this.setState({
            isEditable   : mode !== 'view'
        });
    }

    render() { // Display the component.
        const {t} = this.props;
        var self = this;

        var productCategory = (<p>{t('unknown')}</p>);
        if (this.state.isEditable) {
            var productCategories = [];
            if (this.state.shop.product_categories && this.state.shop.product_categories.length > 0) {
                this.state.shop.product_categories.forEach(function(productCategory) {
                    if (productCategory.id === self.state.product.category_id) {
                        productCategories.push((<option value={productCategory.id} selected>{productCategory.name}</option>));
                    } else {
                        productCategories.push((<option value={productCategory.id}>{productCategory.name}</option>));
                    }
                });
            }

            productCategory  = (
                <FormGroup>
                  <select name="productCategory" className="form-control" onChange={self.updateCategory}>{productCategories}</select>
                </FormGroup>
            );
        } else {
            var filteredProductCategories = this.state.shop.product_categories.filter(function(c) { return c.id === self.state.product.category_id });
            if (filteredProductCategories && filteredProductCategories.length === 1) {
              productCategory = (<p>{filteredProductCategories[0].name}</p>);
            }
        }

        var filterSelector = (<span><i>{t('noCharacteristic')}</i></span>);
        if (this.state.product.filters && !this.state.isEditable) {
            var groupedFilters = {};
            this.state.product.filters.forEach(function (filter) {
                var record = groupedFilters[filter.filter_id];
                if (!record) {
                    groupedFilters[filter.filter_id] = {label: filter.name, content: [filter.content]};
                } else {
                    record.content.push(filter.content);
                }
            });

            var characteristics = [];
            for (var groupedFilter in groupedFilters) {
                var o = groupedFilters[groupedFilter];
                characteristics.push((<tr>
                    <td>{o.label}</td>
                    <td>{o.content.join(',')}</td>
                </tr>));
            }

            filterSelector = (
                <table className="table table-striped">
                    <tbody>
                        {characteristics}
                    </tbody>
                </table>
            );
        }
        if (this.state.isEditable) {
            filterSelector = (<FilterSelector ref="filterSelector" shopId={this.state.shop.id} filters={this.state.product.filters} onChange={this.updateFilters} />);
        }

        return (
            <div>
                {/* Description */}
                {this.state.isEditable && (
                  <div>
                    <h5>
                      {t('description')} <i className="fa fa-info-circle txt-info" id="descriptionToolTip"></i>
                      <UncontrolledTooltip placement="right" target="descriptionToolTip" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleDescription} toggle={() => { this.toggleTooltip('toggleDescription'); }}>
                        {t('productDescriptionTooltip')}
                      </UncontrolledTooltip>
                    </h5>
                    <EditableTextArea value={this.state.product.description} validate={this.updateDescription} minLength={1} maxLength={255} />
                  </div>
                )}
                {!this.state.isEditable && (
                  <div>
                    <h5>{t('description')}</h5>
                    <p>{this.state.product.description}</p>
                  </div>
                )}
                {/* Category */}
                {this.state.isEditable && (
                  <div>
                    <h5>
                      {t('category')} <i className="fa fa-info-circle txt-info" id="productCategory"></i>
                      <UncontrolledTooltip placement="right" target="productCategory" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleProductCategory} toggle={() => { this.toggleTooltip('toggleProductCategory'); }}>
                        {t('chooseProductCategoryTooltip')}
                      </UncontrolledTooltip>
                    </h5>
                    {productCategory}
                  </div>
                )}
                {!this.state.isEditable && (
                  <div>
                    <h5>{t('category')}</h5>
                    {productCategory}
                  </div>
                )}
                {/* Characteritics */}
                {this.state.isEditable && (
                  <div>
                    <h5>
                      {t('characteritics')} <i className="fa fa-info-circle txt-info" id="productCharacteritics"></i>
                      <UncontrolledTooltip placement="right" target="productCharacteritics" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleProductCharacteritics} toggle={() => { this.toggleTooltip('toggleProductCharacteritics'); }}>
                        {t('productCharacteristicTooltip')}
                      </UncontrolledTooltip>
                    </h5>
                    {filterSelector}
                  </div>
                )}
                {!this.state.isEditable && (
                  <div>
                      <h5>{t('characteritics')}</h5>
                      {filterSelector}
                  </div>
                )}
            </div>
        );
    }

    componentWillMount() { // Execute before the render.
        EditProductStore.addModeChangeListener(this.changeMode);
    }

    componentWillUnmount() { // Unregister the events.
        EditProductStore.removeModeChangeListener(this.changeMode);
    }
}

export default translate('common', { wait: process && !process.release })(DescriptionTab);
