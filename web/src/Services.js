import React, {Component} from "react";
import { CommentTab, DescriptionTab } from "./servicetabs";
import { ShopServices, ShopsService } from "./services/index";
import { TabContent, TabPane, Nav, NavItem, NavLink, Alert, Badge, Breadcrumb, BreadcrumbItem, Button, UncontrolledTooltip } from "reactstrap";
import { EditableText, EditableTag, ImagesUploader } from './components/index';
import { withRouter } from "react-router";
import { translate } from 'react-i18next';
import { ApplicationStore, EditServiceStore } from './stores/index';
import { Guid } from './utils/index';
import AppDispatcher from "./appDispatcher";
import Rater from "react-rater";
import MainLayout from './MainLayout';
import Magnify from "react-magnify";
import Constants from "../Constants";
import $ from "jquery";
import classnames from "classnames";
import Mousetrap from 'mousetrap';

class Services extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
        this._commonId = null;
        this.updateServiceName = this.updateServiceName.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.updateImages = this.updateImages.bind(this);
        this.updatePrice = this.updatePrice.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleError = this.toggleError.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.navigateGeneral = this.navigateGeneral.bind(this);
        this.navigateComments = this.navigateComments.bind(this);
        this.refreshScore = this.refreshScore.bind(this);
        this.editService = this.editService.bind(this);
        this.saveService = this.saveService.bind(this);
        this.viewService = this.viewService.bind(this);
        this.updateService = this.updateService.bind(this);
        this.state = {
            isLoading: false,
            errorMessage: null,
            currentImageIndice: 0,
            service: null,
            shop: null,
            isEditable: false,
            canBeEdited: false,
            isEditServiceTooltipOpened: false,
            isViewServiceTooltipOpened: false,
            isSaveServiceTooltipOpened: false,
            isImageTooltipOpened: false,
            isPriceTooltipOpened: false
        };
    }

    updateServiceName(name) { // Update the service name.
        AppDispatcher.dispatch({
            actionName: Constants.events.UPDATE_SERVICE_INFORMATION_ACT,
            data: { name : name }
        });
    }

    updateTags(tags) { // Update the tags.
      AppDispatcher.dispatch({
          actionName: Constants.events.UPDATE_SERVICE_INFORMATION_ACT,
          data: { tags : tags }
      });
    }

    updateImages(images) { // Update the images.
      AppDispatcher.dispatch({
          actionName: Constants.events.UPDATE_SERVICE_INFORMATION_ACT,
          data: { images: images }
      });
    }

    updatePrice(price) { // Update the price.
      AppDispatcher.dispatch({
          actionName: Constants.events.UPDATE_SERVICE_INFORMATION_ACT,
          data: { price: price }
      });
    }

    toggle(name) {   // Toggle the tooltip.
        var value = !this.state[name];
        this.setState({
            [name]: value
        });
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
        var self = this,
            action = self.props.match.params.action,
            isEditable = action && action === 'edit';
        self.setState({
            isLoading: true
        });
        const {t} = this.props;
        ShopServices.get(this.props.match.params.id).then(function (r) {
            var service = r['_embedded'];
            ShopsService.get(service.shop_id).then(function(sr) {              
              var shop = sr['_embedded'];
              var localUser = ApplicationStore.getUser();
              isEditable = isEditable && localUser && localUser !== null && localUser.sub === shop.subject;
              self.setState({
                  isLoading: false,
                  shop: shop,
                  isEditable: isEditable,
                  service: service,
                  canBeEdited: !isEditable && localUser && localUser !== null && localUser.sub === shop.subject,
              });
              AppDispatcher.dispatch({
                  actionName: Constants.events.EDIT_SERVICE_LOADED,
                  data: service
              });
            })
            .catch(function(e) {
                console.log(e);
              self.setState({
                errorMessage: t('errorRetrieveService'),
                isLoading: false,
                isEditable: false,
                notUnlimited: false
              });
            });
        }).catch(function () {
            self.setState({
                errorMessage: t('errorRetrieveService'),
                isLoading: false,
                isEditable: false,
                notUnlimited: false
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

    editService() { // Edit the service.
      var id = this.props.match.params.id;
      this.props.history.push('/services/'+ id + '/edit');
      this.setState({
        isEditable: true,
        canBeEdited: false
      });
      AppDispatcher.dispatch({
          actionName: Constants.events.EDIT_SERVICE_ACT
      });
    }

    viewService() { // View the service.
      var id = this.props.match.params.id;
      this.props.history.push('/services/'+ id);
      this.setState({
        isEditable: false,
        canBeEdited: true
      });
      AppDispatcher.dispatch({
          actionName: Constants.events.VIEW_SERVICE_ACT
      });
    }

    saveService() { // Save the service information.      
      var self = this;
      var service = EditServiceStore.getService();
      var serviceId = self.props.match.params.id;
      const {t} = this.props;
      self.setState({
        isLoading: true
      });
      self._commonId = Guid.generate();
      service.occurrence = {
        days: service.occurrence.days,
        end_date: service.occurrence.end_date || service.occurrence.end_datetime,
        start_date: service.occurrence.start_date || service.occurrence.start_datetime,
        start_time: service.occurrence.start_time,
        end_time: service.occurrence.end_time
      };
      ShopServices.update(serviceId, service, self._commonId).catch(function(e) {
          var json = e.responseJSON;
          var error = t('errorUpdateShopService');
          if (json && json.error_description) {
              error = json.error_description;
          }

          ApplicationStore.sendMessage({
            message: error,
            level: 'error',
            position: 'tr'
          });
          self.setState({
            isLoading: false
          });
      });
    }

    updateService() { // Update the service information.
      var service = EditServiceStore.getService();
      this.setState({
          service: service
      });
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
            content = (<DescriptionTab service={self.state.service} isEditable={self.state.isEditable} />);
            action = 'general';
        }

        if (self.state.service.tags && self.state.service.tags.length > 0) {
            self.state.service.tags.forEach(function (tag) {
                tags.push((<li key={tag}>
                    <NavLink onClick={() => { self.props.history.push("/tags/"+tag+"/shopservices"); }} className="no-decoration red"  style={{"padding": "0", "textTransform" : "none", "fontWeight" : "100"}}>
                        {tag}
                    </NavLink>
                </li>));
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

        var user = ApplicationStore.getUser();
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
                        <li style={{"float": "right"}}>
                          {self.state.canBeEdited && (<Button outline color="secondary" id="edit-service" size="sm" className="btn-icon with-border" onClick={self.editService}>
                            <i className="fa fa-pencil"></i>
                          </Button>)}
                          {self.state.canBeEdited && (
                            <UncontrolledTooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isEditServiceTooltipOpened} target="edit-service" toggle={() => this.toggle('isEditServiceTooltipOpened')}>
                                {t('editServiceTooltip')}
                            </UncontrolledTooltip>
                          )}
                          {self.state.isEditable && (<Button outline color="secondary" id="view-service" size="sm" className="btn-icon with-border" onClick={self.viewService}>
                              <i className="fa fa-eye"></i>
                          </Button>)}
                          {self.state.isEditable && (
                            <UncontrolledTooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isViewServiceTooltipOpened} target="view-service" toggle={() => this.toggle('isViewServiceTooltipOpened')}>
                                {t('viewServiceTooltip')}
                            </UncontrolledTooltip>
                          )}
                          {self.state.isEditable && (<Button outline color="secondary" id="save-service" size="sm" className="btn-icon with-border" onClick={self.saveService}>
                              <i className="fa fa-save"></i>
                          </Button>)}
                          {self.state.isEditable && (
                            <UncontrolledTooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isSaveServiceTooltipOpened} target="save-service" toggle={() => this.toggle('isSaveServiceTooltipOpened')}>
                                {t('saveServiceTooltip')}
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
                                {/* Service name */ }
                                { self.state.isEditable ? (
                                    <EditableText className="header2" value={self.state.service.name} validate={this.updateServiceName} minLength={1} maxLength={50} />) :
                                    (<h2>{self.state.service.name}</h2>)
                                }
                                { /* Service rate */ }
                                <div>
                                  <Rater total={5} ref="score" rating={self.state.service.average_score} interactive={false}/>
                                  <b> {self.state.service.average_score} </b>
                                </div>
                                { /* Service Nb comments */ }
                                <span>{t('comments')} ({self.state.service.nb_comments})</span>
                            </div>
                            { /* Tags */ }
                            <div>
                                { self.state.isEditable && (<EditableTag tags={self.state.service.tags} tagsClassName="gray" validate={this.updateTags}/>) }
                                { !self.state.isEditable && tags.length > 0 && (
                                   <ul className="col-md-12 tags gray" style={{padding: "0"}}>
                                    {tags}
                                   </ul>
                                ) }
                                { !self.state.isEditable && tags.length === 0 && (<span><i>{t('noTags')}</i></span>) }
                            </div>
                            { /* Update the images */ }
                            { self.state.isEditable && (
                              <div style={{padding: "10px 0px 10px 0px"}}>
                                <h5>
                                  {t('uploadImage')} <i className="fa fa-info-circle txt-info" id="imagesTooltip"></i>
                                  <UncontrolledTooltip placement="right" target="imagesTooltip" className="red-tooltip-inner" isOpen={this.state.isImageTooltipOpened} toggle={() => { this.toggle('isImageTooltipOpened'); }}>
                                    {t('addShopServiceImagesTooltip')}
                                  </UncontrolledTooltip>
                                </h5>
                                <ImagesUploader ref="imagesUploader" images={this.state.service.images} onChange={this.updateImages}/>
                              </div>
                            )}
                            { /* Images */ }
                            { images.length > 0 && !self.state.isEditable && (
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
                            {/* Price */ }
                            { self.state.isEditable && (<div>
                              <h5>
                                {t('price')} <i className="fa fa-info-circle txt-info" id="priceTooltip"></i>
                                <UncontrolledTooltip placement="right" target="priceTooltip" className="red-tooltip-inner" isOpen={this.state.isPriceTooltipOpened} toggle={() => { this.toggle('isPriceTooltipOpened'); }}>
                                  {t('addShopServicePriceTooltip')}
                                </UncontrolledTooltip>
                              </h5>
                              <EditableText value={self.state.service.price} label="€" className="price header4" min={1} validate={this.updatePrice} type="number" />
                            </div>) }
                            { !self.state.isEditable && (<h4 className="price">€ {this.state.service.price}</h4>) }
                            { user && user.sub !== this.state.shop.subject && (<a href="#" onClick={(e) => { e.preventDefault(); self.props.history.push('/newmessage/services/' + self.state.service.id); }} className="btn btn-default">{t('contactTheShop')}</a>) }
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
        const {t} = self.props;
        self._waitForToken = AppDispatcher.register(function (payload) {
          switch (payload.actionName) {
            case Constants.events.NEW_SERVICE_COMMENT_ARRIVED:
            case Constants.events.REMOVE_SERVICE_COMMENT_ARRIVED:
              if (payload && payload.data && payload.data.service_id == self.state.service.id) {
                  self.refreshScore(payload.data);
                }
                break;
            case Constants.events.SERVICE_UPDATE_ARRIVED:
              if (payload.data && payload.data.id === self.state.service.id) {
                ApplicationStore.sendMessage({
                    message: t('shopServiceUpdated'),
                    level: 'success',
                    position: 'bl'
                });
                self.refresh();
              }              
            break;
          }
        });
        EditServiceStore.addChangeListener(this.updateService);
        Mousetrap.bind('ctrl+s', function(e) { // Save the service (ctrl+s)
          if (self.state.isEditable) {
            e.preventDefault();
            self.saveService();
          }
        });
    }

    componentWillUnmount() { // Remove listener.
        AppDispatcher.unregister(this._waitForToken);
        EditServiceStore.removeChangeListener(this.updateService);
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Services));
