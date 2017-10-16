import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { withRouter } from "react-router";
import { Alert } from 'reactstrap';
import { CategoryService, ShopsService } from './services/index';
import { ApplicationStore } from './stores/index';
import { NavLink } from "react-router-dom";
import ProductElt from "./shopProfile/productElt";
import MainLayout from './MainLayout';
import Rater from "react-rater";
import $ from 'jquery';

const defaultCount = 5;

class ShopCategories extends Component {
	constructor(props) {
		super(props);
    	this._request = {count: defaultCount, start_index: 0};
        this._page = '1';
    	this.toggle = this.toggle.bind(this);
    	this.navigate = this.navigate.bind(this);
    	this.refreshShops = this.refreshShops.bind(this);
    	this.refresh = this.refresh.bind(this);
    	this.display = this.display.bind(this);
        this.toggleCategory = this.toggleCategory.bind(this);
        this.getShopCategory = this.getShopCategory.bind(this);
        this.getElement = this.getElement.bind(this);
        this.navigateToShopCategory = this.navigateToShopCategory.bind(this);
		this.state = {
			isVerticalMenuDisplayed: true,
			errorMessage: null,
			isVerticalBarLoading: false,
			isShopsLoading: false,
			shopCategories: [],
			shopCategory: {},
			shops: [],
			pagination: []
		};
	}

	toggle(name) { // Toggle property.
	    this.setState({
	      [name] : !this.state[name]
	    })
	}

	navigate(e, page) { // Navigate through the shops.
	    e.preventDefault();
        this._page = page;
	    this._request = $.extend({}, this._request, {
	        start_index: (page - 1) * defaultCount
	    });
	    this.refreshShops();
	}

	refreshShops() { // Refresh the list of shops.
		var self = this;
		const {t} = self.props;
		ShopsService.search(self._request).then(function(shopsResult) {
			var shops = shopsResult['_embedded'];
           	var pagination = shopsResult['_links'].navigation;
			if (!(shops instanceof Array)) {
				shops = [shops];	
			}

			self.setState({
				isShopsLoading: false,
				shops: shops,
               	pagination: pagination
			});
		}).catch(function(e) {
			self.setState({
				isShopsLoading: false,
				shops: [],
				pagination: []
			});
		});
	}

	refresh()  { // Refresh the shops linked to the category.
		var self = this;
		var id = self._request['category_id'];
		self.setState({
			isShopsLoading: true
		});
		const {t} = self.props;
		CategoryService.get(id).then(function(categoryResult) {
			self.setState({
				shopCategory: categoryResult['_embedded']
			});
			self.refreshShops();
		}).catch(function() {
			self.setState({
				isShopsLoading: false,
				shops: [],
				shopCategory: {},
				pagination: [],
				errorMessage: t('retrieveShopCategoryError')
			});
		});
	}

	display() { // Display the shops.
		var self = this;
		var id = self._request['category_id'];
		self.setState({
			isVerticalBarLoading: true
		});
		const {t} = self.props;
		CategoryService.getParents().then(function(result) {
          var categories = result['_embedded'];
          categories.forEach(function(category) {
          	if (!category.children || category.children.length === 0) { return; }
          	var children = category.children.filter(function(child) { return child.id === id; });
          	category.isDeployed = children.length === 1;
          	if (children.length === 1) {
          		children[0].isSelected = true;
          	}
          });

          self.setState({
          	isVerticalBarLoading: false,
            shopCategories: categories
          });
		}).catch(function(e) {
	    	self.setState({
	    		isVerticalBarLoading: false,
	    		errorMessage: t('retrieveShopCategoriesError'),
	    		shopCategories: []
	    	});			
		});
	}

	toggleCategory(shopCategory) { // Toggle the category.
      var self = this;
      var cat = self.getShopCategory(shopCategory);
      if (cat === null) {
        return;
      }

      cat.isDeployed = !cat.isDeployed;
      self.setState({
        shopCategories: self.state.shopCategories
      });
    }

    getShopCategory(shopCategory) { /// Get shop category.
      var self = this;
      var category = self.getElement(shopCategory, self.state.shopCategories);
      if (category !== null) {
        return category;
      }

      var subCategory = null;
      self.state.shopCategories.forEach(function(cat) {
        if (subCategory === null) {
          subCategory = self.getElement(shopCategory, cat.children);
        }
      });

      return subCategory;
    }

    getElement(elt, arr) { // Get element from collection.
      var self = this;
      if (!arr || arr.length === 0) {
        return null;
      }

      var filtered = arr.filter(function(s) {
        return s === elt;
      });

      if (!filtered || filtered.length !== 1) {
        return null;
      }

      return filtered[0];
    }

