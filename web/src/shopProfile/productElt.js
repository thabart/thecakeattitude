import React, {Component} from "react";
import Constants from "../../Constants";
import {withRouter} from "react-router";
import Rater from "react-rater";
import "./productElt.css";

class ProductElt extends Component {
    constructor(props) {
        super(props);
        this.navigateShop = this.navigateProduct.bind(this);
    }

    navigateProduct(productId) {
        this.props.history.push('/products/' + productId);
    }

    render() {
        var imageUrl = "#",
            product = this.props.product,
            self = this;
        // Set default url
        if (product.images && product.images.length > 0) {
            imageUrl = Constants.apiUrl + product.images[0];
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

        return (<section
            className={newPrice == null ? this.props.className + " product-item" : this.props.className + " product-item is-best-deals"}
            onClick={(e) => {
                self.navigateProduct(product.id);
            }}>
            <div className="col-md-3">
                <img src={imageUrl} className="rounded" width="140" height="140"/>
                <div className="best-deals">
                    <img src="/images/hot_deals.png" width="60"/>
                </div>
            </div>
            <div className="col-md-5">
                <h3>{product.name}</h3>
                <Rater total={5} rating={product.average_score}
                       interactive={false}/>{product.comments && product.comments.length > 0 && (
                <label>Comments : {product.nb_comments}</label>)}
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
                <button className="btn btn-success">BUY</button>
            </div>
        </section>)
    }
}

export default withRouter(ProductElt);
