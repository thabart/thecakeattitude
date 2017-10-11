import React, {Component} from "react";
import { translate } from 'react-i18next';
import { ProductsService } from '../services/index';
import { NavLink } from "react-router-dom";
import { Badge } from 'reactstrap';

const defaultCount = 5;

class Products extends Component {
  constructor(props) {
    super(props);
    this._request = {
      start_index: 0,
      count: defaultCount
    };
    this._page = '1';
    this.changePage = this.changePage.bind(this);
    this.refresh = this.refresh.bind(this);
    this.state = {
      isLoading: false,
      products: [],
      pagination: [],
      order : {}
    };
  }


  changePage(e, page) { // Change the page.
      e.preventDefault();
      this._page = page;
      this._request['start_index'] = (page - 1) * defaultCount;
      this.refresh();
  }

  refresh(order) { // Refresh the products.
    var self = this;
    var productIds = order.lines.map(function(line) { return line.product_id; });
    self._request['product_ids'] = productIds;
    self.setState({
      isLoading: true
    });
    ProductsService.search(self._request).then(function(res) {
      var products = res['_embedded'];
      var pagination = res['_links'].navigation;
      if (!(products instanceof Array)) {
        products = [products];
      }

      self.setState({
        isLoading: false,
        products: products,
        pagination: pagination,
        order: order
      });
    });
  }

  render() { // Display the products.
    var self = this;
    var pagination = [],
      products = [];
    const { t } = self.props;
    if (self.state.pagination && self.state.pagination.length > 1) {
      self.state.pagination.forEach(function (page) {
        pagination.push((<li className="page-item">
          <a className={self._page === page.name ? "page-link active" : "page-link"} href="#" onClick={(e) => { self.changePage(e, page.name);}}>
            {page.name}
          </a>
        </li>))
      });
    }

    if (self.state.order && self.state.order.lines && self.state.order.lines.length > 0) {
      self.state.order.lines.forEach(function(orderLine) {
        var product = self.state.products.filter(function(prod) { return prod.id === orderLine.product_id; })[0];
        if (!product) {
          return;
        }

        var productImage = product['images'];
        if (!productImage || productImage.length === 0) {
          productImage = "/images/default-product.jpg";
        } else {
          productImage = productImage[0];
        }

        var discount = orderLine['discount'];
        console.log(discount);
        products.push((<li className="list-group-item">
          <div className="col-md-2"><img src={productImage} width="40" /></div>
          <div className="col-md-4">
            <NavLink to={"/products/" + product.id} className="no-decoration red" href="#"><h4>{product.name}</h4></NavLink>
            <p>
              {t('oneUnitEqualTo').replace('{0}', product.quantity + ' ' + t(product.unit_of_measure))}
            </p>
            {!discount || discount === null && (
              <p>
                {t('pricePerUnit').replace('{0}', '€ ' + product.price)}
              </p>
            )}
            {discount && (
              <p dangerouslySetInnerHTML={{__html: t('pricePerUnitWithDiscount').replace('{0}', '€ ' + product.price).replace('{1}', '€ ' + (product.price - discount.money_saved))}}></p>
            )}
            <p>
              {t('availableInStock').replace('{0}', product.available_in_stock)}
            </p>
            {discount && (
              <p>{t('discount')} : <h5 className="inline">
                      <Badge color="success">
                        { discount.type === 'amount' && (<i style={{color: "white"}} className="ml-1">- € {discount.value}</i>) }     
                        { discount.type === 'percentage' && (<i style={{color: "white"}} className="ml-1">- % {discount.value}</i>) }                   
                      </Badge>
                  </h5>
              </p>
            )}
          </div>
          <div className="col-md-3">
            <h4>€ {orderLine.price}</h4>
          </div>
          <div className="col-md-3">{orderLine.quantity}</div>
        </li>));
      });
    }

    if (self.state.isLoading) {
      return (<div className="container"><i className="fa fa-spinner fa-spin"></i></div>);
    }

    return (<div>
      { /* Display products */ }
      { products.length === 0 ? (<span>{t('noProducts')}</span>) : (
        <div className="list-group-default">
          <li className="list-group-item">
            <div className="col-md-3 offset-md-6">{t('price')}</div>
            <div className="col-md-2">{t('productQuantity')}</div>
          </li>
          {products}
        </div>
      ) }
      { /* Display pagination */ }
      { pagination.length > 0 && (<ul className="pagination">
        { pagination }
      </ul>)}
    </div>);
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(Products);
