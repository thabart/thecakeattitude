import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { TagService } from './services/index';
import { Alert } from 'reactstrap';
import MainLayout from './MainLayout';

class Tags extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.display = this.display.bind(this);
		this.refresh = this.refresh.bind(this);
		this.displayShops = this.displayShops.bind(this);
		this.displayProducts = this.displayProducts.bind(this);
		this.state = {
			isVerticalMenuDisplayed: true,
			isLoading: true,
			errorMessage: null,
			tag: null
		};
	}

	toggle(name) { // Toggle property.
	    this.setState({
	      [name] : !this.state[name]
	    })
	}

	display() { // Display the information about the tag.
		var self = this;
		const {t} = self.props;
	    var tag = self.props.match.params.tag;
	    self.setState({
	    	isLoading: true
	    });
	    TagService.get(tag).then(function(content) {
	    	self.setState({
	    		isLoading: false,
	    		tag: content['_embedded']
	    	});
	    }).catch(function() {
	    	self.setState({
	    		isLoading: false,
	    		errorMessage: t('errorGetTag'),
	    		tag: null
	    	});
	    });
	}

	refresh() { // Refresh the list of products / shops.

	}

	displayShops() { // Display the shops.

	}

	displayProducts() { // Display the products.

	}

	render() { // Display the view.
		var self = this;
      	const {t} = self.props;
      	if (self.state.errorMessage !== null) {
	      return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
	        <div className="container">
	          <Alert color="danger" isOpen={this.state.errorMessage !== null}>{this.state.errorMessage}</Alert>
	        </div>
	      </MainLayout>);
      	}

      	var action = self.props.match.params.action;
      	if (!action && action !== 'shops' && action !== 'products') {
      		action = 'shops';
      	}
	    return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
	    	<div className={ !self.state.isLoading ? "hidden" : "container" }><i className="fa fa-spinner fa-spin"></i></div>
	    	<div className={ self.state.isLoading ? "hidden" : "row" }>
	    		{/* Display filter */ }
			    <nav className="col-md-2 hidden-sm-down vertical-menu fixed">
			    	<div className="header">
			            <i className="fa fa-bars" onClick={() => self.toggle('isVerticalMenuDisplayed')}></i>
			        </div>
			        {this.state.isVerticalMenuDisplayed ? (
			        	<div className="content">
			        	
			        	</div>	
			        ) : (
			        	<div className="content">

			        	</div>
			        )}
			    </nav>
			    {/* Display shops & products linked to the tag*/ }
			    { this.state.tag !== null && (
			      	<section className="col-md-10 offset-md-2">
			      		<div className="section">
			        		<h2>{t('tagTitle').replace('{0}', self.state.tag.name)}</h2>
			        		<ul className="nav nav-pills red">
			        			<li className="nav-item"><a href="#" className={action === "shops" ? "nav-link active" : "nav-link"} onClick={self.displayShops}>{t('shops')}</a></li>
			        			<li className="nav-item"><a href="#" className={action === "products" ? "nav-link active" : "nav-link"} onClick={self.displayProducts}>{t('products')}</a></li>
			        		</ul>
			      		</div>
			      	</section>
			    ) }
		    </div>
	    </MainLayout>);
	}

	componentWillMount() { // Execute after the render.
	    this.display();
	}
}


export default translate('common', { wait: process && !process.release })(Tags);
