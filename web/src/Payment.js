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
			isLoading: false
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
            	isLoading: false
            });
            console.log(paymentDetails);
      	}).catch(function(e) {
            var errorMsg = t('orderPaymentDetailsError');
            if (e.responseJSON && e.responseJSON.error_description) {
              errorMsg = e.responseJSON.error_description;
            }

            self.setState({
            	isLoading: false
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
		const {t} = self.props;
		return ( <MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
			<div className={ !self.state.isLoading ? "hidden" : "container" }><i className="fa fa-spinner fa-spin"></i></div>
			<div className={ self.state.isLoading ? "hidden": "container" }>
				<h2>{t('paymentDetailsTitle')}</h2>
				<section className="section" style={{padding: "10px", marginTop: "10px"}}>

				</section>
			</div>
		</MainLayout>);
	}

	componentDidMount() { // Execute before the render.
		this.refresh();
	}
}


export default translate('common', { wait: process && !process.release })(withRouter(Payment));
