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
import Mousetrap from 'mousetrap';
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
        this.toggleUpdatingError = this.toggleUpdatingError.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.refresh = this.refresh.bind(this);
        this.saveShop = this.saveShop.bind(this);
        this.state = {
            isLoading: true,
            location: {},
            user: null,
            shop: null,
            scores: null,
            nbComments: 0,
            errorMessage: null,
            updatingErrorMessage: null,
            isEditable: false,
            canBeEdited: false,
            isRatingOpened: false, // Tooltip visibility
            isBannerImageTooltipOpened: false,
            isViewShopTooltipOpened: false,
            isEditShopTooltipOpened: false,
            isEditProfileTooltipOpened: false,
            isUpdateShopTooltipOpened: false
        };
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
                actionName: Constants.events.UPDATE_SHOP_INFORMATION_ACT,
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
                actionName: Constants.events.UPDATE_SHOP_INFORMATION_ACT,
                data: {profile_image: result}
            });
        });
    }

    uploadImage(e, callback) {
        e.preventDefault();
        var file = e.target.files[0];
        if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
          return;
        }

        var reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result);
        };
        reader.readAsDataURL(file);
    }

    toggle(name) {   // Toggle the tooltip.
        var value = !this.state[name];
        this.setState({
            [name]: value
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
            if (self.refs.rater) {
              self.refs.rater.onRate(average);
            }
        });
    }

    updateTitle(title) {  // Udpate the title
        AppDispatcher.dispatch({
            actionName: Constants.events.UPDATE_SHOP_INFORMATION_ACT,
            data: {name: title}
        });
    }

    updateTags(tags) { // Update the tags
        AppDispatcher.dispatch({
            actionName: Constants.events.UPDATE_SHOP_INFORMATION_ACT,
            data: {tags: tags}
        });
    }

    saveShop() { // Save the shop.
      var self = this;
      var shop = EditShopStore.getShop();
      const {t} = this.props;
      self.setState({
        isLoading: true
      });
      self._commonId = Guid.generate();
      ShopsService.update(shop.id, shop, self._commonId).catch(function (e) {
          var json = e.responseJSON;
          if (json && json.error_description) {
              self.setState({
                  updatingErrorMessage: json.error_description,
                  isLoading: false
              });
          } else {
            self.setState({
                updatingErrorMessage: t('errorUpdateShop'),
                isLoading: false
            });
          }
      });
    }

    refresh() { // Refresh the shop's information.
        var self = this,
            shopId = self.props.match.params.id,
            paction = self.props.match.params.paction,
            isEditable = paction && paction === 'edit';
        const {t} = this.props;
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
            var error = t('errorRetrieveShop');
            if (json && json.error_description) {
                error = json.error_description;
            }

            self.setState({
                errorMessage: error,
                isLoading: false
            });
        });

    }

    render() { // Render the component.
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
                <Alert color="danger" isOpen={this.state.errorMessage !== null}>{this.state.errorMessage}</Alert>
              </div>
          </MainLayout>);
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
        var content = (<ShopProfile user={this.state.user} shop={this.state.shop} isEditable={this.state.isEditable} history={this.props.history}/>);
        if (action === "products") {
            content = (<ShopProducts user={this.state.user} shop={this.state.shop} isEditable={this.state.isEditable}/>);
        } else if (action === "services") {
            content = (<ShopServices user={this.state.user} shop={this.state.shop} isEditable={this.state.isEditable}/> );
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
            bannerImage = "/images/default-profile-banner.jpg";
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
                tags.push((<li><NavLink to={"/tags/" + tag+"/shops"} style={{color: "white"}}>{tag}</NavLink></li>));
            });
        }


        return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
            <div className="container">
              { /* Error message */ }
              <Alert color="danger" isOpen={this.state.updatingErrorMessage !== null} toggle={this.toggleUpdatingError}>{this.state.updatingErrorMessage}</Alert>
              { /* Header */ }
              <section className="row cover">
                  { /* Cover banner */ }
                  <div className="cover-banner">
                      <img src={bannerImage}/>
                  </div>
                  { /* Profile picture */ }
                  <div className="profile-img">
                      <img src={profileImage} className="img-thumbnail" />
                      {self.state.isEditable && (<Button outline color="secondary" id="edit-profile" size="sm" className="edit-profile-icon btn-icon with-border" onClick={this.clickPictureImage}>
                        <i className="fa fa-pencil"></i>
                      </Button>)}
                      {self.state.isEditable && (
                          <input type="file" accept=".png, .jpg, .jpeg" ref="uploadProfileBtn" className="upload-image" onChange={(e) => { this.uploadPictureImage(e); }}/>
                      )}
                      {self.state.isEditable && (
                        <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isEditProfileTooltipOpened} target="edit-profile" toggle={() => this.toggle('isEditProfileTooltipOpened')}>
                            {t('editShopProfilePictureTooltip')}
                        </Tooltip>
                      )}
                  </div>
                  { /* Shop information */ }
                  <div className="profile-information">
                      { this.state.isEditable ? (
                          <EditableText className="header1" value={this.state.shop.name} validate={this.updateTitle} maxLength={15} minLength={1}/>)
                          : ( <h1>{this.state.shop.name}</h1> )
                      }
                      { this.state.nbComments > 0 ? (
                          <div>
                              <span id="rating">
                                <Rater total={5} ref="rater" interactive={false} rating={self.state.shop.average_score} />
                                {this.state.nbComments} {t('comments')}
                              </span>
                              <Tooltip placement='bottom' className="rating-popup white-tooltip-inner" isOpen={this.state.isRatingOpened} target="rating" toggle={() => this.toggle('isRatingOpened')}>
                                  <ul>
                                      {ratingSummary}
                                  </ul>
                              </Tooltip>
                              {this.state.isEditable && (
                                  <EditableTag tags={self.state.shop.tags} validate={this.updateTags}/>
                              )}
                              {tags.length > 0 && !this.state.isEditable && (
                                  <ul className="tags no-padding">
                                      {tags}
                                  </ul>
                              )}
                              {tags.length === 0 && !this.state.isEditable && (
                                  <div><i>{t('noTags')}</i></div>
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
                          { this.state.isEditable && (
                            <NavLink to={settingsUrl} className={action === 'settings' ? 'nav-link active-nav-link' : 'nav-link'}>{t('settings')}</NavLink>)
                          }
                      </li>
                      <li className="nav-item">
                        <a href={Constants.gameUrl + "?shop_id="+self.state.shop.id} className="nav-link" target="_blank">{t('gameMenuItem')}</a>
                      </li>
                  </ul>
                  <ul className="nav nav-pills menu-profile-options">
                      { this.state.canBeEdited && (
                          <li className="nav-item">
                              <a href={editUrl} className="btn btn-outline-secondary btn-sm btn-icon with-border" id="edit-shop"><i className="fa fa-pencil"></i></a>
                              <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isEditShopTooltipOpened} target="edit-shop" toggle={() => this.toggle('isEditShopTooltipOpened')}>
                                  {t('editShopTooltip')}
                              </Tooltip>
                          </li>
                      ) }
                      { this.state.isEditable && (
                          <li className="nav-item">
                              <Button id="saveShop" className="btn btn-outline-secondary btn-sm btn-icon with-border" onClick={this.saveShop}><i className="fa fa-floppy-o"></i></Button>
                              <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isUpdateShopTooltipOpened} target="saveShop" toggle={() => this.toggle('isUpdateShopTooltipOpened')}>
                                  {t('updateShopTooltip')}
                              </Tooltip>
                          </li>
                      )}
                      { this.state.isEditable && (
                          <li className="nav-item">
                              <Button id="editBanner" className="btn btn-outline-secondary btn-sm btn-icon with-border" onClick={this.clickBannerImage}><i className="fa fa-pencil"></i></Button>
                              <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isBannerImageTooltipOpened} target="editBanner" toggle={() => this.toggle('isBannerImageTooltipOpened')}>
                                  {t('editShopBannerImageTooltip')}
                              </Tooltip>
                              <input type="file" accept=".png, .jpg, .jpeg" ref="uploadBannerBtn" className="upload-image" onChange={(e) => { this.uploadBannerImage(e); }}/>
                          </li>
                      )}
                      {this.state.isEditable && (
                          <li className="nav-item">
                              <a href={viewUrl} className="btn btn-outline-secondary btn-sm btn-icon with-border" id="view-shop"><i className="fa fa-eye"></i></a>
                              <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isViewShopTooltipOpened} target="view-shop" toggle={() => this.toggle('isViewShopTooltipOpened')}>
                                  {t('viewShopTooltip')}
                              </Tooltip>
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
            shopId = self.props.match.params.id,
            {t} = this.props;
        this._waitForToken = AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case Constants.events.SHOP_UPDATE_ARRIVED:
                    if (payload.data && payload.data.id === shopId) {
                        ApplicationStore.sendMessage({
                            message: t('shopUpdated'),
                            level: 'success',
                            position: 'bl'
                        });
                        self.refresh();
                    }
                    break;
                case Constants.events.ADD_PRODUCT_ARRIVED: // Display popup when a product has been added to the shop.
                    if (payload.data && payload.data.shop_id === shopId) {
                        ApplicationStore.sendMessage({
                            message: t('add_product'),
                            level: 'info',
                            position: 'tr'
                        });
                    }
                    break;
                case Constants.events.NEW_SHOP_SERVICE_ARRIVED: // Display popup when a service has been added to the shop.
                    if (payload.data && payload.data.shop_id === shopId) {
                        ApplicationStore.sendMessage({
                            message: t('add_shop_service'),
                            level: 'info',
                            position: 'tr'
                        });
                    }
                    break;
                case Constants.events.NEW_SHOP_COMMENT_ARRIVED: // Display popup when a comment has been added to the shop.
                    if (payload.data && payload.data.shop_id === shopId) {
                        ApplicationStore.sendMessage({
                            message: t('commentAdded'),
                            level: 'info',
                            position: 'tr'
                        });
                        self.refreshScore();
                    }
                    break;
                case Constants.events.REMOVE_SHOP_COMMENT_ARRIVED: // Display popup when a comment has been removed
                    if (payload.data && payload.data.shop_id === shopId) {
                        ApplicationStore.sendMessage({
                            message: t('commentRemoved'),
                            level: 'info',
                            position: 'tr'
                        });
                        self.refreshScore();
                    }
                    break;
                case Constants.events.USER_LOGGED_IN: // When the user is logged in then refresh the shop.
                    self.refresh();
                    break;
            }
        });
        this.refresh();
        Mousetrap.bind('ctrl+s', function(e) { // Save the shop (ctrl+s)
          if (self.state.isEditable) {
            e.preventDefault();
            self.saveShop();
          }
        });
    }

    componentWillUnmount() { // Remove listener.
        AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Shop));
