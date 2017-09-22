import React, {Component} from "react";
import { translate } from 'react-i18next';
import { OrdersService } from './services/index';
import { withRouter } from "react-router";
import { Alert } from 'reactstrap';
import { NavLink } from "react-router-dom";
import { ApplicationStore } from './stores/index';
import { UrlParser } from './utils/index';
import { InformationTab, ProductsTab } from './ordertabs/index';
import MainLayout from './MainLayout';
import AppDispatcher from './appDispatcher';
import Constants from '../Constants';

const defaultCount = 5;

class Order extends Component {
    constructor(props) {
      super(props);
      this._waitForToken = null;
      this._windowPaypal = null;
      this.refresh = this.refresh.bind(this);
      this.confirmReception = this.confirmReception.bind(this);
      this.executePaypal = this.executePaypal.bind(this);
      this.downloadLabel = this.downloadLabel.bind(this);
      this.navigateToInformation = this.navigateToInformation.bind(this);
      this.navigateToProducts = this.navigateToProducts.bind(this);
      this.state = {
        isLoading: false,
        order: {},
        isPaypalLoading: false,
        errorMessage: null,
        activeTab: null,
        seller: null
      };
    }

    refresh() { // Refresh the order.
      var self = this,
        orderId = self.props.match.params.id;
      self.setState({
        isLoading: true
      });
      const {t} = this.props;

      OrdersService.get(orderId).then(function(r) {
        var order = r['_embedded'];
        self.setState({
          order: order,
          isLoading: false
        });
        var informationTab = self.refs.informationTab.getWrappedInstance();
        var productsTab = self.refs.productsTab.getWrappedInstance();
        informationTab.refresh(order).then(function(shop) {
          self.setState({
            seller: shop.subject
          });
        });
        productsTab.refresh(order);
      }).catch(function(e) {
        self.setState({
          isLoading: false,
          order: {},
          errorMessage: t('retrieveOrderError')
        });
      });
    }

