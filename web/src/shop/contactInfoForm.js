import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import { CategoryService, SessionService, OpenIdService } from '../services';
import Game from '../game/game';
import Constants from '../../Constants';
import $ from 'jquery';

class ContactInfoForm extends Component {
  constructor(props) {
    super(props);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isEnabled : false,
      isContactInfoHidden: false,
      userInfo: null
    };
  }
  previous() {
    this.props.onPrevious();
  }
  next() {
    this.props.onNext();
  }
  toggle(e) {
    this.setState({
      isEnabled : e.target.checked
    });
  }
  componentWillMount() {
    var self = this;
    this.setState({
      isContactInfoHidden: true
    });
    var session = SessionService.getSession();
    if (!session || !session.access_token) {
      self.props.onError('token cannot be retrieved');
      self.setState({
        isContactInfoHidden: false
      });
    }

    OpenIdService.getUserInfo(session.access_token).then(function(userInfo) {
      self.setState({
        isContactInfoHidden: false,
        userInfo: userInfo
      });
    }).catch(function() {
      self.props.onError('user information cannot be retrieved');
      self.setState({
        isContactInfoHidden: false
      });
    });
  }
  render() {
    if (this.state.isContactInfoHidden) {
      return (<section className="col-md-12 section">Loading ...</section>)
    }

    var opts = {};
    if (!this.state.isEnabled) {
      opts['readOnly'] = 'readOnly';
    }
    return (
      <div>
        <section className="col-md-12 section">
          <div className='form-group col-md-12'><p><i className="fa fa-exclamation-triangle"></i> Those information are coming from your profile.</p><p>Do-you want to update them ? <input type='checkbox' onClick={this.toggle} /> Yes or No</p></div>
          <div className='form-group col-md-12'><label className='control-label'>Email</label><input type='text' className='form-control' value={this.state.userInfo.email} name='email' {...opts} /></div>
          <div className='form-group col-md-12'><label className='control-label'>Mobile phone</label><input type='text' className='form-control' value={this.state.userInfo.mobile_phone_number} name='mobile_phone_number' {...opts} /></div>
          <div className='form-group col-md-12'><label className='control-label'>Home phone</label><input type='text' className='form-control' value={this.state.userInfo.home_phone_number} name='home_phone_number' {...opts} /></div>
        </section>
        <section className="col-md-12 sub-section">
          <button className="btn btn-primary previous" onClick={this.previous}>Previous</button>
          <button className="btn btn-primary next" onClick={this.next}>Next</button>
        </section>
      </div>
    );
  }
}

export default ContactInfoForm;
