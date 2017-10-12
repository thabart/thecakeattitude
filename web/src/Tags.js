import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { TagService, ShopsService, ProductsService } from './services/index';
import { withRouter } from "react-router";
import { Alert } from 'reactstrap';
import { ApplicationStore } from './stores/index';
import ProductElt from "./shopProfile/productElt";
import MainLayout from './MainLayout';
import Rater from "react-rater";
import $ from 'jquery';

const defaultCount = 2;

class Tags extends Component {
	constructor(props) {
		super(props);
    	this._request = {count: defaultCount, start_index: 0};
        this._page = '1';
    	this.getAction = this.getAction.bind(this);
    	this.resetFilter = this.resetFilter.bind(this);
    	this.navigate = this.navigate.bind(this);
		this.toggle = this.toggle.bind(this);
		this.display = this.display.bind(this);
		this.refresh = this.refresh.bind(this);
		this.refreshProducts = this.refreshProducts.bind(this);
		this.refreshShops = this.refreshShops.bind(this);
		this.displayShops = this.displayShops.bind(this);
		this.displayProducts = this.displayProducts.bind(this);
		this.changeOrder = this.changeOrder.bind(this);
		this.state = {
			isVerticalMenuDisplayed: true,
			isLoading: true,
			errorMessage: null,
			tag: null,
      		pagination: [],
      		shops: [],
      		products: [],
      		isContentLoading: false
		};
	}

	getAction() { // Get the action.
		var self = this;
      	var action = self.props.match.params.action;
      	if (!action && action !== 'shops' && action !== 'products') {
      		action = 'shops';
      	}

      	return action;
	}

