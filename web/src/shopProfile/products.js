import React, {Component} from "react";
import { Range } from "rc-slider";
import { Alert } from "reactstrap";
import { ProductsService } from "../services/index";
import { NavLink } from "react-router-dom";
import { translate } from 'react-i18next';
import ProductElt from "./productElt";
import AppDispatcher from "../appDispatcher";
import $ from "jquery";

const minPrice = 1;
const maxPrice = 30000;
const defaultCount = 3;

class ShopProducts extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
        this._page = '1';
        this._filterJson = {
            orders: [{target: 'update_datetime', method: 'desc'}],
            start_index: 0,
            count: defaultCount,
            min_price: minPrice,
            max_price: maxPrice,
            filters: []
        };
        this.changePrice = this.changePrice.bind(this);
        this.toggleError = this.toggleError.bind(this);
        this.filter = this.filter.bind(this);
        this.toggleProductError = this.toggleProductError.bind(this);
        this.priceChange = this.priceChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.changePage = this.changePage.bind(this);
        this.search = this.search.bind(this);
        this.handleBestDeals = this.handleBestDeals.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.changeOrder = this.changeOrder.bind(this);
        this.state = {
            minPrice: minPrice,
            maxPrice: maxPrice,
            errorMessage: null,
            isLoading: false,
            products: [],
            filters: [],
            pagination: [],
            isProductsLoading: false,
            productErrorMessage: null,
            productName: null,
            bestDeals: false,
            activeCategory: null,
            isEditable: props.isEditable,
            shop: props.shop
        };
    }

    search() { // Search products by name.
        this._filterJson['name'] = this.state.productName;
        this.updateProducts();
    }

    filter(e, filterId, filterValue) { // Filter products.
        var filter = null,
            indice = -1,
            self = this;
        if (!$(e.target).is(':checked')) {
            self._filterJson.filters.forEach(function (f, e) {
                if (f.id === filterId) {
                    filter = f;
                    indice = e;
                }
            });

            if (indice > -1) {
                self._filterJson.filters.splice(indice, 1);
            }
        }
        else {
            self._filterJson.filters.push({
                id: filterId,
                value: filterValue
            });
        }

        self._filterJson['start_index'] = 0;
        this.updateProducts();
    }

    updateProducts() { // Update list of products.
        var self = this;
        const {t} = this.props;
        self.setState({
            isProductsLoading: true
        });
        ProductsService.search(self._filterJson).then(function (record) {
            var products = record['_embedded'];
            var pagination = record['_links'].navigation;
            if (!(products instanceof Array)) {
                products = [products];
            }

            self.setState({
                isProductsLoading: false,
                products: products,
                pagination: pagination
            });
        }).catch(function () {
            self.setState({
                isProductsLoading: false,
                productErrorMessage: t('errorFilterProducts')
            });
        });

    }

    toggleProductError() { // Toggle product error message.
        this.setState({
            productErrorMessage: null
        });
    }

    toggleError() { // Toggle error message.
        this.setState({
            errorMessage: null
        });
    }

    changePrice(p) { // Change price range.
        this.setState({
            minPrice: p[0],
            maxPrice: p[1]
        });
    }

    handleInputChange(e) { // Handle input change.
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handlePriceChange(e) { // Handle price change.
        const target = e.target;
        const name = target.name;
        if (!target.value || target.value === "") {
            return;
        }
        this.state[name] = target.value;
        this.setState({
            [name]: target.value
        });
        if (name === 'minPrice') {
            this.refs.priceRange.state.bounds[0] = target.value;
        } else {
            this.refs.priceRange.state.bounds[1] = target.value;
        }

        this.priceChange();
    }

    handleBestDeals(e) { // Handle best price.
        var isChecked = $(e.target).is(':checked');
        if (isChecked) {
            this._filterJson['contains_valid_promotions'] = true;
        } else {
            this._filterJson['contains_valid_promotions'] = '';
        }

        this.updateProducts();
    }

    selectCategory(e, id) { // Display the products in the specified category.
        e.preventDefault();
        if (id === null) {
            delete this._filterJson['category_id'];
        } else {
            this._filterJson['category_id'] = id;
        }

        this.setState({
            activeCategory: id
        });
        this.updateProducts();
    }

    priceChange() { // Display the products with a price comprised in a range.
        this._filterJson['min_price'] = this.state.minPrice;
        this._filterJson['max_price'] = this.state.maxPrice;
        this._filterJson['start_index'] = 0;
        this.updateProducts();
    }

    changePage(e, page) { // Change the page.
        e.preventDefault();
        this._page = page;
        this._filterJson['start_index'] = (page - 1) * defaultCount;
        this.updateProducts();
    }

    changeOrder(e) { // Change the order.
        var selected = $(e.target).find(':selected');
        var obj = {
            target: $(selected).data('target'),
            method: $(selected).data('method')
        };
        this._filterJson.orders = [obj];
        this.updateProducts();
    }

    render() { // Display the view.
        const {t} = this.props;
        if (this.state.isLoading) {
            return (<div><i className='fa fa-spinner fa-spin'></i></div>);
        }

        if (this.state.errorMessage && this.state.errorMessage !== null) {
            return (<div>
              <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert>
            </div>);
        }

        var products = [],
            filters = [],
            productCategories = [(<li className="nav-item">
              <a className={this.state.activeCategory == null ? "nav-link active" : "nav-link"} href="#" onClick={(e) => { this.selectCategory(e, null);}}>
                {t('all')}
              </a>
            </li>)],
            pagination = [],
            self = this;
        if (this.state.products) {
            this.state.products.forEach(function (product) {
                products.push((<ProductElt product={product} className="col-md-12"/>));
            });
        }

        if (this.state.filters) {
            this.state.filters.forEach(function (filter) {
                var lst = [];
                if (filter.values) {
                    filter.values.forEach(function (value) {
                        lst.push((<li><input type="checkbox" onClick={(e) => {
                            self.filter(e, filter.id, value.content);
                        }}/><label>{value.content}</label></li>))
                    });
                }

                filters.push((<div className="form-group filter"><label>{filter.name}</label>
                    <ul className="list-unstyled">{lst}</ul>
                </div>))
            });
        }

        if (this.state.pagination && this.state.pagination.length > 1) {
            this.state.pagination.forEach(function (page) {
                pagination.push((<li className="page-item">
                  <a className={self._page === page.name ? "page-link active" : "page-link"} href="#" onClick={(e) => { self.changePage(e, page.name);}}>
                    {page.name}
                  </a>
                </li>))
            });
        }

        if (this.state.shop && this.state.shop.product_categories) {
            var arr = this.state.shop.product_categories;
            if (!(arr instanceof Array)) {
                arr = [arr];
            }

            arr.forEach(function (cat) {
                productCategories.push((<li className="nav-item">
                  <a className={self.state.activeCategory == cat.id ? "nav-link active" : "nav-link"} href="#" onClick={(e) => { self.selectCategory(e, cat.id);}}>
                    {cat.name}
                  </a>
                </li>))
            });
        }

        return (
                <section className="section row" style={{marginTop: "20px", paddingTop: "20px"}}>
                  { /*  Add product btn */ }
                  { this.state.isEditable && (
                    <div className="col-md-12">
                      <NavLink className="btn btn-default" to={'/addproduct/' + this.props.shop.id}>
                        <i className="fa fa-plus"></i> {t('addProduct')}
                      </NavLink>
                    </div>
                    )
                  }
                  { /* Content */ }
                  <div className="col-md-12 row">
                    { /* Filters */ }
                    <div className="col-md-3">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                this.search();
                            }}>
                                <div className="form-group">
                                    <label>{t('productName')}</label>
                                    <input type="text" className="form-control" name="productName" onChange={this.handleInputChange}/>
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-default" onClick={this.search}>{t('search')}</button>
                                </div>
                            </form>
                            <div className="form-group filter">
                                <input type="checkbox" onClick={this.handleBestDeals}/> {t('bestDeals')}
                            </div>
                            <div className="form-group filter">
                                <label>{t('price')}</label>
                                <Range min={minPrice} ref="priceRange" max={maxPrice}
                                       defaultValue={[minPrice, maxPrice]}
                                       onChange={this.changePrice} onAfterChange={this.priceChange}/>
                                <div className="row">
                                    <span className="col-md-4">{t('minEuro')}</span><input type="text" name="minPrice"
                                                                                  className="form-control col-md-6"
                                                                                  onChange={this.handlePriceChange}
                                                                                  value={this.state.minPrice}/>
                                </div>
                                <div className="row">
                                    <span className="col-md-4">{t('maxEuro')}</span><input type="text" name="maxPrice"
                                                                                  className="form-control col-md-6"
                                                                                  onChange={this.handlePriceChange}
                                                                                  value={this.state.maxPrice}/>
                                </div>
                            </div>
                            {filters}
                    </div>
                    { /* List of products */ }
                    <div className="col-md-9">
                            <Alert color="danger" isOpen={this.state.productErrorMessage !== null}
                                   toggle={this.toggleProductError}>{this.state.productErrorMessage}</Alert>
                            <div className="col-md-12">
                                <ul className="nav nav-pills shop-products-menu">
                                    {productCategories}
                                </ul>
                                <div className="col-md-4 offset-md-8">
                                    <label>{t('filterBy')}</label>
                                    <select className="form-control" onChange={(e) => {
                                        this.changeOrder(e);
                                    }}>
                                        <option data-target="update_datetime" data-method="desc">{t('latest')}</option>
                                        <option data-target="price" data-method="asc">{t('priceAsc')}</option>
                                        <option data-target="price" data-method="desc">{t('priceDesc')}</option>
                                    </select>
                                </div>
                                { this.state.isProductsLoading ? (
                                    <div className="col-md-8"><i className='fa fa-spinner fa-spin'></i></div>) : (
                                    <div>
                                        {products.length === 0 ? (<span>{t('noProducts')}</span>) : products}
                                    </div>
                                )}
                                {pagination.length > 0 && (<ul className="pagination">
                                    {pagination}
                                </ul>)}
                            </div>
                    </div>
                  </div>
                </section>
        );
    }

    // Execute after the render
    componentDidMount() {
        var self = this,
            shopId = this.props.shop.id,
            filters = this.props.shop.filters
        self._waitForToken = AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case 'new-product-comment': // When a comment is removed or added => refresh the list.
                case 'remove-product-comment':
                    if (payload.data.shop_id === shopId) {
                      self._filterJson = $.extend({}, self._filterJson, {
                        start_index: 0
                      });
                      self.updateProducts();
                    }
                    break;
                case 'new-product': // When a product is added to the shop => refresh the list.
                  if (payload.data.shop_id === shopId) {
                    self._filterJson = $.extend({}, self._filterJson, {
                      start_index: 0
                    });
                    self.updateProducts();
                  }
                break;
            }
        });
        self.setState({
            isLoading: true
        });
        self._filterJson['shop_id'] = shopId;
        self.setState({
            isLoading: false,
            filters: filters
        });
        self.updateProducts();
    }

    componentWillUnmount() {
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(ShopProducts);
