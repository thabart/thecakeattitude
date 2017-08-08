import React, {Component} from "react";
import { CommentTab, DescriptionTab } from "./servicetabs";
import { ShopServices, ShopsService } from "./services/index";
import { TabContent, TabPane, Nav, NavItem, NavLink, Alert, Badge, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { withRouter } from "react-router";
import { translate } from 'react-i18next';
import AppDispatcher from "./appDispatcher";
import Rater from "react-rater";
import MainLayout from './MainLayout';
import Magnify from "react-magnify";
import Constants from "../Constants";
import $ from "jquery";
import classnames from "classnames";

class Services extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
        this.toggleError = this.toggleError.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.navigateGeneral = this.navigateGeneral.bind(this);
        this.navigateComments = this.navigateComments.bind(this);
        this.refreshScore = this.refreshScore.bind(this);
        this.state = {
            loading: false,
            errorMessage: null,
            currentImageIndice: 0,
            service: null,
            shop: null
        };
    }

    refreshScore(data) { // Refresh the score.
        var service = this.state.service;
        service['average_score'] = data['average_score'];
        service['nb_comments'] = data['nb_comments'];
        this.refs.score.setState({
            rating: service['average_score']
        });
        this.setState({
            service: service
        });
    }

    changeImage(e) { // Change the image.
        e.preventDefault();
        var indice = $(e.target).data('id');
        this.setState({
            currentImageIndice: indice
        });
    }

    toggleError() { // Toggle error message.
        this.setState({
            errorMessage: null
        });
    }

    refresh() { // Refresh the service.
        var self = this;
        self.setState({
            isLoading: true
        });
        const {t} = this.props;
        ShopServices.get(this.props.match.params.id).then(function (r) {
            var service = r['_embedded'];
            ShopsService.get(service.shop_id).then(function(sr) {
              self.setState({
                  isLoading: false,
                  service: service,
                  shop: sr['_embedded']
              });
            })
            .catch(function() {
              self.setState({
                errorMessage: t('errorRetrieveService'),
                isLoading: false
              });
            });
        }).catch(function () {
            self.setState({
                errorMessage: t('errorRetrieveService'),
                isLoading: false
            });
        });
    }

    navigateShop(e, shopId) { // Navigate to the shop.
        e.preventDefault();
        this.props.history.push('/shops/' + shopId + '/view/profile');
    }

    navigateGeneral(e) { // Display general tab.
        this.props.history.push('/services/' + this.state.service.id);
    }

    navigateComments(e) { // Display comments tab.
        this.props.history.push('/services/' + this.state.service.id + '/comments');
    }

    render() {
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

        const {t} = this.props;
        var action = this.props.match.params.action,
            self = this,
            tags = [],
            images = [],
            content = null,
            currentImageSrc = "/images/default-service.jpg";
        if (action === 'comments') {
            content = (<CommentTab service={self.state.service} />);
        } else {
            content = (<DescriptionTab service={self.state.service}/>);
            action = 'general';
        }

        if (self.state.service.tags && self.state.service.tags.length > 0) {
            self.state.service.tags.forEach(function (tag) {
                tags.push((<li key={tag}>{tag}</li>));
            });
        }

        if (self.state.service.images && self.state.service.images.length > 0) {
            var i = 0;
            self.state.service.images.forEach(function (image) {
                var img = image;
                if (i === self.state.currentImageIndice) {
                    currentImageSrc = img;
                }

                images.push((
                    <li key={i}><a href="#" className={i === self.state.currentImageIndice && "active"} data-id={i}
                                   onClick={(e) => {
                                       self.changeImage(e)
                                   }}><img src={img} data-id={i}/></a></li>));
                i++;
            });
        }

        return (
          <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
            <div className="container">
                <section className="section" style={{paddingBottom: "20px"}}>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <a href="#"
                               onClick={(e) => {
                                   self.navigateShop(e, this.state.shop.id);
                               }}>
                                {this.state.shop.name}
                            </a>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>{this.state.service.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="row">
                        { /* Left side */ }
                        <div className="col-md-8">
                          <div style={{paddingLeft: "10px"}}>
                            { /* Header */ }
                            <div>
                                <h3 className="title">{self.state.service.name}</h3>
                                <div>
                                  <Rater total={5} ref="score" rating={self.state.service.average_score} interactive={false}/>
                                  <b> {self.state.service.average_score} </b>
                                </div>
                                <span>{t('comments')} ({self.state.service.nb_comments})</span>
                            </div>
                            { /* Tags */ }
                            <div>
                                {tags.length > 0 ? (
                                    <ul className="col-md-12 tags gray" style={{padding: "0"}}>
                                        {tags}
                                    </ul>)
                                 : (<span><i>{t('noTags')}</i></span>)}
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
                            <h4>€ {self.state.service.new_price}</h4>
                            <button className="btn btn-default">{t('contactTheShop')}</button>
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
            case Constants.events.NEW_SERVICE_COMMENT_ARRIVED:
            case Constants.events.REMOVE_SERVICE_COMMENT_ARRIVED:
              if (payload && payload.data && payload.data.service_id == self.state.service.id) {
                  self.refreshScore(payload.data);
                }
                break;
            }
        });
    }

    componentWillUnmount() { // Remove listener.
        AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Services));
