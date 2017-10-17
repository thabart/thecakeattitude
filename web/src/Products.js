import React, {Component} from "react";
import { Alert, TabContent, TabPane, Nav, NavItem, NavLink, Badge, Breadcrumb, BreadcrumbItem, Button, UncontrolledTooltip } from "reactstrap";
import { withRouter } from "react-router";
import { translate } from 'react-i18next';
import { ProductsService, ShopsService, OrdersService } from "./services/index";
import { DescriptionTab, ProductComment, ProductDiscount } from "./productabs";
import { EditableText, EditableTag } from './components';
import { ApplicationStore, EditProductStore } from './stores/index';
import AppDispatcher from "./appDispatcher";
import MainLayout from './MainLayout';
import Constants from "../Constants";
import Rater from "react-rater";
import Magnify from "react-magnify";
import $ from "jquery";
import classnames from "classnames";
import Mousetrap from 'mousetrap';

class Products extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
        this.toggle = this.toggle.bind(this);
        this.toggleError = this.toggleError.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.refresh = this.refresh.bind(this);
        this.refreshScore = this.refreshScore.bind(this);
        this.navigateGeneral = this.navigateGeneral.bind(this);
        this.navigateComments = this.navigateComments.bind(this);
        this.navigateDiscounts = this.navigateDiscounts.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.viewProduct = this.viewProduct.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.updateProductName = this.updateProductName.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.state = {
            isLoading: false,
            errorMessage: null,
            currentImageIndice: 0,
            product: null,
            shop: null,
            isEditable: false,
            canBeEdited: false,
            isEditProductTooltipOpened: false,
            isViewProductTooltipOpened: false,
            isSaveProductTooltipOpened: false
        };
    }

    toggle(name) {   // Toggle the tooltip.
        var value = !this.state[name];
        this.setState({
            [name]: value
        });
    }

    addToCart(e) { // Add the product into your cart.
      e.stopPropagation();
      e.preventDefault();
      const {t} = this.props;
      var product = this.state.product;
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

    editProduct() { // Edit the product.
      var id = this.props.match.params.id;
      this.props.history.push('/products/'+ id + '/edit');
      this.setState({
        isEditable: true,
        canBeEdited: false
      });
      AppDispatcher.dispatch({
          actionName: Constants.events.EDIT_PRODUCT_ACT
      });
    }

    viewProduct() { // View the product.
      var id = this.props.match.params.id;
      this.props.history.push('/products/'+ id);
      this.setState({
        isEditable: false,
        canBeEdited: true
      });
      AppDispatcher.dispatch({
          actionName: Constants.events.VIEW_PRODUCT_ACT
      });
    }

    saveProduct() { // Save the product.

    }

    updateProductName(name) { // Update product name.
      AppDispatcher.dispatch({
          actionName: Constants.events.UPDATE_PRODUCT_INFORMATION_ACT,
          data: { name: name }
      });
    }

    updateTags(tags) { // Update the tags.
      AppDispatcher.dispatch({
          actionName: Constants.events.UPDATE_PRODUCT_INFORMATION_ACT,
          data: { tags: tags }
      });
    }

    updateProduct() { // Update the product.
      var product = EditProductStore.getProduct();
      this.setState({
          product: product
      });
    }

    refreshScore(data) { // Refresht the score.
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

    refresh() { // Refresh the product.
        var self = this,
            action = self.props.match.params.action,
            isEditable = action && action === 'edit';
        self.setState({
            isLoading: true
        });
        const {t} = this.props;
        ProductsService.get(this.props.match.params.id).then(function (r) {
            var product = r['_embedded'];
            var localUser = ApplicationStore.getUser();
            ShopsService.get(product.shop_id).then(function(sr) {
              var shop = sr['_embedded'];
              isEditable = isEditable && localUser && localUser !== null && localUser.sub === shop.subject;
              self.setState({
                  isLoading: false,
                  product: product,
                  shop: shop,
                  isEditable: isEditable,
                  canBeEdited: !isEditable && localUser && localUser !== null && localUser.sub === shop.subject
              });
              AppDispatcher.dispatch({
                  actionName: Constants.events.EDIT_PRODUCT_LOADED,
                  data: product
              });
            }).catch(function() {
                self.setState({
                    errorMessage: t('retrieveProductError'),
                    isLoading: false,
                    isEditable: false
                });
            });
        }).catch(function () {
            self.setState({
                errorMessage: t('retrieveProductError'),
                isLoading: false,
                isEditable: false
            });
        });
    }

    toggleError() { // Toggle the error message.
        this.setState({
            errorMessage: null
        });
    }

    changeImage(e) { // Change the current image.
        e.preventDefault();
        var indice = $(e.target).data('id');
        this.setState({
            currentImageIndice: indice
        });
    }

    navigateShop(e, shopId) { // Navigate to the shop.
        e.preventDefault();
        this.props.history.push('/shops/' + shopId + '/view/profile');
    }

    navigateGeneral(e) { // Navigate to the general tab.
        this.props.history.push('/products/' + this.state.product.id);
    }

    navigateComments(e) { // Navigate to the comments tab.
        this.props.history.push('/products/' + this.state.product.id + '/comments');
    }

    navigateDiscounts(e) { // Navigate to the discounts tab.
        this.props.history.push('/products/' + this.state.product.id + '/discounts');
    }

    render() { // Display the view.
        const {t} = this.props;
        if (this.state.isLoading) {
            return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
                <div className="container">
                  <i className='fa fa-spinner fa-spin'></i>
                </div>
            </MainLayout>);
        }

        if (this.state.errorMessage !== null) {
            return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
              <div className="container">
                <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert>
              </div>
          </MainLayout>);
        }

        var tags = [],
            images = [],
            currentImageSrc = null,
            self = this,
            action = this.props.match.params.action,
            content = null;
        var bestDiscount = null;
        if (this.state.product.discounts && this.state.product.discounts.length > 0) {
            this.state.product.discounts.forEach(function(discount) {
                if (!bestDiscount || bestDiscount === null || bestDiscount.money_saved < discount.money_saved) {
                    bestDiscount = discount;
                }
            });
        }

        if (action === "comments") {
            content = (<ProductComment product={self.state.product} />);
        } else if (action === 'discounts') {
            content = (<ProductDiscount product={self.state.product} isEditable={self.state.isEditable} />);
        } else {
            content = (<DescriptionTab product={self.state.product} shop={self.state.shop} isEditable={self.state.isEditable} />);
            action = "general";
        }

        if (this.state.product.tags && this.state.product.tags.length > 0) {
            this.state.product.tags.forEach(function (tag) {
                tags.push((<li key={tag}>
                  <NavLink onClick={() => { self.props.history.push("/tags/"+tag+"/products"); }} className="no-decoration red"  style={{"padding": "0", "textTransform" : "none", "fontWeight" : "100"}}>
                    {tag}
                  </NavLink>
                </li>));
            });
        }

        if (this.state.product.images && this.state.product.images.length > 0) {
            var i = 0;
            this.state.product.images.forEach(function (image) {
                var img = image;
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

        var user = ApplicationStore.getUser();
        return (
          <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
            <div className="container">
                <section className="section" style={{paddingBottom: "20px"}}>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <a href="#" className="no-decoration red" onClick={(e) => { self.navigateShop(e, this.state.shop.id);}}>
                                {this.state.shop.name}
                            </a>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                          { this.state.product.name }
                        </BreadcrumbItem>
                        <li style={{"float": "right"}}>
                          {self.state.canBeEdited && (<Button outline color="secondary" id="edit-product" size="sm" className="btn-icon with-border" onClick={self.editProduct}>
                            <i className="fa fa-pencil"></i>
                          </Button>)}
                          {self.state.canBeEdited && (
                            <UncontrolledTooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isEditProductTooltipOpened} target="edit-product" toggle={() => this.toggle('isEditProductTooltipOpened')}>
                                {t('editProductTooltip')}
                            </UncontrolledTooltip>
                          )}
                          {self.state.isEditable && (<Button outline color="secondary" id="view-product" size="sm" className="btn-icon with-border" onClick={self.viewProduct}>
                              <i className="fa fa-eye"></i>
                          </Button>)}
                          {self.state.isEditable && (
                            <UncontrolledTooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isViewProductTooltipOpened} target="view-product" toggle={() => this.toggle('isViewProductTooltipOpened')}>
                                {t('viewProductTooltip')}
                            </UncontrolledTooltip>
                          )}
                          {self.state.isEditable && (<Button outline color="secondary" id="save-product" size="sm" className="btn-icon with-border" onClick={self.saveProduct}>
                              <i className="fa fa-save"></i>
                          </Button>)}
                          {self.state.isEditable && (
                            <UncontrolledTooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isSaveProductTooltipOpened} target="save-product" toggle={() => this.toggle('isSaveProductTooltipOpened')}>
                                {t('saveProductTooltip')}
                            </UncontrolledTooltip>
                          )}
                        </li>
                    </Breadcrumb>
                    <div className="row">
                        { /* Left side */ }
                        <div className="col-md-8">
                          <div style={{paddingLeft: "10px"}}>
                            { /* Header */ }
                            <div>
                              { self.state.isEditable ? (
                                <EditableText className="header1" value={self.state.product.name} validate={this.updateProductName} minLength={1} maxLength={15} />) : 
                                (<h2>{self.state.product.name}</h2>)
                              }                              
                              <div>
                                <Rater total={5} ref="score" rating={this.state.product.average_score} interactive={false}/>
                                <b> {this.state.product.average_score} </b>
                              </div>
                              <span>{t('comments')} ({this.state.product.nb_comments})</span>
                            </div>
                            { /* Tags */ }
                            <div>
                                { this.state.isEditable && (<EditableTag tags={self.state.shop.tags} validate={this.updateTags}/>) }
                                { !this.state.isEditable && tags.length > 0 && (
                                   <ul className="col-md-12 tags gray" style={{padding: "0"}}>
                                    {tags}
                                   </ul>
                                )}    
                                { !this.state.isEditable && tags.length === 0 && (<span><i>{t('noTags')}</i></span>) }   
                            </div>
                            { /* Images */ }
                            {images.length > 0 && (
                                <div className="row" style={{paddingTop: "10px"}}>
                                    <ul className="col-md-3 no-style no-margin image-selector">
                                        {images}
                                    </ul>
                                    <div className="col-md-9">
                                        <Magnify style={{ width: '433px', height: '433px'}} src={currentImageSrc}></Magnify>
                                    </div>
                                </div>)
                            }
                          </div>
                        </div>
                        { /* Right side */ }
                        <div className="col-md-4">
                            {bestDiscount == null ? (<h4 className="price">€ {this.state.product.price}</h4>) : (
                                <div>
                                   <h5 className="inline">
                                       <Badge color="success">
                                         <strike style={{color: "white"}}>€ {this.state.product.price}</strike>
                                         <i style={{color: "white"}} className="ml-1">- € {bestDiscount.money_saved}</i>
                                       </Badge>
                                   </h5>
                                   <h5 className="inline ml-1">€ {(this.state.product.price - bestDiscount.money_saved)}</h5>
                                </div>
                            )}
                            { user && user.sub !== this.state.shop.subject && (<a href="#" className="btn btn-default" onClick={this.addToCart}>{t('addToCart')}</a>) }
                            { user && user.sub !== this.state.shop.subject && (<a href="#" style={{marginLeft: "5px"}} onClick={(e) => { e.preventDefault(); self.props.history.push('/newmessage/products/' + self.state.product.id); }} className="btn btn-default">{t('contactTheShop')}</a>) }
                        </div>
                    </div>
                    { /* Tab content */ }
                    <div>
                      <Nav tabs style={{paddingLeft: "10px"}}>
                              <NavItem>
                                  <NavLink
                                      className={classnames({active: action === 'general'})}
                                      onClick={() => {
                                          this.navigateGeneral();
                                      }}
                                  >
                                      {t('general')}
                                  </NavLink>
                              </NavItem>
                              <NavItem>
                                  <NavLink
                                      className={classnames({active: action === 'comments'})}
                                      onClick={() => {
                                          this.navigateComments();
                                      }}
                                  >
                                      {t('comments')}
                                  </NavLink>
                              </NavItem>
                              <NavItem>
                                  <NavLink
                                      className={classnames({active: action === 'discounts'})}
                                      onClick={() => {
                                        this.navigateDiscounts();
                                      }}
                                  >
                                    {t('discounts')}
                                  </NavLink>
                              </NavItem>
                      </Nav>
                      <div style={{paddingLeft: "10px", paddingTop: "10px"}}>
                        {content}
                      </div>
                    </div>
                </section>
            </div>
          </MainLayout>
        );
    }

    componentWillMount() { // Execute after the render.
        this.refresh();
        var self = this;
        self._waitForToken = AppDispatcher.register(function (payload) {
          switch (payload.actionName) {
            case Constants.events.NEW_PRODUCT_COMMENT_ARRIVED:
            case Constants.events.REMOVE_PRODUCT_COMMENT_ARRIVED:
              if (payload && payload.data && payload.data.product_id == self.state.product.id) {
                  self.refreshScore(payload.data);
                }
                break;
            }
        });
        EditProductStore.addProductChangeListener(this.updateProduct);
        Mousetrap.bind('ctrl+s', function(e) { // Save the product (ctrl+s)
          if (self.state.isEditable) {
            
          }
        });
    }

    componentWillUnmount() { // Remove listener.
        AppDispatcher.unregister(this._waitForToken);
        EditProductStore.removeProductChangeListener(this.updateProduct);
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Products));
