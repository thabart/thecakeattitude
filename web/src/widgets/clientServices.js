import React, {Component} from "react";
import { ClientService } from '../services/index';
import { Button } from 'reactstrap';
import { translate } from 'react-i18next';
import Widget from "../components/widget";
import AppDispatcher from "../appDispatcher";
import Constants from '../../Constants';
import $ from 'jquery';

class ClientServices extends Component {
    constructor(props) {
        super(props);
        this._waitForToken = null;
        this.navigate = this.navigate.bind(this);
        this.showDetails = this.showDetails.bind(this);
        this.localize = this.localize.bind(this);
        this.navigateToClientService = this.navigateToClientService.bind(this);
        this.state = {
            errorMessage: null,
            isLoading: false,
            clientServices: [],
            navigation: [],
            details: {}
        };
    }

    localize(e, clientService) {
      e.preventDefault();
      e.stopPropagation();
      this.props.setCurrentMarker(clientService.id);
    }

    showDetails(id, isDetailDisplayed) {
      var details = this.state.details;
      details[id] = !isDetailDisplayed;
      this.setState({
        details : details
      });
    }

    reset() {
      this.setState({
          clientServices: [],
          navigation: []
      });
    }

    refresh(json) {
        var request = $.extend({}, json, {
            orders: [
                {target: "update_datetime", method: "desc"}
            ],
            count: 5
        });
        this.request = request;
        this.display(request);
    }

    navigate(e, name) {
        e.preventDefault();
        var startIndex = name - 1;
        var request = $.extend({}, this.request, {
            start_index: startIndex
        });
        this.display(request);
    }

    display(request) {
        var self = this;
        self.setState({
            isLoading: true
        });
        ClientService.search(request).then(function (r) {
            var clientServices = r['_embedded'],
                navigation = r['_links']['navigation'];
            if (!(clientServices instanceof Array)) {
                clientServices = [clientServices];
            }
            if (!(navigation instanceof Array)) {
                navigation = [navigation];
            }

            self.setState({
                clientServices: clientServices,
                navigation: navigation,
                isLoading: false
            });
        }).catch(function () {
            self.setState({
                clientServices: [],
                navigation: [],
                isLoading: false
            });
        });
    }

    enableMove(b) {
      this.refs.widget.enableMove(b);
    }

    navigateToClientService(id) {
      this.props.history.push('/clientservices/' + id);
    }

    render() {
        const {t} = this.props;
        var title = t('lastClientServicesWidgetTitle'),
          content = [],
          navigations = [],
          self = this;
        if (this.state.isLoading) {
            return (
                <Widget title={title} onClose={this.props.onClose} ref="widget">
                    <i className='fa fa-spinner fa-spin'></i>
                </Widget>);
        }

        if (self.state.clientServices && self.state.clientServices.length > 0) {
          self.state.clientServices.forEach(function (clientService) {
            var image = "/images/default-client-service.png";
            var days = (<p>{t('noClientServicesMsg')}</p>);
            var isDetailsDisplayed = self.state.details[clientService.id] && self.state.details[clientService.id] !== null;
            content.push((
              <li key={clientService.id} className="list-group-item list-group-item-action no-padding row">
                <div className="summary">
                  <div className="first-column"><img src={image} className="img-thumbnail rounded picture image-small"/></div>
                  <div className="second-column">
                    <div>{clientService.name}</div>
                    {clientService.category && clientService.category !== null && <p>{t('belongsToTheCategoryTxt')} <b>{clientService.category.name}</b></p>}
                  </div>
                    <div className="last-column">
                      <Button outline color="secondary" size="sm"  onClick={(e) => { self.navigateToClientService(clientService.id);}}>
                        <i className="fa fa-sign-in localize"></i>
                      </Button>
                      <Button outline color="secondary" size="sm" onClick={(e) => { self.localize(e, clientService); }}>
                        <i className="fa fa-map-marker localize"></i>
                      </Button>
                      {clientService.price > 0 && (
                        <h5 className="price">{t('proposedPriceLabel')} {clientService.price}</h5>
                      )}
                    </div>
                  <div className="expander" onClick={(e) => { e.preventDefault(); self.showDetails(clientService.id, isDetailsDisplayed); }}>
                    {isDetailsDisplayed ? (<span>{t('closeDetailsTxt')}</span>) : (<span>{t('moreDetailsTxt')}</span>)}
                  </div>
                </div>
                {isDetailsDisplayed && (
                  <div className="details">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>{t('description')}</td>
                          <td>{clientService.description}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </li>));
          });
        }

        if (self.state.navigation && self.state.navigation.length > 1) {
          self.state.navigation.forEach(function (nav) {
              navigations.push((
                  <li key={nav.name} className="page-item"><a href="#" className="page-link" onClick={(e) => {
                      self.navigate(e, nav.name);
                  }}>{nav.name}</a></li>
              ));
          });
        }

        return (
            <Widget title={title} onClose={this.props.onClose} ref="widget">
                {navigations.length > 0 && (
                    <ul className="pagination">
                        {navigations}
                    </ul>
                )}
                {content.length == 0
                    ? (<span>{t('noClientService')}</span>) :
                    (<ul className="list-group list-group-flush">
                        {content}
                    </ul>)
                }
            </Widget>
        );
    }

    componentDidMount() {
        var self = this;
        this._waitForToken = AppDispatcher.register(function (payload) {
            switch (payload.actionName) {
                case Constants.events.ADD_CLIENT_SERVICE_ARRIVED:
                case Constants.events.REMOVE_CLIENT_SERVICE_ARRIVED:
                    var request = $.extend({}, self.request, {
                        start_index: 0
                    });
                    self.refresh(request);
                    break;
            }
        });
    }

    componentWillUnmount() {
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release, withRef: true })(ClientServices);
