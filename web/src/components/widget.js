import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './widget.css';
import $ from 'jquery';
window.jQuery = $;

class Widget extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isToggled: true
    };
  }
  toggle() {
    this.setState(prev => ({
        isToggled : !prev.isToggled
    }));
    $(this.body).toggle('collapse');
  }
  render() {
    return (
      <div className="card">
        <div className="card-header d-flex justify-content-between bd-highlight mb-3 widget-header">
          <div className="p-2">
            {this.props.title}
          </div>
          <div className="p-2">
            <i className={this.state.isToggled ? "fa fa-arrow-up" : "fa fa-arrow-down"} aria-hidden="true" onClick={this.toggle}></i>
            <i className="fa fa-search" aria-hidden="true"></i>
            <i className="fa fa-arrows-alt" aria-hidden="true"></i>
            <i className="fa fa-times" aria-hidden="true"></i>
          </div>
        </div>
        <div className="collapse show" ref={(elt) => {this.body = elt; }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Widget;
