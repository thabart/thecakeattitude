import React, { Component } from "react";
import { ShopsService, UserService, CommentsService } from "./services/index";
import { Tooltip, Progress, Alert, Button } from "reactstrap";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import { ShopProfile, ShopProducts, ShopServices, ShopSettings } from "./shopProfile";
import { ApplicationStore, EditShopStore } from './stores';
import { EditableText, EditableTag } from './components';
import { Guid } from './utils';
import { translate } from 'react-i18next';
import MainLayout from './MainLayout';
import Rater from "react-rater";
import AppDispatcher from './appDispatcher';
import Constants from '../Constants';
import $ from 'jquery';
import "react-rater/lib/react-rater.css";
import "./styles/shop.css";

class Shop extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
        this.clickBannerImage = this.clickBannerImage.bind(this);
        this.clickPictureImage = this.clickPictureImage.bind(this);
        this.uploadBannerImage = this.uploadBannerImage.bind(this);
        this.uploadPictureImage = this.uploadPictureImage.bind(this);
        this.toggle = this.toggle.bind(this);
        this.refreshScore = this.refreshScore.bind(this);
        this.toggleError = this.toggleError.bind(this);
        this.toggleUpdatingError = this.toggleUpdatingError.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.refresh = this.refresh.bind(this);
        this.state = {
            isLoading: true,
            location: {},
            user: null,
            shop: null,
            scores: null,
            nbComments: 0,
            isRatingOpened: false,
            errorMessage: null,
            updatingErrorMessage: null,
            isEditable: false,
            canBeEdited: false
        };
    }

    toggleError() { // Toggle the error message
        this.setState({
            errorMessage: null
        });
    }

    toggleUpdatingError() { // Toggle updating error message
        this.setState({
            updatingErrorMessage: null
        });
    }

    clickBannerImage() {
        var btn = this.refs.uploadBannerBtn;
        $(btn).click();
    }

    clickPictureImage() {
        var btn = this.refs.uploadProfileBtn;
        $(btn).click();
    }

    uploadBannerImage(e) {
        var self = this;
        self.uploadImage(e, function (result) {
            var shop = self.state.shop;
            shop.banner_image = result;
            self.setState({
                shop: shop
            });
            AppDispatcher.dispatch({
                actionName: Constants.events.UPDATE_SHOP_INFORMATION,
                data: {banner_image: result}
            });
        });
    }

    uploadPictureImage(e) {
        var self = this;
        self.uploadImage(e, function (result) {
            var shop = self.state.shop;
            shop.profile_image = result;
            self.setState({
                shop: shop
            });
            AppDispatcher.dispatch({
                actionName: Constants.events.UPDATE_SHOP_INFORMATION,
                data: {profile_image: result}
            });
        });
    }

    uploadImage(e, callback) {
        e.preventDefault();
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result);
        };
        reader.readAsDataURL(file);
    }

    toggle() {   // Toggle score window
        this.setState({
            isRatingOpened: !this.state.isRatingOpened
        });
    }

    refreshScore() { // Update the score
        var self = this;
        ShopsService.searchComments(this.state.shop.id, {}).then(function (commentsResult) {
            var comments = commentsResult['_embedded'],
                average = null,
                scores = null,
                nbComments = 0;

            if (comments) {
                if (!(comments instanceof Array)) {
                    comments = [comments];
                }

                var total = 0;
                scores = {
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "4": 0,
                    "5": 0
                };
                comments.forEach(function (comment) {
                    total += comment.score;
                    scores["" + comment.score + ""] += 1;
                });

                var average = Math.round((total / comments.length) * 1000) / 1000;
                nbComments = comments.length;
            }

            self.setState({
                scores: scores,
                nbComments: nbComments
            });
            self.refs.rater.onRate(average);
        });
    }

    updateTitle(title) {  // Udpate the title
        AppDispatcher.dispatch({
            actionName: Constants.events.UPDATE_SHOP_INFORMATION,
            data: {name: title}
        });
    }

    updateTags(tags) { // Update the tags
        AppDispatcher.dispatch({
            actionName: Constants.events.UPDATE_SHOP_INFORMATION,
            data: {tags: tags}
        });
    }

    refresh() {
        var self = this,
            shopId = self.props.match.params.id,
            paction = self.props.match.params.paction,
            isEditable = paction && paction === 'edit';
        self.setState({
            isLoading: true
        });
        ShopsService.get(shopId).then(function (r) {
            var shop = r['_embedded'];
            var localUser = ApplicationStore.getUser();
            isEditable = isEditable && localUser && localUser !== null && localUser.sub === shop.subject;
            UserService.getPublicClaims(shop.subject).then(function (user) {
                self.setState({
                    isLoading: false,
                    shop: shop,
                    user: user,
                    isEditable: isEditable,
                    canBeEdited: !isEditable && localUser && localUser !== null && localUser.sub === shop.subject
                });
                self.refreshScore();
                if (isEditable) {
                    AppDispatcher.dispatch({
                        actionName: Constants.events.EDIT_SHOP_LOADED,
                        data: shop
                    });
                }
            });
        }).catch(function (e) {
            var json = e.responseJSON;
            var error = "an error occured while trying to retrieve the shop";
            if (json && json.error_description) {
                error = json.error_description;
            }

            self.setState({
                errorMessage: error,
                isLoading: false
            });
        });

    }

    render() { // Render the component
        const {t} = this.props;
        if (this.state.isLoading) {
            return (<div className="container">Loading ...</div>);
        }

        if (this.state.errorMessage !== null) {
            return (<div className="container"><Alert color="danger" isOpen={this.state.errorMessage !== null}
                                                      toggle={this.toggleError}>{this.state.errorMessage}</Alert>
            </div>);
        }

        var bannerImage = this.state.shop.banner_image;
        var profileImage = this.state.shop.profile_image;
        var action = this.props.match.params.action;
        var subaction = this.props.match.params.subaction;
        var profileUrl = null;
        var productsUrl = null;
        var servicesUrl = null;
        var settingsUrl = null;
        var viewUrl = null;
        var editUrl = null;
        var self = this;
        var tags = [];
        var content = (<ShopProfile user={this.state.user} shop={this.state.shop} isEditable={this.state.isEditable}
                                    history={this.props.history}/>);
        if (action === "products") {
            content = (
                <ShopProducts user={this.state.user} shop={this.state.shop} isEditable={this.state.isEditable}/>);
        } else if (action === "services") {
            content = (
                <ShopServices user={this.state.user} shop={this.state.shop} isEditable={this.state.isEditable}/> );
        } else if (action === 'settings' && this.state.isEditable) {
            content = (<ShopSettings shop={this.state.shop}/>);
        }

        if (this.state.isEditable) {
            profileUrl = '/shops/' + this.state.shop.id + '/edit/profile';
            productsUrl = '/shops/' + this.state.shop.id + '/edit/products';
            servicesUrl = '/shops/' + this.state.shop.id + '/edit/services';
            settingsUrl = '/shops/' + this.state.shop.id + '/edit/settings';
            viewUrl = '/shops/' + this.state.shop.id + '/view/' + (action === 'settings' ? 'profile' : action) + (subaction && subaction !== null ? '/' + subaction : '');
        } else {
            profileUrl = '/shops/' + this.state.shop.id + '/view/profile';
            productsUrl = '/shops/' + this.state.shop.id + '/view/products';
            servicesUrl = '/shops/' + this.state.shop.id + '/view/services';
            settingsUrl = null;
            editUrl = '/shops/' + this.state.shop.id + '/edit/' + action + (subaction && subaction !== null ? '/' + subaction : '');
        }

        if (!bannerImage) {
            bannerImage = "/images/default-shop-banner.jpg";
        }

        if (!profileImage) {
            profileImage = "/images/profile-picture.png";
        }

        var ratingSummary = [];
        if (self.state.nbComments > 0) {
            for (var score = 5; score >= 1; score--) {
                var nb = self.state.scores[score];
                var n = 0;
                if (nb > 0) {
                    n = (nb / self.state.nbComments) * 100;
                }

                n = Math.round(n);
                ratingSummary.push((<li className="row">
                    <div className="col-md-4"><Rater total={5} rating={score} interactive={false}/></div>
                    <div className="col-md-6"><Progress value={n}/></div>
                    <div className="col-md-2">{nb}</div>
                </li>));
            }
        }

        if (self.state.shop.tags && self.state.shop.tags.length > 0) {
            self.state.shop.tags.forEach(function (tag) {
                tags.push((<li>{tag}</li>));
            });
        }

        return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
            <div className="container">
              { /* Error message */ }
              <Alert color="danger" isOpen={this.state.updatingErrorMessage !== null} toggle={this.toggleUpdatingError}>{this.state.updatingErrorMessage}</Alert>
              { /* Header */ }
              <section className="row white-section shop-section cover">
                  { /* Cover banner */ }
                  <div className="cover-banner">
                      <img src={bannerImage}/>
                  </div>
                  { /* Profile picture */ }
                  <div className="profile-img">
                      <img src={profileImage} className="img-thumbnail" />
                      {self.state.isEditable && (<Button outline color="secondary" size="sm" className="edit-icon"
                                                         onClick={this.clickPictureImage}><i className="fa fa-pencil"></i></Button>)}
                      {self.state.isEditable && (
                          <input type="file" accept='image/*' ref="uploadProfileBtn" className="upload-image"
                                 onChange={(e) => {
                                     this.uploadPictureImage(e);
                                 }}/>)}
                  </div>
                  { /* Shop information */ }
                  <div className="profile-information">
                      { this.state.isEditable ? (
                          <EditableText className="header1" value={this.state.shop.name} validate={this.updateTitle}/>)
                          : ( <h1>{this.state.shop.name}</h1> )
                      }
                      { this.state.nbComments > 0 ? (
                          <div>
                              <span id="rating">
                                <Rater total={5} ref="rater" interactive={false}/>
                                {this.state.nbComments} {t('comments')}
                              </span>
                              <Tooltip placement='bottom' className="rating-popup white-tooltip-inner" isOpen={this.state.isRatingOpened} target="rating" toggle={this.toggle}>
                                  <ul>
                                      {ratingSummary}
                                  </ul>
                              </Tooltip>
                              {tags.length > 0 && this.state.isEditable && (
                                  <EditableTag tags={self.state.shop.tags} validate={this.updateTags}/>
                              )}
                              {tags.length > 0 && !this.state.isEditable && (
                                  <ul className="tags no-padding">
                                      {tags}
                                  </ul>
                              )}
                          </div>) : '' }
                  </div>
                  { /* Menu */ }
                  <ul className="nav nav-pills menu">
                      <li className="nav-item">
                          <NavLink to={profileUrl} className={action === 'profile' ? 'nav-link active-nav-link' : 'nav-link'}>{t('shopProfile')}</NavLink>
                      </li>
                      <li className="nav-item">
                          <NavLink to={productsUrl} className={action === 'products' ? 'nav-link active-nav-link' : 'nav-link'}>{t('products')}</NavLink>
                      </li>
                      <li className="nav-item">
                          <NavLink to={servicesUrl} className={action === 'services' ? 'nav-link active-nav-link' : 'nav-link'}>{t('services')}</NavLink>
                      </li>
                      <li className="nav-item">
                          { this.state.isEditable && (<NavLink to={settingsUrl}
                                                               className={action === 'settings' ? 'nav-link active' : 'nav-link'}>{t('settings')}</NavLink>) }
                      </li>
                  </ul>
                  <ul className="nav nav-pills menu-shop-options">
                      { this.state.canBeEdited && (
                          <li className="nav-item">
                              <a href={editUrl} className="btn btn-outline-secondary btn-sm btn-icon"><i className="fa fa-pencil"></i></a>
                          </li>
                      ) }
                      { this.state.isEditable && (
                          <li className="nav-item">
                              <Button outline color="secondary" size="sm"><i className="fa fa-pencil"
                                                                             onClick={this.clickBannerImage}></i></Button>
                              <input type="file" accept='image/*' ref="uploadBannerBtn" className="upload-image"
                                     onChange={(e) => {
                                         this.uploadBannerImage(e);
                                     }}/>
                          </li>
                      )}
                      {this.state.isEditable && (
                          <li className="nav-item">
                              <a href={viewUrl} className="btn btn-outline-secondary btn-sm"><i className="fa fa-eye"></i></a>
                          </li>
                      )}
                  </ul>
              </section>
              { /* Tab */ }
              {content}
            </div>
        </MainLayout>);
    }

    componentDidMount() { // Execute before the render.
        var self = this,
            shopId = self.props.match.params.id;
        this._waitForToken = AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case 'update-shop':
                    if (payload.data && payload.data.id === shopId) {
                        ApplicationStore.sendMessage({
                            message: 'The shop has been updated',
                            level: 'success',
                            position: 'bl'
                        });
                        self.refresh();
                    }
                    break;
                case 'new-product': // Display popup when a product has been added to the shop.
                    if (payload.data && payload.data.shop_id === shopId) {
                        ApplicationStore.sendMessage({
                            message: 'A new product has been added',
                            level: 'info',
                            position: 'tr'
                        });
                    }
                    break;
                case 'new-service': // Display popup when a service has been added to the shop.
                    if (payload.data && payload.data.shop_id === shopId) {
                        ApplicationStore.sendMessage({
                            message: 'A new service has been added',
                            level: 'info',
                            position: 'tr'
                        });
                    }
                    break;
                case 'new-shop-comment': // Display popup when a comment has been added to the shop.
                    if (payload.data && payload.data.shop_id === shopId) {
                        ApplicationStore.sendMessage({
                            message: 'A comment has been added',
                            level: 'info',
                            position: 'tr'
                        });
                        self.refreshScore();
                    }
                    break;
                case 'remove-shop-comment': // Display popup when a comment has been removed
                    if (payload.data && payload.data.shop_id === shopId) {
                        ApplicationStore.sendMessage({
                            message: 'A comment has been removed',
                            level: 'info',
                            position: 'tr'
                        });
                        self.refreshScore();
                    }
                    break;
            }
        });

        EditShopStore.addChangeListener(function () {
            var shop = EditShopStore.getShop();
            self._commonId = Guid.generate();
            ShopsService.update(shop.id, shop, self._commonId).then(function () {

            }).catch(function () {
                self.setState({
                    updatingErrorMessage: 'An error occured while trying to update the shop'
                });
            });
        });

        this.refresh();
    }

    componentWillUnmount() { // Remove listener.
        AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Shop));
