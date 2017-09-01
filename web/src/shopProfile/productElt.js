import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { translate } from 'react-i18next';
import { SessionService, OrdersService } from '../services/index';
import { ApplicationStore } from '../stores/index';
import Rater from "react-rater";
import "../styles/productElt.css";

class ProductElt extends Component {
    constructor(props) {
        super(props);
        this.addToCart = this.addToCart.bind(this);
    }

    addToCart(e) { // Add the product to the cart.
      e.stopPropagation();
      e.preventDefault();
      const {t} = this.props;
      var product = this.props.product;
      OrdersService.add({ product_id: product.id }).catch(function(e) {
        var errorMsg = t('addBasketError');
        if (e.responseJSON && e.responseJSON.error_description) {
          errorMsg = e.responseJSON.error_description;
        }

        ApplicationStore.sendMessage({
          message: errorMsg,
          level: 'error',
          position: 'tr'
        });
      });
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

        var description = product.description.length > 70 ? product.description.substring(0, 67) + "..." : product.description;
        var isLoggedIn = SessionService.isLoggedIn();
        return (
            <div className={this.props.className + " product-item"}>
              <div className="content">
                {newPrice !== null ? (<div className="best-deals"><img src="/images/hot_deals.png" width="60"/></div>) : ''}
                <NavLink className="no-decoration row" to={'/products/' + product.id}>
                    <div className="col-md-3">
                        <img src={imageUrl} className="rounded" width="140" height="140"/>
                    </div>
                    <div className="col-md-4">
                        <h3>{product.name}</h3>
                        <Rater total={5} rating={product.average_score}
                               interactive={false}/>{product.comments && product.comments.length > 0 && (
                        <label>{t('comments')} : {product.nb_comments}</label>)}
                        <p style={{wordBreak: "break-all"}}>
                            {description}
                        </p>
                    </div>
                    <div className="col-md-5">
                        {newPrice == null ? (<h4 className="price">€ {product.price}</h4>) : (
                            <div>
                                <h4 className="price inline">
                                  <span className="badge badge-success">
                                    <strike style={{color: "white"}}>€ {product.price}</strike>
                                    <i className="ml-1" style={{color: "white"}}>
                                      -{promotion.discount}%
                                    </i>
                                  </span>
                                </h4>
                                <h4 className="inline ml-1">€ {newPrice}</h4>
                            </div>
                        )}
                        <ul>
                            {filters}
                        </ul>
                        {isLoggedIn && ( <a href="#" className="btn btn-default" onClick={this.addToCart}>{t('addToCart')}</a> )}
                    </div>
                </NavLink>
              </div>
            </div>
        )
    }
}

export default translate('common', { wait: process && !process.release })(ProductElt);
