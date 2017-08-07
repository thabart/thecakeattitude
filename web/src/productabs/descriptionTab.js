import React, {Component} from "react";
import { translate } from 'react-i18next';

class DescriptionTab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {t} = this.props;
        var self = this;
        var characteristics = [];
        if (this.props.product.filters) {
            var groupedFilters = {};
            this.props.product.filters.forEach(function (filter) {
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

        var productCategory = t('unknown')
        var filteredProductCategories = this.props.shop.product_categories.filter(function(c) { return c.id === self.props.product.category_id });
        if (filteredProductCategories && filteredProductCategories.length === 1) {
          productCategory = filteredProductCategories[0].name;
        }

        return (
            <div className="row">
                <h5 className="col-md-12">{t('description')}</h5>
                <p className="col-md-12">
                    {this.props.product.description}
                </p>
                <h5 className="col-md-12">{t('category')}</h5>
                <p className="col-md-12">
                  {productCategory}
                </p>
                <h5 className="col-md-12">{t('characteritics')}</h5>
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
}

export default translate('common', { wait: process && !process.release })(DescriptionTab);