    confirmReception() { // Confirm the reception of the packet.
      var self = this;
      self.setState({
        isLoading: true
      });
      var request = {
        'status': 'received'
      };
      const {t} = this.props;
      OrdersService.update(self.state.order.id, request).catch(function(e) {
        var errorMsg = t('confirmRequestError');
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

    executePaypal() { // Execute the paypal payment.
      var self = this;
      if (self._windowPaypal && self._windowPaypal.isClosed == false) return;
      var url = self.state.order.payment.approval_url;
      self._windowPaypal = window.open(url, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=400');
      self.setState({
        isPaypalLoading: true
      });
      const { t } = this.props;
      ApplicationStore.displayLoading({
        display: true,
        message: t('processingPayment')
      });
      var isProcessing = false;
      var interval = setInterval(function () {
          if (isProcessing) return;
          if (self._windowPaypal.closed) {
              clearInterval(interval);
              self.setState({
                isPaypalLoading: false
              });
              ApplicationStore.displayLoading({
                display: false
              });
              return;
          }

          var href = self._windowPaypal.location.href;
          var paymentId = UrlParser.getParameterByName('paymentId', href);
          var payerId = UrlParser.getParameterByName('PayerID', href);
          if (!paymentId && !payerId) {
            return;
          }

          isProcessing = true;
          OrdersService.acceptPayment(self.state.order.id, {
            payer_id: payerId,
            transaction_id: paymentId
          }).then(function() {
            self.setState({
              isPaypalLoading: false
            });
            ApplicationStore.displayLoading({
              display: false
            });
            self._windowPaypal.close();
            clearInterval(interval);
          }).catch(function(e) {
            var errorMsg = t('orderTransactionCannotBeConfirmed');
            if (e.responseJSON && e.responseJSON.error_description) {
              errorMsg = e.responseJSON.error_description;
            }

            self.setState({
              isPaypalLoading: false
            });
            ApplicationStore.sendMessage({
              message: errorMsg,
              level: 'error',
              position: 'tr'
            });
            ApplicationStore.displayLoading({
              display: false
            });
            self._windowPaypal.close();
            clearInterval(interval);
          });
        });
    }

    downloadLabel() { // Download the label.
      var self = this;
      self.setState({
        isFileLoading: true
      });
      var anchor = document.createElement('a');
      OrdersService.getLabel(this.state.order.id).then(function(r) {
        var url = window.URL.createObjectURL(r);
        anchor.href = url
        anchor.click();
      });
    }

    navigateToInformation(e) { // Navigate to the information tab.
      e.preventDefault();
      this.setState({
        activeTab: 'information'
      });
      this.props.history.push('/orders/' + this.state.order.id + '/information');
    }

    navigateToProducts(e) { // Navigate to the products.
      e.preventDefault();
      this.setState({
        activeTab: 'products'
      });
      this.props.history.push('/orders/' + this.state.order.id + '/products');
    }

    render() { // Render the view.
      var self = this;
      const {t} = self.props;
      if (this.state.errorMessage !== null) {
        return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
          <div className="container">
            <Alert color="danger" isOpen={this.state.errorMessage !== null}>{this.state.errorMessage}</Alert>
          </div>
        </MainLayout>);
      }

      var sub = ApplicationStore.getUser().sub;
      var isBuyer = self.state.order && self.state.order.subject === sub;
      var isSeller = self.state.seller && self.state.seller === sub;
      return (
        <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
            <div className={ !self.state.isLoading ? "hidden" : "container" }><i className="fa fa-spinner fa-spin"></i></div>
            <div className={ self.state.isLoading ? "hidden" : "container" }>
              <h2>{t('orderTitle')}</h2>
              <ul className="nav nav-pills shop-products-menu">
                <a className={self.state.activeTab === 'information' ? "nav-link active" : "nav-link"} onClick={self.navigateToInformation}>
                  {t('information')}
                </a>
                <a className={self.state.activeTab === 'products' ? "nav-link active" : "nav-link"} onClick={self.navigateToProducts}>
                  {t('products')}
                </a>
              </ul>
              <section className="section" style={{padding: "10px", marginTop: "10px"}}>
                <div className={self.state.activeTab === 'products' && 'hidden'}>
                  <InformationTab ref="informationTab" />
                </div>
                <div className={self.state.activeTab === 'information' && 'hidden'}>
                  <ProductsTab ref="productsTab" />
                </div>
                <div style={{marginTop: "10px"}}>
                  <h4>{t('totalPrice').replace('{0}', self.state.order.total_price)} {this.state.order.transport_mode === 'packet' && (<span className="badge badge-default">{t('additionalTransportFeeds').replace('{0}', this.state.order.package.estimated_price)}</span>)}</h4>
                </div>
                <div style={{marginTop: "10px"}}>
                  { this.state.order.transport_mode && this.state.order.transport_mode === 'manual' && this.state.order.status === 'confirmed' && isBuyer && (
                    <button className="btn btn-default" onClick={this.confirmReception}>{t('confirmReception')}</button>
                  ) }
                  { this.state.order.payment && this.state.order.payment.approval_url && this.state.order.payment.status === 'created' && isBuyer && (
                    <button className="btn btn-default" onClick={this.executePaypal} disabled={this.state.isPaypalLoading && 'disabled'}>
                      { this.state.isPaypalLoading ? (t('loginPaypalProcessing')) : (t('buyWithPaypal')) }
                    </button>
                  ) }
                  { this.state.order.transport_mode && this.state.order.transport_mode === 'packet' && this.state.order.status === 'confirmed' && this.state.order.payment && this.state.order.payment.status === 'approved' && isSeller && this.state.order.shipment_identification_number && (
                    <button className="btn btn-default" onClick={this.downloadLabel}>{t('downloadLabel')}</button>
                  ) }
                  { this.state.order.transport_mode && this.state.order.transport_mode === 'packet' && this.state.order.status === 'confirmed' && this.state.order.payment && this.state.order.payment.status === 'approved' && isSeller && !this.state.order.shipment_identification_number && (
                    <NavLink to={'/printlabel/' + this.state.order.id } className="btn btn-default">{t('buyLabel')}</NavLink>
                  ) }
                </div>
               </section>
            </div>
          ) }
        </MainLayout>
      );
    }

    componentDidMount() { // Execute before the render.
      var self = this;
      const {t} = this.props;
      var action = self.props.match.params.action;
      if (!action || (action !== 'information' && action !== 'products')) {
          action = 'information';
      }

      self.setState({
        activeTab: action
      });
      self.refresh();
      self._waitForToken = AppDispatcher.register(function (payload) {
          switch (payload.actionName) {
            case Constants.events.ORDER_UPDATED_ARRIVED:
              ApplicationStore.sendMessage({
                message: t('basketUpdated'),
                level: 'success',
                position: 'bl'
              });
              self.refresh();
            break;
            case Constants.events.ORDER_RECEIVED_ARRIVED:
              ApplicationStore.sendMessage({
                message: t('orderReceived'),
                level: 'success',
                position: 'bl'
              });
              self.refresh();
            break;
            case Constants.events.ORDER_TRANSACTION_RECEIVED_ARRIVED:
              ApplicationStore.sendMessage({
                message: t('orderTransactionApproved'),
                level: 'success',
                position: 'bl'
              });
              self.refresh();
            break;
          }
      });
    }

    componentWillUnmount() { // Remove listener.
        AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Order));
