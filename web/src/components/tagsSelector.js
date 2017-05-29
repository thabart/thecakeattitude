import React, {Component} from "react";
import TagsInput from "react-tagsinput";
import {TagService} from '../services/index';
import $ from 'jquery';

class TagsSelector extends Component {
  constructor(props) {
    super(props);
    this.popup = null;
    this._isInitialized = false;
    this.handleTags = this.handleTags.bind(this);
    this.displayTags = this.displayTags.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.state = {
      tags: this.props.tags ? this.props.tags : []
    };
  }
  handleTags(tags, changed, changedIndexes) {
      if (changedIndexes[0] === this.state.tags.length ) {
        var changedValue = changed[0].toLowerCase();
        var selectedValue = this.state.tags.filter(function(tag) {
          return tag.toLowerCase().indexOf(changedValue) !== -1;
        });

        if (selectedValue.length > 0) {
          return;
        }
      }

      this.setState({
          tags: tags
      });
      console.log('coucou');
      this.hidePopup();
  }
  hidePopup() {
      var ul = $(this.popup).find('ul');
      $(ul).empty();
      $(this.popup).hide();
  }
  displayTags(tags) {
    $(this.popup).show();
    var ul = $(this.popup).find('ul');
    var self = this;
    $(ul).empty();
    tags.forEach(function (tag) {
      $(self.popup).find('ul').append('<li>' + tag.name + '</li>');
    });
  }
  getTags() {
    return this.state.tags;
  }
  initialize(elt) {
      if (this._isInitialized) return;
      var self = this,
        input = elt.refs.input,
        container = elt.refs.div,
        paddingLeft = 5,
        paddingTop = 5;
      self.popup = $("<div class='popup' style='position: absolute;display: none;'><ul></ul></div>");
      var updatePopup = function(value) {
        $(self.popup).width($(container).width() + 5);
        $(self.popup).css('left', $(container).offset().left);
        $(self.popup).css('top', $(container).offset().top + $(container).height());
        TagService.search({name: value}).then(function(r) {
          var embedded = r['_embedded'];
          if (!embedded) {
            self.hidePopup();
            return;
          }

          if (!(embedded instanceof Array)) {
            embedded = [embedded];
          }

          self.displayTags(embedded);
          self.popup.find('li').click(function () {
            var tags = self.state.tags.slice(0);
            var tag = $(this).html();
            tags.push(tag);
            self.handleTags(tags, [tag], [self.state.tags.length]);
            self.hidePopup();
          });
        }).catch(function() {
          self.hidePopup();
        });
      };

      $(document.body).append(self.popup);
      $(input).on('focus', function() {
        // updatePopup();
      });
      $(input).on('input', function () {
        updatePopup(this.value);
      });
      self._isInitialized = true;
  }
  render() {
    return (<TagsInput ref={(elt) => {
      this.initialize(elt);
    }} value={this.state.tags} onChange={this.handleTags}/>);
  }
}

export default TagsSelector;