	navigate(e, page) { // Navigate through the shops or products.
	    e.preventDefault();
        this._page = page;
	    this._request = $.extend({}, this._request, {
	        start_index: (page - 1) * defaultCount
	    });
	    this.refresh();
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
	    		tag: content['_embedded'],
	    		isLoading: false
	    	});
    		self.resetFilter();
	    	self.refresh();
	    }).catch(function() {
	    	self.setState({
	    		isLoading: false,
	    		errorMessage: t('errorGetTag'),
	    		tag: null
	    	});
	    });
	}

	refresh() { // Refresh the list of products / shops.
		var self = this;
      	var action = self.getAction();
      	if (action === 'shops') {
      		self.refreshShops();
      	} else {
      		self.refreshProducts();
      	}
	}

	refreshProducts() { // Display the products.
		var self = this;
		self.setState({
			isContentLoading: true
		});
		var request = $.extend({}, self._request);
	    var tag = self.props.match.params.tag;
		request['tags'] = [tag];
		ProductsService.search(request).then(function(productsResult) {
            var productsEmbedded = productsResult['_embedded'];
            var pagination = productsResult['_links'].navigation;
            if (!(productsEmbedded instanceof Array)) {
                productsEmbedded = [productsEmbedded];
            }

	        self.setState({
	        	isContentLoading: false,
	        	products: productsEmbedded,
                pagination: pagination
	        });
		}).catch(function(e) {
	        var errorMsg = '';
	        if (e.responseJSON && e.responseJSON.error_description) {
	          errorMsg = e.responseJSON.error_description;
	        }

	        ApplicationStore.sendMessage({
	          message: errorMsg,
	          level: 'error',
	          position: 'tr'
	        });
	        self.setState({
	        	isContentLoading: false,
	        	products: [],
	        	pagination: []
	        });
		});
	}

	refreshShops() { // Display the shops.
		var self = this;
		self.setState({
			isContentLoading: true
		});
		var request = $.extend({}, self._request);
	    var tag = self.props.match.params.tag;
		request['tags'] = [tag];
		ShopsService.search(request).then(function(shopsResult) {
            var shopsEmbedded = shopsResult['_embedded'];
            var pagination = shopsResult['_links'].navigation;
            if (!(shopsEmbedded instanceof Array)) {
                shopsEmbedded = [shopsEmbedded];
            }

	        self.setState({
	        	isContentLoading: false,
	        	shops: shopsEmbedded,
                pagination: pagination
	        });
		}).catch(function(e) {
	        var errorMsg = '';
	        if (e.responseJSON && e.responseJSON.error_description) {
	          errorMsg = e.responseJSON.error_description;
	        }

	        ApplicationStore.sendMessage({
	          message: errorMsg,
	          level: 'error',
	          position: 'tr'
	        });
	        self.setState({
	        	isContentLoading: false,
	        	shops: [],
	        	pagination: []
	        });
		});
	}

	displayShops() { // Display the shops.
		if (this.getAction() === 'shops') { return; }
	    var tag = this.props.match.params.tag;  
    	this._request.orders = [
	    	{ target: 'create_datetime', method:  'desc' }
	    ];
    	this.props.history.push('/tags/'+tag+'/shops');
    	this.resetFilter();
    	this.refreshShops();
	}

	displayProducts() { // Display the products.
		if (this.getAction() === 'products') { return; }
	    var tag = this.props.match.params.tag;    
    	this.props.history.push('/tags/'+tag+'/products');
    	this.resetFilter();
    	this.refreshProducts();
	}

	resetFilter() {
		this._request = {count: 2, start_index: 0};
    	this._request.orders = [
	    	{ target: 'create_datetime', method:  'desc' }
	    ];
	    this._page = '1';
	}

	changeOrder(e) { // Change the order.
        var selected = $(e.target).find(':selected');
        var obj = {
            target: $(selected).data('target'),
            method: $(selected).data('method')
        };
        this._request.orders = [obj];
        this.refresh();
	}

	render() { // Display the view.
		var self = this;
      	const {t} = self.props;
      	if (self.state.errorMessage !== null) {
	      return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={false}>
	        <div className="container">
	          <Alert color="danger" isOpen={this.state.errorMessage !== null}>{this.state.errorMessage}</Alert>
	        </div>
	      </MainLayout>);
      	}

      	var action = self.getAction(),
      		navigations = [],
      		shops = [],
      		products = [];

	    if (this.state.pagination && this.state.pagination.length > 1) {
	      this.state.pagination.forEach(function (nav) {
	        navigations.push((
	          <li className="page-item"><a href="#" className={self._page === nav.name ? "page-link active" : "page-link"} onClick={(e) => {
	            self.navigate(e, nav.name);
	          }}>{nav.name}</a></li>
	        ));
	      });
	    }

	    if (action === 'shops' && this.state.shops.length > 0) {
	    	this.state.shops.forEach(function(shop) {
                var profileImage = shop.profile_image;
                if (!profileImage) {
                    profileImage = "/images/default-shop.png";
                }

                var tags = shop.tags.map(function(tag) { return (<li>{tag}</li>); });
	    		shops.push((
			        <div className="product-item">
			        	<div className="content">
			        		<a className="no-decoration row" href="#">
			        			<div className="col-md-3">
			        				<img src={profileImage} className="rounded" width="140" height="140" />
			        			</div>
			        			<div className="col-md-9">
			        				<h3>{shop.name}</h3>
			        				<Rater total={5} rating={shop.average_score} interactive={false}/><i>{t('comments')}: {shop.nb_comments}</i>
			        				<ul className="tags no-padding gray">
			        					{tags}
			        				</ul>
			        			</div>
	        				</a>
	        			</div>
	        		</div>
	    		));
	    	});
	    }

	    if (action === 'products' && this.state.products.length > 0) {
	    	this.state.products.forEach(function(product) {
	    		products.push((<ProductElt product={product} />));
	    	});
	    }

	    return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={false}>
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
			      		<div className="container">
				      		<div className="section" style={{padding: "20px"}}>
				        		<h2>{t('tagTitle').replace('{0}', self.state.tag.name)}</h2>
				        		<ul className="nav nav-pills red">
				        			<li className="nav-item"><a href="#" className={action === "shops" ? "nav-link active" : "nav-link"} onClick={self.displayShops}>{t('shops')}</a></li>
				        			<li className="nav-item"><a href="#" className={action === "products" ? "nav-link active" : "nav-link"} onClick={self.displayProducts}>{t('products')}</a></li>
				        		</ul>
				        		{/* Display filtering */}
						        <div className="col-md-4 offset-md-8">
						        	<label>{t('filterBy')}</label>
						        	<select className={action === 'shops' ? 'form-control': 'hidden'} onChange={(e) => { this.changeOrder(e); }}>
						        		<option data-target="create_datetime" data-method="desc">{t('latest')}</option>
						        		<option data-target="average_score" data-method="desc">{t('bestRatings')}</option>
						        	</select>
						        	<select className={action === 'products' ? 'form-control' : 'hidden'} onChange={(e) => { this.changeOrder(e); }}>
						        		<option data-target="create_datetime" data-method="desc">{t('latest')}</option>
						        		<option data-target="average_score" data-method="desc">{t('bestRatings')}</option>
						        		<option data-target="best_deals" data-method="desc">{t('bestDeals')}</option>
						        		<option data-target="price" data-method="asc">{t('priceAsc')}</option>
						        		<option data-target="price" data-method="desc">{t('priceDesc')}</option>
						        	</select>
						        </div>
				        		{this.state.isContentLoading ? (<i className="fa fa-spinner fa-spin"></i>) : (
				        			<div>
						        		{ shops.length > 0 && ( <div>{shops}</div> ) }
						        		{ products.length > 0 && (<div>{products}</div>) }
						        		{/* Display the navigation */}			        		
								        {navigations.length > 0 && (
								          <ul className="pagination">
								            {navigations}
								          </ul>
								        )}
				        			</div>
				        		)}
				      		</div>
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


export default translate('common', { wait: process && !process.release })(withRouter(Tags));
