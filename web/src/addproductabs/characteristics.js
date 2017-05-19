import React, {Component} from "react";
import $ from 'jquery';
import TagsInput from "react-tagsinput";
import {Alert} from 'reactstrap';

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
    this.handleTags = this.handleTags.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.closeError = this.closeError.bind(this);
    this.state = {
      characteristicValue: null,
      characteristics: [{
        name: 'Colors',
        id: 'colors'
      }, {
        name: 'Size',
        id: 'size'
      }],
      tags: [],
      productFilters: [],
      errorMessage: null
    };
  }
  handleInputChange(e) {
      const target = e.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }
  previous() {
    this.props.previous();
  }
  confirm() {
    this.props.confirm();
  }
  addCharacteristic() {
    if (this._selectedCharacteristic === null) {
      return;
    }

    if (this.state.tags.length === 0) {
      this.setState({
        errorMessage: 'At least one tag should be inserted'
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
  selectCharacteristic(e) {
    this._selectedCharacteristic = {
      name: $(e.target).find(':selected').text(),
      id : e.target.value
    };
  }
  handleTags(tags) {
    this.setState({
      tags: tags
    });
  }
  removeFilter(filter) {
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
  closeError() {
    this.setState({
      errorMessage: null
    });
  }
  render() {
    var characteristics = [],
      productFilters = [],
      self = this;
    if (this.state.characteristics && this.state.characteristics.length > 0) {
      this.state.characteristics.forEach(function(characteristic) {
        characteristics.push((<option value={characteristic.id}>{characteristic.name}</option>));
      });
    }

    if (this.state.productFilters && this.state.productFilters.length > 0) {
      this.state.productFilters.forEach(function(productFilter) {
        productFilters.push((<li className="list-group-item justify-content-between">
          {productFilter.name} : {productFilter.filters.join(',')}
          <i className="fa fa-times" onClick={(e) => { self.removeFilter(productFilter); }}></i>
        </li>))
      });
    }

    return (<div>
        <section className="section">
          <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.closeError}>{this.state.errorMessage}</Alert>
          {characteristics.length > 0 && (
            <form className="row" onSubmit={(e) => { e.preventDefault(); this.addCharacteristic(); }}>
              <div className="col-md-4">
                  <select className="form-control" onChange={this.selectCharacteristic}>
                    {characteristics}
                  </select>
              </div>
              <div className="col-md-4">
                <TagsInput ref="shopTags" value={this.state.tags} onChange={this.handleTags}/>
              </div>
              <div className="col-md-4">
                <input type="submit" className="btn btn-success" />
              </div>
            </form>
          )}
          <ul className="list-group">
            {productFilters}
          </ul>
        </section>
        <section className="col-md-12 sub-section">
            <button className="btn btn-primary previous" onClick={this.previous}>Previous</button>
            <button className="btn btn-success next" onClick={this.confirm}>Confirm</button>
        </section>
      </div>);
  }
}

export default CharacteristicsTab;
