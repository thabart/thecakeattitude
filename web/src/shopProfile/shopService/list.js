import React, {Component} from "react";
import { Range } from "rc-slider";
import { NavLink } from "react-router-dom";
import { Alert, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { ShopServices } from "../../services/index";
import { SelectDate } from '../../components/index';
import { translate } from 'react-i18next';
import ServiceElt from '../serviceElt';
import Rater from "react-rater";
import moment from "moment";
import Constants from "../../../Constants";
import AppDispatcher from "../../appDispatcher";
import $ from "jquery";

let countServices = 5;

class List extends Component {
    constructor(props) {
        super(props);
        this._page = '1';
        this._waitForToken = null;
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.toggleError = this.toggleError.bind(this);
        this.changePage = this.changePage.bind(this);
        this.search = this.search.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.changeOrder = this.changeOrder.bind(this);
        this.state = {
            startDate: moment(),
            endDate: moment(),
            errorMessage: null,
            services: [],
            pagination: [],
            serviceName: null
        };
        this.request = {
            from_datetime: this.state.startDate.format(),
            to_datetime: this.state.endDate.format(),
            count: countServices,
            orders: [{target: 'update_datetime', method: 'desc'}]
        };
    }

    handleInputChange(e) { // Handle input change.
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    toggleError() { // Toggle error message.
        this.setState({
            errorMessage: null
        });
    }

    handleChangeStart(date) { // Execute when the start datetime is changed.
        this.setState({
            startDate: date
        });
    }

    handleChangeEnd(date) { // Execute when the end datetime is changed.
        this.setState({
            endDate: date
        });
    }

    refresh() { // Refresh the list of services.
        var self = this;
        self.setState({
            isLoading: true
        });
        const {t} = this.props;
        ShopServices.search(self.request).then(function (r) {
            var embedded = r['_embedded'];
            var pagination = r['_links'].navigation;
            if (!(embedded instanceof Array)) {
                embedded = [embedded];
            }

            self.setState({
                isLoading: false,
                services: embedded,
                pagination: pagination
            });
        }).catch(function () {
            self.setState({
                isLoading: false,
                errorMessage: t('errorRetrieveServices')
            });
        });
    }

    changePage(e, name) { // Execute when the page change.
        e.preventDefault();
        this._page = name;
        this.request = $.extend({}, this.request, {
            start_index: countServices * (name - 1)
        });
        this.refresh();
    }

    search() { // Execute when the user clicks on search.
        this.request = $.extend({}, this.request, {
            name: this.state.serviceName,
            from_datetime: this.state.startDate.format(),
            to_datetime: this.state.endDate.format()
        });
        this.refresh();
    }

    changeOrder(e) { // Execute when the order has changed.
        var selected = $(e.target).find(':selected');
        var obj = {
            target: $(selected).data('target'),
            method: $(selected).data('method')
        };
        this.request.orders = [obj];
        this.search();
    }

    render() { // Display the view.
        var services = [],
            pagination = [],
            self = this;
        const {t} = this.props;
        if (self.state.services && self.state.services.length > 0) {
            self.state.services.forEach(function (service) {
              services.push((<ServiceElt service={service} className="col-md-12"/>));
            });
        }

        if (this.state.pagination && this.state.pagination.length > 1) {
            this.state.pagination.forEach(function (page) {
                pagination.push((<li className="page-item">
                  <a className={self._page === page.name ? "page-link active" : "page-link"} href="#" onClick={(e) => { self.changePage(e, page.name);}}>{page.name}</a>
                </li>))
            });
        }

        return (
            <div className="col-md-12">
                { this.state.errorMessage !== null && (
                  <Alert color="danger col-md-12" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert>)
                }
                <div className="row col-md-12">
                    <div className="col-md-3">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            this.search();
                        }}>
                            { /* Service name */ }
                            <div className="form-group">
                                <label>{t('serviceName')}</label>
                                <input type="text" className="form-control" name='serviceName' onChange={this.handleInputChange}/>
                            </div>
                            { /* Select date */ }
                            <div className="form-group">
                              <label>Date</label>
                              <SelectDate />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-default" onClick={this.search}>{t('search')}</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-9">
                        <div className="col-md-12">
                            <div className="col-md-4 offset-md-8">
                                <label>{t('filterBy')}</label>
                                <select className="form-control" onChange={(e) => {
                                    this.changeOrder(e);
                                }}>
                                    <option data-target="update_datetime" data-method="desc">{t('latest')}</option>
                                    <option data-target="price" data-method="asc">{t('priceAsc')}</option>
                                    <option data-target="price" data-method="desc">{t('priceDesc')}</option>
                                    <option data-target="average_score" data-method="asc">{t('scoreAsc')}</option>
                                    <option data-target="average_score" data-method="desc">{t('scoreDesc')}</option>
                                </select>
                            </div>
                        </div>
                        { this.state.isLoading ? (<i className='fa fa-spinner fa-spin'></i>) : (
                            <div>
                                { services.length === 0 ? (<span>{t('noServices')}</span>) : services }
                            </div>
                        )}
                        { pagination.length > 0 && (<ul className="pagination">
                            {pagination}
                        </ul>) }
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() { // Execute before render view.
        var self = this,
          shopId = self.props.shop.id;
        this.request = $.extend({}, this.request, {
            shop_id: shopId
        });
        this.refresh();
        self._waitForToken = AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case 'new-service':
                case 'new-service-comment':
                case 'remove-service-comment':
                    if (payload.data && payload.data.shop_id === shopId) {
                      self.request = $.extend({}, self.request, {
                          start_index: 0
                      });
                      self.refresh();
                    }
                break;
            }
        });
    }

    componentWillUnmount() {
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(List);
