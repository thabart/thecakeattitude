import React, { Component } from "react";
import { withRouter } from "react-router";
import { translate } from 'react-i18next';
import { OrdersService } from './services/index';
import { ApplicationStore } from './stores/index';
import MainLayout from './MainLayout';

class Payment extends Component {
	constructor(props){
		super(props);
		this.state = {
			isLoading: false,
			paymentDetails: {}
		};
	}

	refresh() { // Display the payment details.
		var self = this;
		self.setState({
			isLoading: true
		});
		const {t} = self.props;
      	var orderId = self.props.match.params.id;
      	OrdersService.getPaymentDetails(orderId).then(function(paymentDetails) {
            self.setState({
            	isLoading: false,
							paymentDetails: paymentDetails
            });
      	}).catch(function(e) {
            var errorMsg = t('orderPaymentDetailsError');
            if (e.responseJSON && e.responseJSON.error_description) {
              errorMsg = e.responseJSON.error_description;
            }

            self.setState({
            	isLoading: false,
							paymentDetails: {}
            });
            ApplicationStore.sendMessage({
              message: errorMsg,
              level: 'error',
              position: 'tr'
            });
      	});
	}

	render() { // Display the component.
		var self = this;
		const { t } = self.props;
		var products = [];
		if (self.state.paymentDetails && self.state.paymentDetails.items && self.state.paymentDetails.items.length > 0) {
			self.state.paymentDetails.items.forEach(function(item) {
				products.push((<li className="list-group-item">
					<div className="col-md-9">
						<h4>{item.name}</h4>
						<p>
							{ t('quantity').replace('{0}', item.quantity)} <br />
							{ t('pricePerUnit').replace('{0}', '€ ' + item.price) }
						</p>
					</div>
					<div className="col-md-3">
						<h4>€ {item.quantity * item.price}</h4>
					</div>
				</li>));
			});
		}

		return ( <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
			<div className={ !self.state.isLoading ? "hidden" : "container" }><i className="fa fa-spinner fa-spin"></i></div>
			<div className={ self.state.isLoading ? "hidden": "container" }>
				<h2>{t('paymentDetailsTitle')}</h2>
				<section className="section" style={{padding: "10px", marginTop: "10px"}}>
					<div className="row">
						<div className="col-md-6">
			      	{ products.length === 0 ? (<span>{t('noProducts')}</span>) : (
							<div className="list-group-default">
								<li className="list-group-item">
									<div className="col-md-3 offset-md-9">{t('price')}</div>
								</li>
			          {products}
							</div>
							) }
						</div>
						<div className="col-md-6">
							<section>
			          <h5>{t('status')}</h5>
			          <span className="badge badge-default">{t('status_' + self.state.paymentDetails.state)}</span>
							</section>
							<section>
								<h5>{t('shippingPrice').replace('{0}', self.state.paymentDetails.shipping_price)}</h5>
							</section>
						</div>
					</div>
					<h4>{t('totalPrice').replace('{0}', self.state.paymentDetails.total)}</h4>
				</section>
			</div>
		</MainLayout>);
	}

	componentDidMount() { // Execute before the render.
		this.refresh();
	}
}


export default translate('common', { wait: process && !process.release })(withRouter(Payment));
