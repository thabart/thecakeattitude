import React, {Component} from "react";
import { translate } from 'react-i18next';
import { FormGroup, Input, Label, FormFeedback } from 'reactstrap';

class ParcelSize extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.check = this.check.bind(this);
        this.getSize = this.getSize.bind(this);
        this.buildErrorTooltip = this.buildErrorTooltip.bind(this);
        this.state = {
          isEditable: props.isEditable || false,
          weight: props.weight || 2,
          length: props.length || 50,
          width: props.width || 80,
          height: props.height || 35,
          valid: {
            isWeightInvalid: false,
            isLengthInvalid: false,
            isWidthInvalid: false,
            isHeightInvalid: false
          }
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
            [name]: value
        });

        if (this.props.onValueChange) {
          this.props.onValueChange();
        }
    }

    check() { // Check the inputs.
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

      return isValid;
    }

    getSize() { // Returns the size of the parcel.
      return {
        weight: this.state.weight,
        length: this.state.length,
        width: this.state.width,
        height: this.state.height
      };
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

    render() { // Return the view.
        const {t} = this.props;
        if (!this.state.isEditable) {
          return (
            <div style={{position: "relative", display: "inline-block", width: "280px", height: "200px", textAlign: 'center'}}>
              <img src="/images/shipping-box.svg" width="170" height="171" />
              <span style={{position: "absolute", top: "0px", right: "20px"}}>{this.state.length} cm</span>
              <span style={{position: "absolute", top: "70px", right: "0px"}}>{this.state.height} cm</span>
              <span style={{position: "absolute", bottom: "0px", left: "120px"}}>{this.state.width} cm</span>
            </div>
          );
        }

        var self = this;
        var weightError = this.buildErrorTooltip('isWeightInvalid', t('valueShouldBeInRange').replace('{0}', '1').replace('{1}', '70')),
          lengthError = this.buildErrorTooltip('isLengthInvalid', t('valueShouldBeInRange').replace('{0}', '1').replace('{1}', '270')),
          widthError = this.buildErrorTooltip('isWidthInvalid', t('valueShouldBeInRange').replace('{0}', '1').replace('{1}', '270')),
          heightError = this.buildErrorTooltip('isHeightInvalid', t('valueShouldBeInRange').replace('{0}', '1').replace('{1}', '270'));
        const feedbackWeight = weightError ? "danger" : undefined;
        const feedbackLength = lengthError ? "danger": undefined;
        const feedbackWidth = widthError ? "danger": undefined;
        const feedbackHeight = heightError ? "danger" : undefined;
        return (<div className="row">
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
          <div className="col-md-6" style={{textAlign: 'center'}}>
            <div style={{position: "relative", display: "inline-block", width: "280px", height: "200px"}}>
              <img src="/images/shipping-box.svg" width="170" height="171" />
              <span style={{position: "absolute", top: "0px", right: "20px"}}>{this.state.length} cm</span>
              <span style={{position: "absolute", top: "70px", right: "0px"}}>{this.state.height} cm</span>
              <span style={{position: "absolute", bottom: "0px", left: "120px"}}>{this.state.width} cm</span>
            </div>
          </div>
        </div>);
    }
}

export default translate('common', { wait: process && !process.release, withRef: true })(ParcelSize);
