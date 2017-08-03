import React, {Component} from "react";
import { Alert } from "reactstrap";
import { ProductsService } from "../services/index";
import { translate } from 'react-i18next';
import ProductElt from "./productElt";
import AppDispatcher from "../appDispatcher";
import Constants from '../../Constants';
import $ from "jquery";

var json = {start_index: 0, count: 5, contains_valid_promotions: true};

class BestDeals extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
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

    navigateDeals(e, name) {   // Navigate through the pages.
        e.preventDefault();
        var startIndex = name - 1;
        json = $.extend({}, json, {
            start_index: startIndex
        });
        this.displayBestDeals();
    }

    toggleError() { // Toggle the error.
        this.setState({
            errorMessage: null
        });
    }

    displayBestDeals() { // Display the best deals.
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

    render() { // Returns the view.
        var products = [],
            navigations = [],
            self = this;

        const {t} = this.props;
        if (this.state.products && this.state.products.length > 0) {
            this.state.products.forEach(function (product) {
                products.push((<ProductElt className="col-md-6" product={product}/>));
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
            <section>
                <h5 className="col-md-12">{t('bestDeals')}</h5>
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
                    products.length == 0 ? (<span>{t('noDeals')}</span>) :
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

    componentWillMount() { // Execute after the render.
        var shopId = this.props.shop.id,
            self = this;
        self._waitForToken = AppDispatcher.register(function (payload) {
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
        self.displayBestDeals();
    }

    componentWillUnmount() { // Unregister.
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(BestDeals);
