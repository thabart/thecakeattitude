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
    this.handleTags = this.handleTags.bind(this);
    this.renderTag = this.renderTag.bind(this);
    this.state = {
      tags: props.categories || [],
      shelves: []
    };
  }

  handleTags(tags, changed, changedIndexes) {
    if (this.isTagsExist(tags, changed, changedIndexes, this.state.tags)) {
      return;
    }

    var arr = [];
    tags.forEach(function(t) {
      if (typeof t === 'string') {
        arr.push({
          id: Guid.generate(),
          name: t
        });
      } else {
        arr.push(t);
      }
    });

    this.setState({
      tags: arr
    });
  }

  isTagsExist(tags, changed, changedIndexes, innerTags) {
    if (changedIndexes[0] === innerTags.length ) {
      var changedValue = changed[0].toLowerCase();
      var selectedValue = innerTags.filter(function(tag) {
        return tag.name.toLowerCase() === changedValue;
      });

      if (selectedValue.length > 0) {
        return true;
      }
    }

    return false;
  }

  getCategories() {
    return this.state.tags;
  }

  renderTag(props) {
    let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props;
    return (<span key={key} {...other}>
      {tag.name}
      {!disabled &&
        <a className={classNameRemove} onClick={(e) => onRemove(key)} />
      }
    </span>);
  }

  render() { // Display the view.
    var self = this, shelves = [], {t} = this.props;
    if (self.state.shelves) {
      self.state.shelves.forEach(function(shelf) {
        shelves.push((<li className="list-group-item" data-id={shelf.id}>
          <div className="col-md-4">{shelf.name}</div>
          <div className="col-md-8"><input type="text" className="form-control" placeholder={t('enterProductCategoryNamePlaceHolder')} /></div>
        </li>));
      });
    }
    return (<div className="row">
      <div className="col-md-6">
        <ul className="list-group-default clickable">
          {shelves}
        </ul>
      </div>
      {/* <TagsInput value={this.state.tags} onChange={this.handleTags}  inputProps={{placeholder: "Category"}} renderTag={this.renderTag} maxTags={5} /> */}
      <div className="col-md-6">
        <ShelfChooser ref="shelfChooser" />
      </div>
    </div>);
  }

  componentDidMount() { // Execute after the view is rendered.
    var self = this;
    self.refs.shelfChooser.display({loadedCallback: function(shelves) {
      self.setState({
        shelves: shelves
      });
    }})
  }
}

export default translate('common', { wait: process && !process.release })(ProductCategories);
