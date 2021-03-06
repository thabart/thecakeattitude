import React, {Component} from "react";
import { translate } from 'react-i18next';
import { FormGroup, Input, Label, FormFeedback, Alert } from 'reactstrap';
import { PrintOrderLabelStore, ApplicationStore } from '../stores/index';
import { ParcelSize } from '../components/index';
import { UpsService } from '../services/index';
import AppDispatcher from '../appDispatcher';
import Constants from '../../Constants';

class PackagingType extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.reset = this.reset.bind(this);
    this.next = this.next.bind(this);
    this.refresh = this.refresh.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.state = {
      isLoading: false,
      weight: 2, // < 70
      length: Constants.maxPackageSize.length, // < 270
      width: Constants.maxPackageSize.width, // < 270
      height: Constants.maxPackageSize.height,// < 270
      valid: {
        isWeightInvalid: false,
        isLengthInvalid: false,
        isWidthInvalid: false,
        isHeightInvalid: false
      },
      estimatedPrice: 0,
      isUpdatePriceEnabled: false,
      warningMessages: []
    };
  }

  handleInputChange(e) { // Handle the input change.
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      var prevVal = this.state[name];
      if (prevVal === value)
      {
        return;
      }

      this.setState({
          [name]: value,
          isUpdatePriceEnabled: true
      });
  }

  updatePrice() { // Update the price.
    var self = this;
    const {t} = this.props;
    var order = PrintOrderLabelStore.getOrder();
    var size = this.refs.parcelSize.getWrappedInstance().getSize();
    self.setState({
      isLoading: true
    });
    var request = {
      alternate_delivery_address: {
        name: order.package.parcel_shop.name,
        address: order.package.parcel_shop.address
      },
      ship_from: {
        name: order.package.buyer.name,
        address: order.package.buyer.address
      },
      shipper: {
        name: order.package.buyer.name,
        address: order.package.buyer.address
      },
      ship_to: {
        name: order.package.seller.name,
        address: order.package.seller.address
      },
      package: size,
      ups_service: order.package.ups_service
    };

    UpsService.searchRatings(request).then(function(res) {
      order.package.parcel = request.package;
      order.package.estimated_price = res['total_price'];
      // TODO: Display the warning messages.
      AppDispatcher.dispatch({
        actionName: Constants.events.UPDATE_ORDER_LABEL_ACT,
        data: order
      });
      self.setState({
        isLoading: false,
        estimatedPrice: res['total_price'],
        warningMessages: res['messages'],
        isUpdatePriceEnabled: false,
      });
    }).catch(function() {
      ApplicationStore.sendMessage({
        message: t('calculateOrderLabelPriceError'),
        level: 'error',
        position: 'tr'
      });
      self.setState({
        isLoading: false,
        estimatedPrice: 0,
        warningMessages: [ ]
      });
    });
  }

  reset() { // Reset the price.
    var order = PrintOrderLabelStore.getOrder();
    this.setState({
      isUpdatePriceEnabled: false
    });
    this.refs.parcelSize.getWrappedInstance().setSize({
      width: order.package.parcel.width,
      length: order.package.parcel.length,
      height: order.package.parcel.height
    });
  }

  next() { // Execute when the user clicks on next.
    if (!this.refs.parcelSize.getWrappedInstance().check()) {
      return;
    }

    if (this.props.onNext) {
      this.props.onNext();
    }
  }

  refresh() { // Refresh the estimated price.
    var order = PrintOrderLabelStore.getOrder();
    this.setState({
      estimatedPrice: order.package.estimated_price
    });
  }

  valueChange() { // Execute when a value change.
    this.setState({
      isUpdatePriceEnabled: true
    });
  }

  render() { // Display the component.
    const {t} = this.props;
    var warningMessages = [];
    if (this.state.warningMessages && this.state.warningMessages.length > 0) {
      this.state.warningMessages.forEach(function(warningMessage) {
        warningMessages.push((<li>{warningMessage}</li>));
      });
    }

    return (<div>
      { this.state.isLoading && (<i className='fa fa-spinner fa-spin'></i>) }
      <div className={this.state.isLoading && "hidden"}>
        { warningMessages.length > 0 && (
          <Alert color="warning" style={{margin: "10px"}}>
            <ul>{warningMessages}</ul>
          </Alert>
        ) }
        <div style={{padding: "10px"}}>
          <p>{t('packagingTypeDescription')}</p>
          <ParcelSize ref="parcelSize" isEditable={true} onValueChange={this.valueChange} />
        </div>
        <div>
          <h5>{t('estimatedPrice').replace('{0}', this.state.estimatedPrice)}</h5>
        </div>
        <div>
          <button className="btn btn-default" onClick={this.updatePrice} disabled={!this.state.isUpdatePriceEnabled ? 'disabled' : ''}>{t('updatePrice')}</button>
          <button className="btn btn-default" onClick={this.reset}  style={{marginLeft:"5px"}} disabled={!this.state.isUpdatePriceEnabled ? 'disabled' : ''}>{t('reset')}</button>
          <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={this.next} disabled={this.state.isUpdatePriceEnabled && 'disabled'}>{t('next')}</button>
        </div>
      </div>
    </div>)
  }

  componentDidMount() { // Execute before the render.
    PrintOrderLabelStore.addLoadListener(this.refresh);
  }

  componentWillUnmount() { // Remove listener.
    PrintOrderLabelStore.removeLoadListener(this.refresh);
  }
}

export default translate('common', { wait: process && !process.release })(PackagingType);
