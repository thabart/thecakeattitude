import React, { Component } from 'react';
import TagsInput from 'react-tagsinput';
import { TagService } from '../services';
import 'react-tagsinput/react-tagsinput.css';
import $ from 'jquery';
import './tagsForm.css';

class TagsForm extends Component {
  constructor(props) {
    super(props);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.popup = null;
    this.state = {
      tags: []
    };
  }
  previous() {
    this.props.onPrevious();
  }
  next() {
    this.props.onNext();
  }
  handleChange(tags) {
    this.setState({
      tags: tags
    });
    this.hidePopup();
  }
  displayLoading() {
    var ul = $(this.popup).find('ul');
    $(ul).empty();
    $(ul).append('<li>Loading ...</li>');
    $(this.popup).show();
  }
  displayTags(tags) {
    var ul = $(this.popup).find('ul');
    var self = this;
    $(ul).empty();
    tags.forEach(function(tag) {
      $(self.popup).find('ul').append('<li>'+tag.name+'</li>');
    });
  }
  hidePopup() {
    var ul = $(this.popup).find('ul');
    $(ul).empty();
    $(this.popup).hide();
  }
  render() {
    return (
      <div>
        <section className="col-md-12 section">
          <p><i className="fa fa-exclamation-triangle"></i> Add some tags to enrich the description of your shop</p>
          <TagsInput ref="shopTags" value={this.state.tags} onChange={this.handleChange} />
        </section>
        <section className="col-md-12 sub-section section-description">
          <button className="btn btn-primary previous" onClick={this.previous}>Previous</button>
          <button className="btn btn-primary next" onClick={this.next}>Next</button>
        </section>
      </div>
    );
  }
  componentDidMount() {
    var self = this;
    var input = this.refs.shopTags.refs.input;
    var container = this.refs.shopTags.refs.div;
    var paddingLeft = 5,
      paddingTop = 5,
      newWidth = $(container).width() + 5;
    self.popup = $("<div class='popup' style='position: absolute; left:"+$(container).offset().left+"px; width:"+ newWidth +"px; display: none;'>"+
      "<ul></ul></div>");
    $(document.body).append(self.popup);
    $(input).on('input', function() {
      $(self.popup).css('top', $(container).offset().top + $(container).height());
      if (!this.value || this.value == "") {
        self.hidePopup();
        return;
      }

      self.displayLoading();
      TagService.search({ name: this.value }).then(function(r) {
        var embedded = r['_embedded'];
        if (!embedded) {
          self.hidePopup();
          return;
        }

        if (!(embedded instanceof Array)) {
          embedded = [embedded];
        }

        self.displayTags(embedded);
        self.popup.find('li').click(function() {
          var tags = self.state.tags;
          tags.push($(this).html());
          self.setState({
            tags: tags
          });
          self.hidePopup();
        });
      }).catch(function() {
        self.hidePopup();
      });
    });
  }
}

export default TagsForm;
