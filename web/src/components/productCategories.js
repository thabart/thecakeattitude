import React, { Component } from 'react';
import { Tooltip } from "reactstrap";
import { Guid } from '../utils';
import { translate } from 'react-i18next';
import TagsInput from "react-tagsinput";
import $ from 'jquery';

class ProductCategories extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      isLoading: false,
      shelves: []
    };
  }

  handleInputChange(e, shelfId) { // Handle the input change.
    var self = this;
    const target = e.target;
    const value = target.value;
    var shelf = self.state.shelves.filter(function(shelf) { return shelf.id === shelfId; });
    if (!shelf || shelf.length === 0) {
      return;
    }

    shelf[0].category_name = value;
    this.setState({
      shelves: self.state.shelves
    });

    if (self.props.onChange) {
      self.props.onChange(self.getCategories());
    }
  }

  getCategories() { // Returns the categories.
    return this.state.shelves.filter(function(shelf) { return shelf.category_name && shelf.category_name !== null; }).map(function(shelf) {
      return {
        name: shelf.category_name,
        description: shelf.category_name,
        id: shelf.id
      };
    });
  }

  render() { // Display the view.
    var self = this, 
        {t} = this.props,
        shelves = [(<li className="list-group-item"><div className="col-md-4"><b>{t('shelf')}</b></div><div className="col-md-8"><b>{t('productCategoryName')}</b></div></li>)];

    if (self.state.shelves) {
      self.state.shelves.forEach(function(shelf) {
        shelves.push((<li className={shelf.isSelected ? "list-group-item active" : "list-group-item"} data-id={shelf.id}>
          <div className="col-md-4">{shelf.name}</div>
          <div className="col-md-8"><input type="text" className="form-control" placeholder={t('enterProductCategoryNamePlaceHolder')} value={shelf.category_name} onChange={(e) => { self.handleInputChange(e, shelf.id); }} /></div>
        </li>));
      });
    }

    return (<div>
      { self.state.isLoading ? (<i className='fa fa-spinner fa-spin'/>) : (
        <ul className="list-group-default clickable">
          {shelves}
        </ul>
      )}
    </div>);
  }

  componentDidMount() { // Execute after the view is rendered.
    var self = this;
    var shelves = [];
    var indice = 1;
    if (self.props.productCategories) {
      shelves = self.props.productCategories.map(function(pc) {
          var result = { name: "#"+indice, id: pc.id, category_name: pc.name, isSelected : false };
          indice++;
          return result;
      });
    }

    for(var i = indice; i <= 8; i++) {
      shelves.push({ name: "#"+i, category_name: "", isSelected : false, id: Guid.generate() });
    }

    self.setState({
      shelves: shelves
    });
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(ProductCategories);
