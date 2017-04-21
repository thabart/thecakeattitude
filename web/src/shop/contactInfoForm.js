import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import { CategoryService, SessionService, OpenIdService, UserService } from '../services';
import Game from '../game/game';
import Constants from '../../Constants';
import $ from 'jquery';
import './contactInfoForm.css';

class ContactInfoForm extends Component {
  constructor(props) {
    super(props);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.toggle = this.toggle.bind(this);
    this.update = this.update.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      isEnabled : false,
      isContactInfoHidden: false,
      userInfo: null,
      isUpdating: false,
      isEmailInvalid: false,
      isMobilePhoneInvalid: false,
      isHomePhoneInvalid: false
    };
  }
  handleInputChange(e) {
    var self = this;
    const target = e.target;
    const name = target.name;
    var isEmailInvalid = false,
      isMobilePhoneInvalid = false,
      isHomePhoneInvalid = false;
    switch (name) {
      case "email":
        var regex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$");
        if (!regex.test(target.value)) {
          isEmailInvalid= true;
        }
      break;
      case "mobile_phone_number":
      case "home_phone_number":
        var regex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
        if (!regex.test(target.value)) {
          if (name == "mobile_phone_number") {
            isMobilePhoneInvalid = true;
          } else {
            isHomePhoneInvalid = true;
          }
        }
      break;
    }

    self.setState({
      isEmailInvalid: isEmailInvalid,
      isMobilePhoneInvalid: isMobilePhoneInvalid,
      isHomePhoneInvalid: isHomePhoneInvalid
    });

    this.state.userInfo[name] = target.value;
    this.setState({
      userInfo: this.state.userInfo
    });
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
  update() {
    var json = {
      home_phone_number: this.state.userInfo.home_phone_number,
      mobile_phone_number: this.state.userInfo.mobile_phone_number,
      email: this.state.userInfo.email
    };
    var self = this;
    self.setState({
      isUpdating: true
    });
    UserService.updateClaims(json).then(function() {
      self.setState({
        isUpdating: false
      });
    }).catch(function() {
      self.props.onError('an error occured while trying to update the profile');
      self.setState({
        isUpdating: false
      });
    });
  }
  componentWillMount() {
    var self = this;
    this.setState({
      isContactInfoHidden: true
    });
    UserService.getClaims().then(function(userInfo) {
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

    var isInvalid = this.state.isEmailInvalid || this.state.isMobilePhoneInvalid || this.state.isHomePhoneInvalid;
    var optsActions = {};
    if (isInvalid) {
      optsActions['disabled'] = 'disabled';
    }

    return (
      <div>
        <section className="col-md-12 section">
          <div className='form-group col-md-12'><p><i className="fa fa-exclamation-triangle"></i> Those information are coming from your profile.</p><p>Do-you want to update them ? <input type='checkbox' onClick={this.toggle} /> Yes or No</p></div>
          <div className='form-group col-md-12'>
            <label className='control-label'>Email</label>
            <input type='email' className={!this.state.isEmailInvalid ? 'form-control' : 'form-control invalid'} value={this.state.userInfo.email}  onChange={this.handleInputChange} name='email' {...opts} />
            { this.state.isEmailInvalid  && (<span className="invalid-description">The email is invalid</span>) }
          </div>
          <div className='form-group col-md-12'>
            <label className='control-label'>Mobile phone</label>
            <input type='text' className={!this.state.isMobilePhoneInvalid ? 'form-control' : 'form-control invalid'} value={this.state.userInfo.mobile_phone_number}  onChange={this.handleInputChange} name='mobile_phone_number' {...opts} />
            { this.state.isMobilePhoneInvalid && (<span className="invalid-description">The mobile phone is not valid</span>) }
          </div>
          <div className='form-group col-md-12'>
            <label className='control-label'>Home phone</label>
            <input type='text' className={!this.state.isHomePhoneInvalid ? 'form-control' : 'form-control invalid'} value={this.state.userInfo.home_phone_number}  onChange={this.handleInputChange} name='home_phone_number' {...opts} />
            { this.state.isHomePhoneInvalid && <span className="invalid-description">The home phone is not valid</span> }
          </div>
        </section>
        <section className="col-md-12 sub-section">
          <button className="btn btn-primary previous" onClick={this.previous}>Previous</button>
          {!this.state.isUpdating ?
            (<button className="btn btn-primary previous" onClick={this.update} {...optsActions}>Update</button>) :
            (<button className="btn btn-primary previous" disabled><i className='fa fa-spinner fa-spin'></i> Processing update ...</button>)
          }
          {!this.state.isUpdating ?
            (<button className="btn btn-primary next" onClick={this.next} {...optsActions}>Next</button>) :
            (<button className="btn btn-primary next" disabled>Next</button>)
          }
        </section>
      </div>
    );
  }
}

export default ContactInfoForm;
