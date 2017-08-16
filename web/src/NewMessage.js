import React, { Component } from "react";
import { translate } from 'react-i18next';
import { MessageService, UserService, ProductsService, ShopServices, ShopsService } from './services/index';
import { Breadcrumb, BreadcrumbItem, Input, FormFeedback, UncontrolledTooltip, FormGroup, Label, Form } from 'reactstrap';
import { withRouter } from "react-router";
import { ApplicationStore } from './stores/index';
import { Guid } from './utils/index';
import Constants from '../Constants';
import AppDispatcher from './appDispatcher';
import MainLayout from './MainLayout';

class NewMessage extends Component {
  constructor(props) {
    super(props);
    this._userSubject = null;
    this._commonId = null;
    this._waitForToken = null;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.send = this.send.bind(this);
    this.navigateMessages = this.navigateMessages.bind(this);
    this.buildError = this.buildError.bind(this);
    this.refresh = this.refresh.bind(this);
    this.state = {
      isLoading: false,
      shopName: null,
      subject: null,
      content: null,
      productId: null,
      serviceId: null,
      valid: {
        isShopInvalid: false,
        isSubjectInvalid: false,
        isContentInvalid: false
      }
    };
  }

  handleInputChange(e) { // Handle the input change.
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }

  send(e) { // Send a message.
    e.preventDefault();
    var self = this,
      valid = self.state.valid,
      isValid = true;
    const {t} = self.props;
    // Check the destination.
    if (!self._userSubject || self._userSubject === null) {
        valid.isShopInvalid = true;
        isValid = false;
    }

    // Check subject.
    if (!self.state.subject || self.state.subject.length < 1 || self.state.subject.length > 50) {
        valid.isSubjectInvalid = true;
        isValid = false;
    } else {
        valid.isSubjectInvalid = false;
    }

    // Check content.
    if (!self.state.content || self.state.content.length < 1 || self.state.content.length > 255) {
        valid.isContentInvalid = true;
        isValid = false;
    } else {
        valid.isContentInvalid = false;
    }

    this.setState({
      valid: valid
    });

    if (!isValid) {
      return;
    }

    var json = {
      to: self._userSubject,
      subject: self.state.subject,
      content: self.state.content,
      product_id: self.state.productId,
      service_id: self.state.serviceId
    };
    self.setState({
      isLoading: true
    });
    self._commonId = Guid.generate();
    MessageService.add(json, self._commonId).catch(function() {
      ApplicationStore.sendMessage({
        message: t('errorAddMessage'),
        level: 'error',
        position: 'tr'
      });
      self.setState({
        isLoading: false
      });
    });
  }

  navigateMessages(e) { // Navigate to my messages.
    e.preventDefault();
    this.props.history.push('/messages');
  }

  buildError(validName, description) { // Build an error.
      var result;
      if (this.state.valid[validName]) {
          result = (
              <span>
                  {description}
              </span>);
      }

      return result;
  }

  refresh() { // Refresh the page.
    var self = this,
      callback = null;
    const {t} = self.props;
    if (this.state.serviceId && this.state.serviceId !== null) {
      callback = ShopServices.get(this.state.serviceId);
    } else if (this.state.productId && this.state.productId !== null) {
      callback = ProductsService.get(this.state.productId);
    }

    if (callback !== null) {
      callback.then(function(objElt) {
        var embedded = objElt['_embedded'];
        var subject = self.state.serviceId && self.state.serviceId !== null ? t('shopServiceMessageSubject') : t('productMessageSubject');
        subject = subject.replace('{0}', embedded.name);
        ShopsService.get(embedded.shop_id).then(function(objShop) {
          var shop = objShop['_embedded'];
          self._userSubject = shop.subject;
          self.setState({
            isLoading: false,
            subject: subject,
            shopName: shop.name
          });
        }).catch(function() {
          self.setState({
            isLoading: false
          });
        });
      }).catch(function() {
        self.setState({
          isLoading: false
        });
      });
    } else {
      self.setState({
        isLoading: false
      });
    }
  }

  render() { // Display new message form.
    const {t} = this.props;
    if (this.state.isLoading) {
        return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
            <div className="container">
              <i className='fa fa-spinner fa-spin'></i>
            </div>
        </MainLayout>);
    }

