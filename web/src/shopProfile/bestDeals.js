import React, {Component} from "react";
import {Alert} from "reactstrap";
import {ProductsService} from "../services/index";
import ProductElt from "./productElt";
import $ from "jquery";
import AppDispatcher from "../appDispatcher";

var json = {start_index: 0, count: 5, contains_valid_promotions: true};

class BestDeals extends Component {
    constructor(props) {
        super(props);
        this.displayBestDeals = this.displayBestDeals.bind(this);
        this.toggleError = this.toggleError.bind(this);
        this.navigateDeals = this.navigateDeals.bind(this);
        this.state = {
            products: [],
            navigation: [],
            isBestDealsLoading: false,
            errorMessage: null,
        };
    }

    // Navigate through the pages
    navigateDeals(e, name) {
        e.preventDefault();
        var startIndex = name - 1;
        json = $.extend({}, json, {
            start_index: startIndex
        });
        this.displayBestDeals();
    }

    // Toggle the error
    toggleError() {
        this.setState({
            errorMessage: null
        });
    }

    // Display the best deals
    displayBestDeals() {
        var self = this;
        self.setState({
            isBestDealsLoading: true
        });
        ProductsService.search(json).then(function (r) {
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
                isBestDealsLoading: false
            });
        }).catch(function () {
            self.setState({
                isBestDealsLoading: false
            });
        });
    }

    // Returns the view
    render() {
        var products = [],
            navigations = [],
            self = this;

        if (this.state.products && this.state.products.length > 0) {
            this.state.products.forEach(function (product) {
                products.push((<ProductElt className="col-md-6 row" product={product}/>));
            });
        }

        if (this.state.navigation && this.state.navigation.length > 1) {
            this.state.navigation.forEach(function (nav) {
                navigations.push((<li className="page-item"><a href="#" className="page-link" onClick={(e) => {
                    self.navigateDeals(e, nav.name);
                }}>{nav.name}</a></li>));
            });
        }

        return (
            <section className="row section white-section shop-section shop-section-padding">
                <h5 className="col-md-12">Best deals</h5>
                <div className="col-md-12">
                    <Alert color="danger"
                           isOpen={this.state.errorMessage !== null}
                           toggle={this.toggleError}>
                        {this.state.errorMessage}
                    </Alert>
                </div>
                {this.state.isBestDealsLoading ?
                    (
                        <div className="col-md-12">
                            <i className='fa fa-spinner fa-spin'/>
                        </div>
                    ) :
                    products.length == 0 ? (<span>No deals</span>) :
                        (<div className="col-md-12">
                            <div className="col-md-12">
                                <ul className="pagination">
                                    {navigations}
                                </ul>
                            </div>
                            <div className="col-md-12">
                                <div className="row">
                                    {products}
                                </div>
                            </div>
                        </div>)
                }
            </section>
        );
    }

    // Execute after the render
    componentWillMount() {
        var shopId = this.props.shop.id,
            self = this;
        AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case 'new-product-comment':
                case 'remove-product-comment':
                    json = $.extend({}, json, {
                        start_index: 0
                    });
                    self.displayBestDeals();
                    break;
            }
        });
        json['shop_id'] = shopId;
        this.displayBestDeals();
    }
}

export default BestDeals;
