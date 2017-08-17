import React, { Component } from "react";
import { Alert } from 'reactstrap';
import { withRouter } from "react-router";
import { FilterSelector } from '../components';
import { translate } from 'react-i18next';
import TagsInput from "react-tagsinput";
import $ from 'jquery';

class CharacteristicsTab extends Component {
  constructor(props) {
    super(props);
    this._selectedCharacteristic = {
      name: 'Colors',
      id: 'colors'
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.previous = this.previous.bind(this);
    this.confirm = this.confirm.bind(this);
    this.addCharacteristic = this.addCharacteristic.bind(this);
    this.selectCharacteristic = this.selectCharacteristic.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.closeError = this.closeError.bind(this);
    this.state = {
      errorMessage: null
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

  previous() { // Execute when the user clicks on previous.
    this.props.previous();
  }

  confirm() { // Confirm the creation.
    var filters = this.refs.filterSelector.getWrappedInstance().getFilters();
    this.props.confirm(filters);
  }

  addCharacteristic() { // Add a characteristic.
    if (this._selectedCharacteristic === null) {
      return;
    }

    const {t} = this.props;
    if (this.state.tags.length === 0) {
      this.setState({
        errorMessage: t('oneCharacteristicValueInsertedError')
      });
      return;
    }

    var characteristics = this.state.characteristics,
      productFilters = this.state.productFilters,
      characteristicToRemoveIndex = -1,
      self = this;
    characteristics.forEach(function(characteristic, index) {
      if (characteristic.id === self._selectedCharacteristic.id) {
        characteristicToRemoveIndex = index;
      }
    });

    if (characteristicToRemoveIndex === -1) {
      return;
    }

    characteristics.splice(characteristicToRemoveIndex, 1);
    var productFilter = self._selectedCharacteristic;
    productFilter['filters'] = this.state.tags;
    productFilters.push(productFilter);
    this.setState({
      characteristics: characteristics,
      productFilters: productFilters,
      tags: []
    });
    self._selectedCharacteristic = characteristics[0];
  }

  selectCharacteristic(e) { // Select a characteristic.
    this._selectedCharacteristic = {
      name: $(e.target).find(':selected').text(),
      id : e.target.value
    };
  }

  removeFilter(filter) { // Remove filter.
    var productFilters = this.state.productFilters,
      characteristics = this.state.characteristics;
    var index = productFilters.indexOf(filter);
    if (index === -1) {
      return;
    }

    characteristics.push({
      id: filter.id,
      name: filter.name
    });
    productFilters.splice(filter, 1);
    this.setState({
      productFilters: productFilters,
      characteristics: characteristics
    });
  }

  closeError() { // Close error message.
    this.setState({
      errorMessage: null
    });
  }

  render() { // Display view.
    var self = this;
    var shopId = this.props.match.params.id;
    const {t} = this.props;
    return (<div className="container rounded">
        <section>
          <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert>
          <div className='form-group'><p dangerouslySetInnerHTML ={{__html: t('productCharacteristicDescription')}}></p></div>
          <FilterSelector ref="filterSelector" shopId={shopId} />
        </section>
        <section className="row p-1">
            <button className="btn btn-default" onClick={this.previous}>{t('previous')}</button>
            <button className="btn btn-default" onClick={this.confirm} style={{marginLeft: "5px"}}>{t('confirm')}</button>
        </section>
      </div>);
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(CharacteristicsTab));
