import React, { Component } from 'react';
import {Tooltip} from "reactstrap";
import TagsInput from "react-tagsinput";
import $ from 'jquery';
import ShelfChooser from '../game/shelfChooser';
import {Guid} from '../utils';
import { translate } from 'react-i18next';

class ProductCategories extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.selectPlace = this.selectPlace.bind(this);
    this.setCurrentShelf = this.setCurrentShelf.bind(this);
    this.state = {
      isLoading: true,
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
        shop_section_name: shelf.name,
        name: shelf.category_name,
        description: shelf.category_name
      };
    });
  }

  selectPlace(shelfId) { // When an element is selected in the list then select the place in the map.
    var self = this;
    self.refs.shelfChooser.setCurrentShelf(shelfId);
    self.setCurrentShelf(shelfId);
  }

  setCurrentShelf(shelfId) { // Set the current shelf.
    var self = this;
    self.state.shelves.forEach(function(s) {
      if (s.id === shelfId) {
        s.isSelected = true;
        return;
      }

      s.isSelected = false;
    });

    self.setState({
      shelves: self.state.shelves
    });
  }

  render() { // Display the view.
    var self = this, {t} = this.props, shelves = [(<li className="list-group-item">
      <div className="col-md-4"><b>{t('shelf')}</b></div>
      <div className="col-md-8"><b>{t('productCategoryName')}</b></div>
    </li>)];
    if (self.state.shelves) {
      self.state.shelves.forEach(function(shelf) {
        shelves.push((<li className={shelf.isSelected ? "list-group-item active" : "list-group-item"} data-id={shelf.id} onClick={() => { self.selectPlace(shelf.id); }}>
          <div className="col-md-4">{shelf.name}</div>
          <div className="col-md-8"><input type="text" className="form-control" placeholder={t('enterProductCategoryNamePlaceHolder')} value={shelf.category_name} onChange={(e) => { self.handleInputChange(e, shelf.id); }} /></div>
        </li>));
      });
    }
    return (<div className="row">
      <div className="col-md-6">
        { self.state.isLoading ? (<i className='fa fa-spinner fa-spin'/>) : (
          <ul className="list-group-default clickable">
            {shelves}
          </ul>
        )}
      </div>
      <div className="col-md-6">
        <ShelfChooser ref="shelfChooser" />
      </div>
    </div>);
  }

  componentDidMount() { // Execute after the view is rendered.
    var self = this;
    self.setState({
      isLoading: true
    });
    self.refs.shelfChooser.display(
      {
        loadedCallback: function(shelves) {
          shelves.forEach(function(shelf) {
            var value = '';
            var filteredProductCategories = self.props.productCategories.filter(function(cat) { return cat.shop_section_name === shelf.name; });
            if (filteredProductCategories.length === 1) {
              value = filteredProductCategories[0].name;
            }

            shelf.isSelected = false;
            shelf.category_name = value;
          });
          self.setState({
            shelves: shelves,
            isLoading: false
          });
        },
        onShelfClick: function(shelfId) {
          self.setCurrentShelf(shelfId);
        }
      }
    );
  }
}

export default translate('common', { wait: process && !process.release, withRef: true })(ProductCategories);
