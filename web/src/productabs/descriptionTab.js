import React, {Component} from "react";
import { translate } from 'react-i18next';
import { FormGroup, Label, UncontrolledTooltip } from 'reactstrap';
import { EditableText } from '../components';
import { EditProductStore } from '../stores/index';

class DescriptionTab extends Component {
    constructor(props) {
        super(props);
        this.validateDescription = this.validateDescription.bind(this);
        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.state = {
            isEditable : this.props.isEditable || false,
            product: this.props.product || {},
            shop: this.props.shop || {},
            tooltip: {
                toggleProductCategory: false
            }
        };
    }

    validateDescription() { // Validate the description.

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
        var characteristics = [];
        if (this.state.product.filters) {
            var groupedFilters = {};
            this.state.product.filters.forEach(function (filter) {
                var record = groupedFilters[filter.filter_id];
                if (!record) {
                    groupedFilters[filter.filter_id] = {label: filter.name, content: [filter.content]};
                } else {
                    record.content.push(filter.content);
                }
            });

            for (var groupedFilter in groupedFilters) {
                var o = groupedFilters[groupedFilter];
                characteristics.push((<tr>
                    <td>{o.label}</td>
                    <td>{o.content.join(',')}</td>
                </tr>));
            }
        }

        var productCategory = (<p>{t('unknown')}</p>);
        if (this.state.isEditable) {
            var productCategories = [];
            if (this.state.shop.product_categories && this.state.shop.product_categories.length > 0) {
                this.state.shop.product_categories.forEach(function(productCategory) {
                    productCategories.push((<option value={productCategory.id}>{productCategory.name}</option>));
                });
            }

            productCategory  = (
                <FormGroup>
                  <Label className="col-form-label">{t('chooseProductCategory')}  <i className="fa fa-info-circle txt-info" id="productCategory"></i></Label>
                  <UncontrolledTooltip placement="right" target="productCategory" className="red-tooltip-inner" isOpen={this.state.tooltip.toggleProductCategory} toggle={() => { this.toggleTooltip('toggleProductCategory'); }}>
                    {t('chooseProductCategoryTooltip')}
                  </UncontrolledTooltip>
                  <select name="productCategory" className="form-control">{productCategories}</select>
                </FormGroup>
            );
        } else {
            var filteredProductCategories = this.state.shop.product_categories.filter(function(c) { return c.id === self.state.product.category_id });
            if (filteredProductCategories && filteredProductCategories.length === 1) {
              productCategory = (<p>{filteredProductCategories[0].name}</p>);
            }            
        }

        return (
            <div>
                <h5>{t('description')}</h5>
                {this.state.isEditable ? (<EditableText value={this.state.product.description} validate={this.state.validateDescription} />) : (<p>{this.state.product.description}</p>)}
                <h5>{t('category')}</h5>
                {productCategory}
                <h5>{t('characteritics')}</h5>
                {characteristics.length === 0 ? (<span><i>{t('noCharacteristic')}</i></span>) : (
                    <table className="table table-striped">
                        <tbody>
                          {characteristics}
                        </tbody>
                    </table>
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
