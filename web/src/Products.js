import React, {Component} from "react";
import {Alert, TabContent, TabPane, Nav, NavItem, NavLink, Badge, Breadcrumb, BreadcrumbItem} from "reactstrap";
import Rater from "react-rater";
import {withRouter} from "react-router";
import Constants from "../Constants";
import Magnify from "react-magnify";
import "react-magnify/lib/react-magnify.css";
import {ProductsService} from "./services/index";
import {DescriptionTab, ProductComment} from "./productabs";
import $ from "jquery";
import classnames from "classnames";
import "./styles/Palette.css";

class Products extends Component {
    constructor(props) {
        super(props);
        this.toggleError = this.toggleError.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.refresh = this.refresh.bind(this);
        this.refreshScore = this.refreshScore.bind(this);
        this.navigateGeneral = this.navigateGeneral.bind(this);
        this.navigateComments = this.navigateComments.bind(this);
        this.state = {
            isLoading: false,
            errorMessage: null,
            currentImageIndice: 0,
            product: null,
            shop: null
        };
    }

    refreshScore(data) {
        var product = this.state.product;
        product['average_score'] = data['average_score'];
        product['nb_comments'] = data['nb_comments'];
        this.refs.score.setState({
            rating: product['average_score']
        });
        this.setState({
            product: product
        });
    }

    refresh() {
        var self = this;
        self.setState({
            isLoading: true
        });
        ProductsService.get(this.props.match.params.id).then(function (r) {
            self.setState({
                isLoading: false,
                product: r['_embedded']
            });
        }).catch(function (e) {
            var json = e.responseJSON;
            var error = "An error occured while trying to retrieve the product";
            if (json && json.error_description) {
                error = json.error_description;
            }

            self.setState({
                errorMessage: error,
                isLoading: false
            });
        });
    }

    toggleError() {
        this.setState({
            errorMessage: null
        });
    }

    changeImage(e) {
        e.preventDefault();
        var indice = $(e.target).data('id');
        this.setState({
            currentImageIndice: indice
        });
    }

    // Navigate to the shop
    navigateShop(e, shopId) {
        e.preventDefault();
        this.props.history.push('/shops/' + shopId);
    }

    navigateGeneral(e) {
        this.props.history.push('/products/' + this.state.product.id);
    }

    navigateComments(e) {
        this.props.history.push('/products/' + this.state.product.id + '/comments');
    }

    render() {
        if (this.state.isLoading) {
            return (<div className="container">Loading ...</div>);
        }

        if (this.state.errorMessage !== null) {
            return (<div className="container"><Alert color="danger" isOpen={this.state.errorMessage !== null}
                                                      toggle={this.toggleError}>{this.state.errorMessage}</Alert>
            </div>);
        }

        var newPrice = null,
            promotion = null,
            tags = [],
            images = [],
            currentImageSrc = null,
            self = this,
            action = this.props.match.params.action,
            content = null;
        if (this.state.product.promotions && this.state.product.promotions.length > 0) {
            promotion = this.state.product.promotions[0];
            newPrice = this.state.product.new_price;
        }

        if (action === "comments") {
            content = (<ProductComment product={self.state.product} onRefreshScore={self.refreshScore}/>);
        } else {
            content = (<DescriptionTab product={self.state.product}/>);
            action = "general";
        }

        if (this.state.product.tags && this.state.product.tags.length > 0) {
            this.state.product.tags.forEach(function (tag) {
                tags.push((<li key={tag}>{tag}</li>));
            });
        }

        if (this.state.product.images && this.state.product.images.length > 0) {
            var i = 0;
            this.state.product.images.forEach(function (image) {
                var img = Constants.apiUrl + image;
                if (i === self.state.currentImageIndice) {
                    currentImageSrc = img;
                }

                images.push((
                    <li key={i}><a href="#" className={i == self.state.currentImageIndice && "active"} data-id={i}
                                   onClick={(e) => {
                                       self.changeImage(e)
                                   }}><img src={img} data-id={i}/></a></li>));
                i++;
            });
        }

        return (

            <div className="container">
                <Breadcrumb>
                    <BreadcrumbItem>
                        <a href="#"
                           onClick={(e) => {
                               self.navigateShop(e, "unknown_id");
                           }}>
                            {this.state.shop == null ? "Unknown shop" : this.state.shop.name}
                        </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>{this.state.product.name}</BreadcrumbItem>
                </Breadcrumb>
                <section className="white-section">
                    <div className="row col-md-12 m-2">
                        <div className="col-md-8 p-1">
                            <div className="row p-1">
                                <div className="col-md-12">
                                    <h3>{this.state.product.name}</h3>
                                    <div>
                                        <div>
                                            <Rater total={5} ref="score" rating={this.state.product.average_score}
                                                   interactive={false}/>
                                            <b> {this.state.product.average_score} </b>
                                        </div>
                                        <span>Comments ({this.state.product.nb_comments})</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row p-1">
                                {tags.length > 0 && (
                                    <ul className="col-md-12">
                                        {tags}
                                    </ul>)
                                }
                            </div>
                            {images.length > 0 && (
                                <div className="row p-1">
                                    <ul className="col-md-3 no-style no-margin image-selector">
                                        {images}
                                    </ul>
                                    <div className={newPrice == null ? "col-md-9" : "col-md-9"}>
                                        <Magnify style={{
                                            width: '433px',
                                            height: '433px'
                                        }} src={currentImageSrc}></Magnify>
                                    </div>
                                </div>)
                            }
                            <div className="row p-1">
                                <Nav tabs className="col-md-12">
                                    <NavItem>
                                        <NavLink
                                            className={classnames({active: action === 'general'})}
                                            onClick={() => {
                                                this.navigateGeneral();
                                            }}
                                        >
                                            General
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({active: action === 'comments'})}
                                            onClick={() => {
                                                this.navigateComments();
                                            }}
                                        >
                                            Comments
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <div className="col-md-12">
                                    {content}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 p-1">
                            {newPrice == null ? (
                                <h4 className="price">€ {this.state.product.price}</h4>) : (
                                <div>
                                    <h4 className="inline">
                                        <Badge
                                            color="success"><strike>€ {this.state.product.price}</strike><i
                                            className="ml-1">-{promotion.discount}%</i></Badge>
                                    </h4>
                                    <h4 className="inline ml-1">€ {newPrice}</h4>
                                </div>
                            )}
                            <button className="btn btn-info">BUY</button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    componentWillMount() {
        this.refresh();
    }
}

export default withRouter(Products);
