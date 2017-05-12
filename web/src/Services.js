import React, { Component } from 'react';
import Rater from 'react-rater';
import Magnify from 'react-magnify';
import { CommentTab, DescriptionTab } from './servicetabs';
import { ShopServices } from './services';
import { TabContent, TabPane, Nav, NavItem, NavLink, Alert } from 'reactstrap';
import { withRouter } from 'react-router';
import Constants from '../Constants';
import $ from 'jquery';
import classnames from 'classnames';

class Services extends Component {
  constructor(props) {
    super(props);
    this.toggleError = this.toggleError.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.navigateGeneral = this.navigateGeneral.bind(this);
    this.navigateComments = this.navigateComments.bind(this);
    this.state = {
      loading: false,
      errorMessage: null,
      currentImageIndice: 0
    };
  }
  changeImage(e) {
    e.preventDefault();
    var indice = $(e.target).data('id');
    this.setState({
      currentImageIndice: indice
    });
  }
  toggleError() {
    this.setState({
      errorMessage: null
    });
  }
  refresh() {
    var self = this;
    self.setState({
      isLoading: true
    });
    ShopServices.get(this.props.match.params.id).then(function(r) {
      self.setState({
        isLoading: false,
        service: r['_embedded']
      });
    }).catch(function(e) {
      console.log(e);
      self.setState({
        errorMessage: 'An error occured while trying to retrieve the service',
        isLoading: false
      });
    });
  }
  navigateGeneral(e) {
    this.props.history.push('/services/' + this.state.service.id);
  }
  navigateComments(e) {
    this.props.history.push('/services/' + this.state.service.id + '/comments');
  }
  render() {
    if (this.state.isLoading) {
      return (<div className="container">Loading ...</div>);
    }

    if (this.state.errorMessage !== null) {
      return (<div className="container"><Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={this.toggleError}>{this.state.errorMessage}</Alert></div>);
    }

    var action = this.props.match.params.action,
      self = this,
      tags = [],
      images = [],
      content = null,
      currentImageSrc = "/images/default-service.jpg";
    if (action === 'comments') {
        content = (<CommentTab service={self.state.service} />);
    } else {
      content = (<DescriptionTab service={self.state.service} />);
      action = 'general';
    }

    if (self.state.service.tags && self.state.service.tags.length > 0) {
      self.state.service.tags.forEach(function(tag) {
        tags.push((<li key={tag}>{tag}</li>));
      });
    }

    if (self.state.service.images && self.state.service.images.length > 0) {
      var i = 0;
      self.state.service.images.forEach(function(image) {
        var img = Constants.apiUrl + image;
        if (i === self.state.currentImageIndice) {
          currentImageSrc = img;
        }

        images.push((<li key={i}><a href="#" className={i === self.state.currentImageIndice && "active"} data-id={i} onClick={(e) => {self.changeImage(e)}}><img src={img} data-id={i} /></a></li>));
        i++;
      });
    }

    return (
      <div className="container">
        <section className="white-section product-section">
          <div className="row col-md-12">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-12">
                  <h3 className="title">{self.state.service.name}</h3>
                  <div className="rating">
                    <div className="stars">
                      <Rater total={5} rating={self.state.service.average_score} interactive={false} />
                      <b> {self.state.service.average_score} </b>
                    </div>
                    <span className="comments">Comments({self.state.service.nb_comments})</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  {tags.length > 0 && (
                    <ul className="no-padding tags col-md-12">
                      {tags}
                    </ul>)
                  }
                </div>
              </div>
              <div className="row medium-padding-top">
                <ul className="col-md-3 no-style no-margin image-selector">
                  {images}
                </ul>
                <div className="col-md-9">
                  <Magnify style={{
                    width:'433px',
                    height: '433px'
                  }} src={currentImageSrc}></Magnify>
                </div>
              </div>
              <div className="row">
                <Nav tabs className="col-md-12">
                  <NavItem>
                    <NavLink
                      className={classnames({ active: action === 'general' })}
                      onClick={() => { this.navigateGeneral(); }}
                    >
                      General
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: action === 'comments' })}
                      onClick={() => { this.navigateComments(); }}
                    >
                      Comments
                    </NavLink>
                  </NavItem>
                </Nav>
                <div className="col-md-12">
                  {content}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <h4 className="price">€ {self.state.service.new_price}</h4>
              <button className="btn btn-success">CONTACT THE SHOP</button>
            </div>
          </div>
        </section>
      </div> );
  }
  componentWillMount() {
    this.refresh();
  }
}

export default withRouter(Services);