    var self = this;
    const shopError = this.buildError('isShopInvalid', t('destinationMustBeSpecified'));
    const subjectError = this.buildError('isSubjectInvalid', t('contains1To50CharsError'));
    const contentError = this.buildError('isContentInvalid', t('contains1To255CharsError'));
    const feedbackShop = shopError ? "danger" : undefined;
    const feedbackSubject = subjectError ? "danger" : undefined;
    const feedbackContent = contentError ? "danger" : undefined;
    return (
      <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <h2>{t('newMessageTitle')}</h2>
          <div className="section">
            <Breadcrumb>
              <BreadcrumbItem>
                <a href="#"
                 onClick={(e) => {
                 self.navigateMessages(e);
                }}>
                  {t('yourMessages')}
                </a>
               </BreadcrumbItem>
              <BreadcrumbItem active>{t('newMessageTitle')}</BreadcrumbItem>
            </Breadcrumb>
            <Form onSubmit={this.send} style={{padding: "20px"}}>
              { /* User */ }
              <FormGroup color={feedbackShop}>
                <Label className="col-form-label">
                  {t('shopMessage')} <i className="fa fa-info-circle txt-info" id="tooltipShopMessage"/>
                </Label>
                <UncontrolledTooltip placement="right" target="tooltipShopMessage" className="red-tooltip-inner">
                    {t('shopMessageTooltip')}
                </UncontrolledTooltip>
                <Input type="text" state={feedbackShop} value={this.state.shopName} disabled />
                <FormFeedback>{shopError}</FormFeedback>
              </FormGroup>
              { /* Subject of the message  */ }
              <FormGroup color={feedbackSubject}>
                <Label className="col-form-label">
                  {t('subjectMessage')} <i className="fa fa-info-circle txt-info" id="tooltipSubjectMessage"/>
                  {self.state.productId && self.state.productId !== null && ( <i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/products/'+self.state.productId)} /> ) }
                  {self.state.serviceId && self.state.serviceId !== null && ( <i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/services/'+self.state.serviceId)} /> ) }
                </Label>
                <UncontrolledTooltip placement="right" target="tooltipSubjectMessage" className="red-tooltip-inner">
                    {t('subjectMessageTooltip')}
                </UncontrolledTooltip>
                <Input type="text" state={feedbackSubject} name="subject" value={this.state.subject} onChange={this.handleInputChange} />
                <FormFeedback>{subjectError}</FormFeedback>
              </FormGroup>
              { /* Content of the message */ }
              <FormGroup color={feedbackContent}>
                <Label className="col-form-label">{t('contentMessage')} <i className="fa fa-info-circle txt-info" id="tooltipContentMessage"/></Label>
                <UncontrolledTooltip placement="right" target="tooltipContentMessage" className="red-tooltip-inner">
                    {t('contentMessageTooltip')}
                </UncontrolledTooltip>
                <Input type="textarea" state={feedbackContent} name="content" onChange={this.handleInputChange} />
                <FormFeedback>{contentError}</FormFeedback>
              </FormGroup>
              { /* Submit button */ }
              <div className="form-group">
                <button className="btn btn-default">{t('sendMessage')}</button>
              </div>
            </Form>
          </div>
        </div>
      </MainLayout>
    );
  }

  componentDidMount() { // Execute before the render.
    var self = this,
      action = self.props.match.params.action,
      id = self.props.match.params.id;
    switch(action) {
      case 'services':
        this.state.serviceId = id;
        self.setState({
          serviceId: id
        });
      break;
      case 'products':
        this.state.productId = id;
        self.setState({
          productId: id
        });
      break;
    }

    self.refresh();
    self._waitForToken = AppDispatcher.register(function (payload) {
      switch (payload.actionName) {
          case Constants.events.MESSAGE_ADDED:
              if (payload.data && payload.data.common_id === self._commonId) {
                self.props.history.push('/message/' + payload.data.id);
              }
              break;
      }
    });
  }

  componentWillUnmount() { // Remove listener.
      AppDispatcher.unregister(this._waitForToken);
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(NewMessage));
