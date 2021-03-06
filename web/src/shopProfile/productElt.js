import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { translate } from 'react-i18next';
import { SessionService, OrdersService, ProductsService } from '../services/index';
import { ApplicationStore } from '../stores/index';
import { Badge } from 'reactstrap';
import Rater from "react-rater";
import "../styles/productElt.css";

class ProductElt extends Component {
    constructor(props) {
        super(props);
        this.addToCart = this.addToCart.bind(this);
        this.remove = this.remove.bind(this);
        this.state = {
          shop: this.props.shop || {},
          isLoading: false
        };
    }

    remove(e, productId) { // Remove the product.
      e.preventDefault();
      var self = this;
      const {t} = self.props;
      self.setState({
        isLoading: true
      });
      ProductsService.remove(productId).catch(function(e) {
          var json = e.responseJSON;
          var error = t('errorRemoveProduct');
          if (json && json.error_description) {
              error = json.error_description;
          }

          ApplicationStore.sendMessage({
            message: error,
            level: 'error',
            position: 'tr'
          });
          self.setState({
            isLoading: false
          });
      });
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
            isTagsDisplayed = this.props.tagsDisplayed || false,
            tags = [],
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

        var bestDiscount = null;
        if (product.discounts && product.discounts.length > 0) {
            product.discounts.forEach(function(discount) {
                if (!bestDiscount || bestDiscount === null || bestDiscount.money_saved < discount.money_saved) {
                    bestDiscount = discount;
                }
            });
        }

        if (isTagsDisplayed) {
          tags = product.tags.map(function(tag) { return (<li>{tag}</li>); });
        }

        var description = product.description.length > 70 ? product.description.substring(0, 67) + "..." : product.description;
        var isLoggedIn = SessionService.isLoggedIn();
        var user = ApplicationStore.getUser();
        var isOwner = false;
        if (isLoggedIn && user && this.state.shop) {
          isOwner = user.sub === this.state.shop.subject;
        }

        return (
            <div className={this.props.className + " product-item"}>
              { this.state.isLoading && ( <div className="content"><i className='fa fa-spinner fa-spin'></i></div> ) }
              { !this.state.isLoading && (
                <div className="content">
                  {bestDiscount !== null ? (<div className="best-deals"><img src="/images/hot_deals.png" width="60"/></div>) : ''}
                  <NavLink className="no-decoration row" to={'/products/' + product.id}>
                      <div className="col-md-3">
                          <img src={imageUrl} className="rounded" width="140" height="140"/>
                      </div>
                      <div className="col-md-4">
                          <h3>{product.name}</h3>
                          <Rater total={5} rating={product.average_score}
                                 interactive={false}/>{product.comments && product.comments.length > 0 && (
                          <label>{t('comments')} : {product.nb_comments}</label>)}
                          {tags.length > 0 && (
                            <ul className="tags no-padding gray">
                              {tags}
                            </ul>
                          )}
                          <p style={{wordBreak: "break-all"}}>
                              {description}
                          </p>
                      </div>
                      <div className="col-md-5">
                          {bestDiscount == null ? (<h4 className="price">€ {product.price}</h4>) : (
                              <div>
                                 <h5 className="inline">
                                     <Badge color="success">
                                       <strike style={{color: "white"}}>€ {product.price}</strike>
                                       <i style={{color: "white"}} className="ml-1">- € {bestDiscount.money_saved}</i>
                                     </Badge>
                                 </h5>
                                 <h5 className="inline ml-1">€ {(product.price - bestDiscount.money_saved)}</h5>
                              </div>
                          )}
                          <ul>
                              {filters}
                          </ul>
                          { isLoggedIn && ( <a href="#" className="btn btn-default" onClick={this.addToCart}>{t('addToCart')}</a> ) }
                          { isOwner && ( <a href="#" className="btn btn-default" onClick={(e) => this.remove(e, product.id)}>{t('remove')}</a>) }
                      </div>
                  </NavLink>
                </div>
              ) }
            </div>
        )
    }
}

export default translate('common', { wait: process && !process.release })(ProductElt);
