import React, {Component} from "react";
import {ShopsService, UserService, CommentsService} from "./services/index";
import {Tooltip, Progress, Alert, Button} from "reactstrap";
import {withRouter} from "react-router";
import {NavLink} from "react-router-dom";
import {ShopProfile, ShopProducts, ShopServices} from "./shopProfile";
import {ApplicationStore} from './stores';
import {EditableText, EditableTag} from './components';
import Rater from "react-rater";
import "./Shop.css";
import "react-rater/lib/react-rater.css";
import $ from 'jquery';

class Shop extends Component {
    constructor(props) {
        super(props);
        this.clickBannerImage = this.clickBannerImage.bind(this);
        this.clickPictureImage = this.clickPictureImage.bind(this);
        this.uploadBannerImage = this.uploadBannerImage.bind(this);
        this.uploadPictureImage  = this.uploadPictureImage.bind(this);
        this.toggle = this.toggle.bind(this);
        this.refreshScore = this.refreshScore.bind(this);
        this.toggleError = this.toggleError.bind(this);
        this.state = {
            isLoading: false,
            location: {},
            user: null,
            shop: null,
            scores: null,
            nbComments: 0,
            isRatingOpened: false,
            errorMessage: null,
            isEditable: false,
            canBeEdited: false
        };
    }

    // Toggle the error
    toggleError() {
        this.setState({
            errorMessage: null
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

    // Toggle score window
    toggle() {
        this.setState({
            isRatingOpened: !this.state.isRatingOpened
        });
    }

    // Update the score
    refreshScore() {
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

    // Render the component
    render() {
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
        var self = this;
        var tags = [];
        var content = (<ShopProfile user={this.state.user} shop={this.state.shop} onRefreshScore={this.refreshScore} isEditable={this.state.isEditable} history={this.props.history}  />);
        if (action === "products") {
            content = (<ShopProducts user={this.state.user} shop={this.state.shop}  isEditable={this.state.isEditable}/>);
        } else if (action === "services") {
            content = (<ShopServices user={this.state.user} shop={this.state.shop}  isEditable={this.state.isEditable}/> );
        }

        if (this.state.isEditable) {
          profileUrl = '/shops/' + this.state.shop.id + '/edit/profile';
          productsUrl = '/shops/' + this.state.shop.id + '/edit/products';
          servicesUrl = '/shops/' + this.state.shop.id + '/edit/services';
        } else {
          profileUrl = '/shops/' + this.state.shop.id + '/view/profile';
          productsUrl = '/shops/' + this.state.shop.id + '/view/products';
          servicesUrl = '/shops/' + this.state.shop.id + '/view/services';
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

        return (<div className="container">
            <section className="row white-section shop-section cover">
                <div className="cover-banner">
                    <img src={bannerImage}/>
                </div>
                <div className="profile-img">
                  <img src={profileImage} className="img-thumbnail" width="200" height="200"/>
                  {self.state.isEditable && (<Button outline color="secondary" size="sm" className="edit-icon" onClick={this.clickPictureImage}><i className="fa fa-pencil"></i></Button>)}
                  {self.state.isEditable && (<input type="file" accept='image/*' ref="uploadProfileBtn" className="upload-image"  onChange={(e) => {this.uploadPictureImage(e);}} />)}
                </div>
                <div className="profile-information">
                    { this.state.isEditable ? (<EditableText className="header1" value={this.state.shop.name} />)
                      : ( <h1>{this.state.shop.name}</h1> )
                    }
                    { this.state.nbComments > 0 ? (
                        <div>
                            <span id="rating"><Rater total={5} ref="rater" interactive={false}/> {this.state.nbComments} comments</span>
                            <Tooltip placement='bottom' className="ratingPopup" isOpen={this.state.isRatingOpened}
                                     target="rating" toggle={this.toggle}>
                                <ul>
                                    {ratingSummary}
                                </ul>
                            </Tooltip>
                            {tags.length > 0 && this.state.isEditable && (
                                <EditableTag tags={self.state.shop.tags}/>
                            )}
                            {tags.length > 0 && !this.state.isEditable && (
                                <ul className="tags no-padding">
                                    {tags}
                                </ul>
                            )}
                        </div>) : '' }
                </div>
                <ul className="nav nav-pills menu">
                    <li className="nav-item">
                        <NavLink to={profileUrl} className={action !== 'products' && action !== 'services' ? 'nav-link active' : 'nav-link'}>Profile</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={productsUrl} className={action === 'products' ? 'nav-link active' : 'nav-link'}>Products</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to={servicesUrl} className={action === 'services' ? 'nav-link active' : 'nav-link'}>Services</NavLink>
                    </li>
                </ul>
                <ul className="nav nav-pills menu-shop-options">
                  { this.state.canBeEdited && (
                    <li className="nav-item">
                      <a href={'/shops/' + this.state.shop.id + '/edit/' + action + (subaction && subaction !== null ? '/' + subaction : '') } className="btn btn-outline-secondary btn-sm"><i className="fa fa-pencil"></i></a>
                    </li>
                  ) }
                  { this.state.isEditable && (
                    <li className="nav-item">
                      <Button outline color="secondary" size="sm"><i className="fa fa-pencil" onClick={this.clickBannerImage}></i></Button>
                      <input type="file" accept='image/*' ref="uploadBannerBtn" className="upload-image" onChange={(e) => {this.uploadBannerImage(e);}} />
                    </li>
                  )}
                  {this.state.isEditable && (
                    <li className="nav-item">
                      <a href={'/shops/' + this.state.shop.id + '/view/' + action + (subaction && subaction !== null ? '/' + subaction : '')} className="btn btn-outline-secondary btn-sm"><i className="fa fa-eye"></i></a>
                    </li>
                  )}
                </ul>
            </section>
            {content}
        </div>);
    }

    // Execute after the render
    componentWillMount() {
        var self = this;
        var shopId = self.props.match.params.id;
        var paction = self.props.match.params.paction;
        var isEditable = paction && paction === 'edit';
        self.setState({
            isLoading: true
        });
        ShopsService.get(shopId).then(function (r) {
            var shop = r['_embedded'];
            var localUser = ApplicationStore.getUser();
            console.log(localUser);
            isEditable =  isEditable && localUser && localUser !== null && localUser.sub === shop.subject;
            UserService.getPublicClaims(shop.subject).then(function (user) {
                self.setState({
                    isLoading: false,
                    shop: shop,
                    user: user,
                    isEditable : isEditable,
                    canBeEdited : !isEditable && localUser && localUser !== null && localUser.sub === shop.subject
                });
                self.refreshScore();
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
}

export default withRouter(Shop);
