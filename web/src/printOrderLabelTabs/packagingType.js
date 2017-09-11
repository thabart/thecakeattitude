import React, {Component} from "react";
import { translate } from 'react-i18next';
import { FormGroup, Input, Label, FormFeedback } from 'reactstrap';
import { PrintOrderLabelStore, ApplicationStore } from '../stores/index';
import { UpsService } from '../services/index';
import AppDispatcher from '../appDispatcher';
import Constants from '../../Constants';

class PackagingType extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.buildErrorTooltip = this.buildErrorTooltip.bind(this);
    this.next = this.next.bind(this);
    this.refresh = this.refresh.bind(this);
    this.state = {
      isLoading: false,
      weight: 2, // < 70
      length: 50, // < 270
      width: 80, // < 270
      height: 35,// < 270
      valid: {
        isWeightInvalid: false,
        isLengthInvalid: false,
        isWidthInvalid: false,
        isHeightInvalid: false
      },
      estimatedPrice: 0,
      isUpdatePriceEnabled: false
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
      package: {
        height: self.state.height,
        length: self.state.length,
        weight: self.state.weight,
        width: self.state.width
      }
    };

    UpsService.searchRatings(request).then(function(res) {
      order.package.parcel = request.package;
      AppDispatcher.dispatch({
        actionName: Constants.events.UPDATE_ORDER_LABEL_ACT,
        data: order
      });
      self.setState({
        isLoading: false,
        estimatedPrice: res['total_price'],
        isUpdatePriceEnabled: false
      });
    }).catch(function() {
      ApplicationStore.sendMessage({
        message: t('calculateOrderLabelPriceError'),
        level: 'error',
        position: 'tr'
      });
      self.setState({
        isLoading: false,
        estimatedPrice: 0
      });
    });
  }

  buildErrorTooltip(validName, description) { // Build the error tooltip.
    var result;
    if (this.state.valid[validName]) {
        result = (
          <span>
            {description}
          </span> );
    }

    return result;
  }

  next() { // Execute when the user clicks on next.
    var self = this,
      valid = self.state.valid,
      isValid = true;

    // Check the weight.
    if (!self.state.weight || self.state.weight <= 0 || self.state.weight > 70) {
      valid.isWeightInvalid = true;
      isValid = false;
    } else {
      valid.isWeightInvalid = false;
    }

    // Check the length.
    if (!self.state.length || self.state.length <= 0 || self.state.length > 270) {
      valid.isLengthInvalid = true;
      isValid = false;
    } else {
      valid.isLengthInvalid = false;
    }

    // Check the width.
    if (!self.state.width || self.state.width <= 0 || self.state.length > 270) {
      valid.isWidthInvalid = true;
      isValid = false;
    } else {
      valid.isWidthInvalid = false;
    }

    // Check the height.
    if (!self.state.height || self.state.height <= 0 || self.state.height > 270) {
      valid.isHeightInvalid = true;
      isValid = false;
    } else {
      valid.isHeightInvalid = false;
    }

    self.setState({
      valid: valid
    });

    if (!isValid) {
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

  render() { // Display the component.
    if (this.state.isLoading) {
      return (<i className='fa fa-spinner fa-spin'></i>);
    }

    const {t} = this.props;
    var self = this;
    var weightError = this.buildErrorTooltip('isWeightInvalid', t('valueShouldBeInRange').replace('{0}', '1').replace('{1}', '70')),
      lengthError = this.buildErrorTooltip('isLengthInvalid', t('valueShouldBeInRange').replace('{0}', '1').replace('{1}', '270')),
      widthError = this.buildErrorTooltip('isWidthInvalid', t('valueShouldBeInRange').replace('{0}', '1').replace('{1}', '270')),
      heightError = this.buildErrorTooltip('isHeightInvalid', t('valueShouldBeInRange').replace('{0}', '1').replace('{1}', '270'));
    const feedbackWeight = weightError ? "danger" : undefined;
    const feedbackLength = lengthError ? "danger": undefined;
    const feedbackWidth = widthError ? "danger": undefined;
    const feedbackHeight = heightError ? "danger" : undefined;
    return (<div>
      <div className="row" style={{padding: "10px"}}>
        <div className="col-md-6">
          <FormGroup color={feedbackWeight}>
            <Label>{t('packagingTypeWeight')}</Label>
            <Input type="number" state={feedbackWeight} className="form-control" min="1" max="70" name='weight' value={this.state.weight} onChange={self.handleInputChange} />
            <FormFeedback>{weightError}</FormFeedback>
          </FormGroup>
          <FormGroup color={feedbackLength}>
            <Label>{t('packagingTypeLength')}</Label>
            <Input type="number" state={feedbackLength} className="form-control" min="1" max="270" name='length' value={this.state.length} onChange={self.handleInputChange} />
            <FormFeedback>{lengthError}</FormFeedback>
          </FormGroup>
          <FormGroup color={feedbackWidth}>
            <Label>{t('packagingTypeWidth')}</Label>
            <Input type="number" state={feedbackWidth} className="form-control" min="1" max="270" name='width' value={this.state.width} onChange={self.handleInputChange} />
            <FormFeedback>{widthError}</FormFeedback>
          </FormGroup>
          <FormGroup color={feedbackHeight}>
            <Label>{t('packagingTypeHeight')}</Label>
            <Input type="number" state={feedbackHeight} className="form-control" min="1" max="270" name='height'value={this.state.height} onChange={self.handleInputChange} />
            <FormFeedback>{heightError}</FormFeedback>
          </FormGroup>
        </div>
        <div className="col-md-6" style={{textAlign: "center"}}>
          <div style={{position: "relative", display: "inline-block", width: "280px", height: "200px"}}>
            <img src="/images/shipping-box.svg" width="170" height="171" />
            <span style={{position: "absolute", top: "0px", right: "20px"}}>{this.state.length} cm</span>
            <span style={{position: "absolute", top: "70px", right: "0px"}}>{this.state.height} cm</span>
            <span style={{position: "absolute", bottom: "0px", left: "120px"}}>{this.state.width} cm</span>
          </div>
        </div>
      </div>
      <div>
        <h5>{t('estimatedPrice').replace('{0}', this.state.estimatedPrice)}</h5>
      </div>
      <div>
        <button className="btn btn-default" onClick={this.updatePrice} disabled={!this.state.isUpdatePriceEnabled ? 'disabled' : ''}>{t('updatePrice')}</button>
        <button className="btn btn-default" style={{marginLeft: "5px"}} onClick={this.next}>{t('next')}</button>
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
