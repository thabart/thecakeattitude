import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { translate } from 'react-i18next';
import Rater from "react-rater";
import "../styles/productElt.css";

class ProductElt extends Component {
    constructor(props) {
        super(props);
    }

    render() { // Returns the view.
        var imageUrl = "#",
            product = this.props.product,
            self = this;
        const {t} = this.props;
        if (product.images && product.images.length > 0) {
            imageUrl = product.images[0];
        }

        var filters = [];
        if (product.filters) {
            var groupedFilters = {};
            product.filters.forEach(function (filter) {
                var record = groupedFilters[filter.filter_id];
                if (!record) {
                    groupedFilters[filter.filter_id] = {label: filter.name, content: [filter.content]};
                } else {
                    record.content.push(filter.content);
                }
            });

            for (var groupedFilter in groupedFilters) {
                var o = groupedFilters[groupedFilter];
                filters.push((<li>{o.label} : {o.content.join(',')}</li>));
            }
        }

        var newPrice = null,
            promotion = null;
        if (product.promotions && product.promotions.length > 0) {
            promotion = product.promotions[0];
            newPrice = product.new_price;
        }

        return (
            <div className={this.props.className + " product-item"}>
              <div className="content">
                {newPrice !== null ? (<div className="best-deals"><img src="/images/hot_deals.png" width="60"/></div>) : ''}
                <NavLink className="no-decoration row" to={'/products/' + product.id}>
                    <div className="col-md-3">
                        <img src={imageUrl} className="rounded" width="140" height="140"/>
                    </div>
                    <div className="col-md-5">
                        <h3>{product.name}</h3>
                        <Rater total={5} rating={product.average_score}
                               interactive={false}/>{product.comments && product.comments.length > 0 && (
                        <label>{t('comments')} : {product.nb_comments}</label>)}
                        <p>
                            {product.description}
                        </p>
                    </div>
                    <div className="col-md-4">
                        {newPrice == null ? (<h4 className="price">€ {product.price}</h4>) : (
                            <div>
                                <h4 className="price inline"><strike>€ {product.price}</strike></h4>
                                (<i>-{promotion.discount}%</i>)
                                <h4 className="price"> € {newPrice}</h4>
                            </div>
                        )}
                        <ul>
                            {filters}
                        </ul>
                        <button className="btn btn-default">{t('addToCart')}</button>
                    </div>
                </NavLink>
              </div>
            </div>
        )
    }
}

export default translate('common', { wait: process && !process.release })(ProductElt);
