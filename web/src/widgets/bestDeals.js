import React, {Component} from "react";
import {ProductsService} from "../services/index";
import Rater from "react-rater";
import Widget from "../components/widget";
import Constants from "../../Constants";
import {Button} from 'reactstrap';
import $ from "jquery";
import AppDispatcher from "../appDispatcher";

class BestDeals extends Component {
    constructor(props) {
        super(props);
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

    localize(e, product) {
      e.preventDefault();
      e.stopPropagation();
      this.props.setCurrentMarker(product.shop_id);
    }

    // Navigate to the product page
    navigateProduct(e, id) {
        e.preventDefault();
        this.props.history.push('/products/' + id);
    }

    // Navigate through the pages
    navigate(e, name) {
        e.preventDefault();
        var startIndex = name - 1;
        var request = $.extend({}, this.request, {
            start_index: startIndex
        });
        this.display(request);
    }

    // Refresh
    refresh(json) {
        var request = $.extend({}, json, {
            orders: [
                {target: "update_datetime", method: "desc"}
            ],
            count: 5,
            contains_valid_promotions: true
        });
        this.request = request;
        this.display(request);
    }

    reset() {
      this.setState({
        products: [],
        navigation: []
      });
    }

    // Display the list
    display(request) {
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

    enableMove(b) {
      this.refs.widget.enableMove(b);
    }

    // Render the view
    render() {
        var title = "Best deals",
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
                var firstPromotion = product['promotions'][0];
                if (!productImage || productImage.length === 0) {
                    productImage = "/images/jean.jpg";
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
                           <p>
                               <h5 className="price inline"><strike>€ {product.price}</strike></h5>
                               (<i>-{firstPromotion.discount}%</i>)
                               <h5 className="price inline">€ {product.new_price}</h5>
                           </p>
                       </div>
                       <div className="last-column">
                        <Button outline color="secondary" size="sm" onClick={(e) => { self.localize(e, product); }}>
                          <i className="fa fa-map-marker localize" aria-hidden="true"></i>
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

    componentWillMount() {
        var self = this;
        AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case 'new-product-comment':
                case 'remove-product-comment':
                    var request = $.extend({}, self.request, {
                        start_index: 0
                    });
                    self.display(request);
                    break;
            }
        });
    }
}

export default BestDeals;