    navigateToShopCategory(e, categoryId) { // Navigate to the shop category.
    	e.preventDefault();
    	var id = this.props.match.params.id;
    	if (id === categoryId) { return; }
		this._request['category_id'] = categoryId;
		this.props.history.push('/shopcategories/' + categoryId);
		this.display();
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

        var shopCategoryElts = [],
        	shops = [],
        	navigations = [];
        self.state.shopCategories.forEach(function(shopCategory) {
          var subShopCategoriesElts = [];
          shopCategory.children.forEach(function(subShopCategory) {
            subShopCategoriesElts.push((
            <a href="#" onClick={(e) => self.navigateToShopCategory(e, subShopCategory.id)} className={subShopCategory.isSelected ? "sub-menu-item active" : "sub-menu-item no-decoration" } style={{display: "block"}}>
              {subShopCategory.name}
            </a>));
          });

          var arrowCl = shopCategory.isDeployed ? "fa fa-arrow-down action": "fa fa-arrow-left action";
          shopCategoryElts.push((
            <li className="menu-item">
              <h6 className="title">{shopCategory.name}</h6>
              <div className="actions">
                <i className={arrowCl} onClick={() => { self.toggleCategory(shopCategory); }}></i>
              </div>
              {shopCategory.isDeployed ? (<ul>{subShopCategoriesElts}</ul>) : '' }
            </li>));
        });

	    if (this.state.pagination && this.state.pagination.length > 1) {
	      this.state.pagination.forEach(function (nav) {
	        navigations.push((
	          <li className="page-item"><a href="#" className={self._page === nav.name ? "page-link active" : "page-link"} onClick={(e) => {
	            self.navigate(e, nav.name);
	          }}>{nav.name}</a></li>
	        ));
	      });
	    }

	    if (this.state.shops.length > 0) {
	    	this.state.shops.forEach(function(shop) {
                var profileImage = shop.profile_image;
                if (!profileImage) {
                    profileImage = "/images/default-shop.png";
                }

                var tags = shop.tags.map(function(tag) { return (<li>{tag}</li>); });
	    		shops.push((
			        <div className="product-item">
			        	<div className="content">
			        		<NavLink className="no-decoration row" to={"/shops/" + shop.id + "/view/profile"}>
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
	        				</NavLink>
	        			</div>
	        		</div>
	    		));
	    	});
	    }

	    return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={false}>
	    	<div className="row">
	    		{/* Display popular tags */ }
			    <nav className={self.state.isVerticalMenuDisplayed ? "col-md-2 hidden-sm-down vertical-menu fixed" : "vertical-menu hidden-sm-down min fixed"} style={{zIndex : "1029"}}>
			    	<div className="header">
			            <i className="fa fa-bars" onClick={() => self.toggle('isVerticalMenuDisplayed')}></i>
			        </div>
			        <div className={ !self.state.isVerticalBarLoading && "hidden" }><i className="fa fa-spinner fa-spin"></i></div>
			        <div className={ self.state.isVerticalBarLoading && "hidden" }>
				        {this.state.isVerticalMenuDisplayed ? (
				        	<div className="content">
				        		<h3 className="uppercase"><img src="/images/shop.png" width="30" />{t('categories')}</h3>
								<ul>
	                            {shopCategoryElts}
	                          </ul>
				        	</div>	
				        ) : (
				        	<div className="content">
				        		<img src="/images/shop.png" width="30" />
				        	</div>
				        )}
			        </div>
			    </nav>
				{/* Display the shops */ }
				<section className={self.state.isVerticalMenuDisplayed ? "col-md-10 offset-md-2" : "col-md-12"}>
					<div className={!self.state.isShopsLoading && "hidden"}><i className="fa fa-spinner fa-spin"></i></div>
					<div className={self.state.isShopsLoading ? "hidden" : "container"}>
						<div className="section" style={{padding: "20px"}}>
							<h2>{t('shopCategoryTitle').replace('{0}', self.state.shopCategory.name)}</h2>
							{ shops.length > 0 && ( <div>{shops}</div> ) }
							{ shops.length === 0 && (<p>{t('noShops')}</p>) }
						    {/* Display the navigation */}			        		
							{navigations.length > 0 && (
								<ul className="pagination">
									{navigations}
								</ul>
							)}
						</div>
					</div>
				</section>
	    	</div>
	    </MainLayout>);
	}

	componentWillMount() { // Execute after the render.
		var id = this.props.match.params.id;
		this._request['category_id'] = id;
		this.display();
		this.refresh();
	}
}


export default translate('common', { wait: process && !process.release })(withRouter(ShopCategories));
