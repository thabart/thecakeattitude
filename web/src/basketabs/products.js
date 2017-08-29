import React, { Component } from "react";
import { OrdersService } from '../services/index';
import { Button } from "reactstrap";
import { translate } from 'react-i18next';

class Products extends Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
  }

  refresh() { // Refresh the products.
    OrdersService.search({ }).then(function(res) {
      console.log(res);
    }).catch(function() {

    });
  }

  render() { // Display the component.
    const { t } = this.props;
    return (
      <div className="container rounded">
        <div className="col-md-12">
          <section className="row p-1">
            <p>Mettrez à jour votre ...</p>
            <div className="list-group-default col-md-12">
              <li className="list-group-item">
                <div className="col-md-3 offset-md-5">Prix</div>
                <div className="col-md-2">Quantité</div>
              </li>
              <li className="list-group-item">
                <div className="col-md-2"><img src="http://localhost:5000/products/jean.jpg" width="40" /></div>
                <div className="col-md-3"><a className="no-decoration red" href="#"><h4>Product</h4></a></div>
                <div className="col-md-3"><h4>€ 300</h4></div>
                <div className="col-md-2"><input type="number" className="form-control" /></div>
                <div className="col-md-2"><a href="#" className="btn-light red"><i className="fa fa-trash"></i></a></div>
              </li>
              <li className="list-group-item">
                <div className="col-md-2"><img src="http://localhost:5000/products/jean.jpg" width="40" /></div>
                <div className="col-md-3"><a className="no-decoration red" href="#"><h4>Product</h4></a></div>
                <div className="col-md-3"><h4>€ 300</h4></div>
                <div className="col-md-2"><input type="number" className="form-control" /></div>
                <div className="col-md-2"><a href="#" className="btn-light red"><i className="fa fa-trash"></i></a></div>
              </li>
              <li className="list-group-item">
                <div className="col-md-2"><img src="http://localhost:5000/products/jean.jpg" width="40" /></div>
                <div className="col-md-3"><a className="no-decoration red" href="#"><h4>Product</h4></a></div>
                <div className="col-md-3"><h4>€ 300</h4></div>
                <div className="col-md-2"><input type="number" className="form-control" /></div>
                <div className="col-md-2"><a href="#" className="btn-light red"><i className="fa fa-trash"></i></a></div>
              </li>
            </div>
          </section>
          <section className="row p-1">
              <Button color="default">{t('next')}</Button>
          </section>
        </div>
      </div>
    );
  }

  componentDidMount() { // Execute before the render.
    this.refresh();
  }
}

export default translate('common', { wait: process && !process.release })(Products);
