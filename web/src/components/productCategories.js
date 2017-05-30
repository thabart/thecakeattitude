import React, { Component } from 'react';
import {Tooltip} from "reactstrap";
import TagsInput from "react-tagsinput";
import $ from 'jquery';

class ProductCategories extends Component {
  constructor(props) {
    super(props);
    this.handleTags = this.handleTags.bind(this);
    this.renderTag = this.renderTag.bind(this);
    this.state = {
      tags: props.categories || []
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
          id: null,
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
  render() {
    return (<TagsInput value={this.state.tags} onChange={this.handleTags}  inputProps={{placeholder: "Category"}} renderTag={this.renderTag} maxTags={5} />);
  }
}

export default ProductCategories;
