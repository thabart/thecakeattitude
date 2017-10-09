import React, { Component } from "react";
import { ProductsService } from "../services/index";
import { Button, Badge } from 'reactstrap';
import { translate } from 'react-i18next';
import Widget from "../components/widget";
import Constants from "../../Constants";
import AppDispatcher from "../appDispatcher";
import Rater from "react-rater";
import $ from "jquery";

class BestDeals extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
        this.navigate = this.navigate.bind(this);
        this.navigateProduct = this.navigateProduct.bind(this);
        this.localize = this.localize.bind(this);
        this.state = {
            errorMessage: null,
            isLoading: false,
            products: [],
            navigation: []
        };
    }

    localize(e, product) { // Set the current marker.
      e.preventDefault();
      e.stopPropagation();
      this.props.setCurrentMarker(product.shop_id);
    }

    navigateProduct(e, id) { // Navigate to the product page
        e.preventDefault();
        this.props.history.push('/products/' + id);
    }

    navigate(e, name) {   // Navigate through the pages
        e.preventDefault();
        var startIndex = name - 1;
        var request = $.extend({}, this.request, {
            start_index: startIndex
        });
        this.display(request);
    }

    refresh(json) { // Refresh
        var request = $.extend({}, json, {
            orders: [
                {target: "best_deals", method: "desc"}
            ],
            count: 5,
            contains_valid_promotions: true
        });
        this.request = request;
        this.display(request);
    }

    reset() { // Reset the products.
      this.setState({
        products: [],
        navigation: []
      });
    }

    display(request) {   // Display the list
        var self = this;
        self.setState({
            isLoading: true
        });
        ProductsService.search(request).then(function (r) {
            var products = r['_embedded'],
                navigation = r['_links']['navigation'];
            if (!(products instanceof Array)) {
                products = [products];
            }
            if (!(navigation instanceof Array)) {
                navigation = [navigation];
            }

            self.setState({
                products: products,
                navigation: navigation,
                isLoading: false
            });
        }).catch(function () {
            self.setState({
                products: [],
                navigation: [],
                isLoading: false
            });
        });
    }

    enableMove(b) { // Enable widget movement.
      this.refs.widget.enableMove(b);
    }

    render() {   // Render the view
      const {t} = this.props;
        var title = t('bestDealsWidgetTitle'),
            content = [],
            navigations = [],
            self = this;
        if (this.state.isLoading) {
            return (
                <Widget title={title} onClose={this.props.onClose} ref="widget">
                    <i className='fa fa-spinner fa-spin'></i>
                </Widget>);
        }

        if (this.state.products && this.state.products.length > 0) {
            this.state.products.forEach(function (product) {
                var productImage = product['images'];
                var maxDiscount = null;
                product['discounts'].forEach(function(discount) {
                    if (!maxDiscount || maxDiscount === null || maxDiscount.money_saved < discount.money_saved) {
                        maxDiscount = discount;
                    }
                });

                if (!productImage || productImage.length === 0) {
                    productImage = "/images/default-product.jpg";
                } else {
                    productImage = productImage[0];
                }

                content.push((
                    <a href="#" className="list-group-item list-group-item-action no-padding"
                       onClick={(e) => {
                           self.navigateProduct(e, product.id);
                       }}>
                       <div className="first-column">
                           <img src={productImage} className="img-thumbnail rounded picture image-small"/>
                       </div>
                       <div className="second-column">
                           <div>{product.name}</div>
                           <Rater total={5} rating={product.average_score} interactive={false}/>
                           <div>
                               <h5 className="inline">
                                   <Badge color="success">
                                     <strike style={{color: "white"}}>€ {product.price}</strike>
                                     <i style={{color: "white"}} className="ml-1">- € {maxDiscount.money_saved}</i>
                                   </Badge>
                               </h5>
                               <h5 className="inline ml-1">€ {(product.price - maxDiscount.money_saved)}</h5>
                           </div>
                       </div>
                       <div className="last-column">
                        <Button outline color="secondary" size="sm" onClick={(e) => { self.localize(e, product); }}>
                          <i className="fa fa-map-marker localize" aria-hidden="true"></i>
                        </Button>
                        <Button outline color="secondary" size="sm">
                          <i className="fa fa-gamepad gamepad"></i>
                        </Button>
                       </div>
                    </a>));
            });
        }

        if (this.state.navigation && this.state.navigation.length > 1) {
            this.state.navigation.forEach(function (nav) {
                navigations.push((
                    <li className="page-item"><a href="#" className="page-link" onClick={(e) => {
                        self.navigate(e, nav.name);
                    }}>{nav.name}</a></li>
                ));
            });
        }

        return (
            <Widget title={title} onClose={this.props.onClose} ref="widget">
                {navigations.length > 0 && (
                    <ul className="pagination">
                        {navigations}
                    </ul>
                )}
                {content.length == 0
                    ? (<span>No deals</span>) :
                    (<ul className="list-group list-group-flush">
                        {content}
                    </ul>)
                }
            </Widget>
        );
    }

    componentDidMount() { // Execute before the render.
        var self = this;
        this._waitForToken = AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case Constants.events.NEW_PRODUCT_COMMENT_ARRIVED:
                case Constants.events.REMOVE_PRODUCT_COMMENT_ARRIVED:
                    var request = $.extend({}, self.request, {
                        start_index: 0
                    });
                    self.display(request);
                    break;
            }
        });
    }

    componentWillUnmount() { // Unregister the events.
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release, withRef: true })(BestDeals);
