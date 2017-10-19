import React, {Component} from "react";
import TagsInput from "react-tagsinput";
import { TagService } from '../services/index';
import $ from 'jquery';

class TagsSelector extends Component {
    constructor(props) {
        super(props);
        this._isInitialized = false;
        this.popup = null;
        this.container = null;
        this.input = null;
        this.handleTags = this.handleTags.bind(this);
        this.displayTags = this.displayTags.bind(this);
        this.hidePopup = this.hidePopup.bind(this);
        this.updatePopupPosition = this.updatePopupPosition.bind(this);
        this.updatePopupContent = this.updatePopupContent.bind(this);
        this.state = {
            tags: this.props.tags ? this.props.tags : []
        };
    }

    handleTags(tags, changed, changedIndexes) { // This method is called when the tag values have changed.
      if (changedIndexes[0] === this.state.tags.length) {
        var changedValue = changed[0].toLowerCase();
        var selectedValue = this.state.tags.filter(function (tag) {
          return tag.toLowerCase().indexOf(changedValue) !== -1;
        });

        if (selectedValue.length > 0) {
          return;
        }
      }

      this.setState({
        tags: tags
      });
      this.hidePopup();
    }

    hidePopup() { // Hide the popup.
      var ul = $(this.popup).find('ul');
      $(ul).empty();
      $(this.popup).hide();
    }

    displayTags(tags) { // Display the tags in the popup.
      $(this.popup).show();
      var ul = $(this.popup).find('ul');
      var self = this;
      $(ul).empty();
      tags.forEach(function (tag) {
        $(self.popup).find('ul').append('<li>' + tag.name + '</li>');
      });
    }

    getTags() { // Get all the selected tags.
      return this.state.tags;
    }

    updatePopupPosition() { // Update the popup position.
      var self = this,
        parent = $(self.container).parent();
      $(self.popup).width($(self.container).width() + 5);
      $(self.popup).css('left', $(self.container).offset().left);
      $(self.popup).css('top', $(parent).offset().top + $(parent).height());
    }

    updatePopupContent(value) { // Update the popup content.
      var self = this;
      TagService.search({name: value}).then(function (r) {
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
      }).catch(function () {
        self.hidePopup();
      });
    }

    initialize(elt) {
        if (this._isInitialized) return;
        var self = this;
        self.popup = $("<div class='react-tagsinput-popup' style='position: absolute;display: none;'><ul></ul></div>");
        self.input = elt.input || elt.refs.input;
        self.container = elt.div || elt.refs.div;
        $(document.body).append(self.popup);
        $(window).resize(self.updatePopupPosition);
        $(self.input).on('input', function() {
          self.updatePopupPosition();
          self.updatePopupContent(this.value);
        });
        self._isInitialized = true;
    }

    render() { // Display the view.
      return (<TagsInput ref={(elt) => { this.initialize(elt); }} value={this.state.tags} onChange={this.handleTags}/>);
    }

    componentWillUnmount() { // Remove the registration.
      $(window).off('resize', this.updatePopupPosition);
    }
}

export default TagsSelector;
