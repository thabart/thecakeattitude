import React, {Component} from "react";
import { translate } from 'react-i18next';
import { Alert, Tooltip, Button, Input, FormFeedback, FormGroup, Label } from "reactstrap";
import { NavLink } from "react-router-dom";
import { UserService, PaypalService } from '../services/index';
import { ApplicationStore, EditUserStore } from '../stores/index';
import { EditableText } from '../components/index';
import AppDispatcher from '../appDispatcher';
import Constants from '../../Constants';
import Mousetrap from 'mousetrap';
import $ from 'jquery';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.setValue = this.setValue.bind(this);
    this.toggle = this.toggle.bind(this);
    this.save = this.save.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.clickBannerImage = this.clickBannerImage.bind(this);
    this.uploadBannerImage = this.uploadBannerImage.bind(this);
    this.uploadPictureImage = this.uploadPictureImage.bind(this);
    this.clickPictureImage = this.clickPictureImage.bind(this);
    this.updateDisplayname = this.updateDisplayname.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updateHomePhone = this.updateHomePhone.bind(this);
    this.updateMobilePhone = this.updateMobilePhone.bind(this);
    this.confirm = this.confirm.bind(this);
    this.navigatePaypal = this.navigatePaypal.bind(this);
    this.state = {
      password: null,
      copiedPassword: null,
      isLoading: false,
      canBeEdited: false,
      isEditable: false,
      errorMessage: null,
      user : props.user || { claims : {} },
      isEditUserTooltipOpened: false, // Tooltip
      isViewUserTooltipOpened: false,
      isUpdateUserTooltipOpened: false,
      isBannerImageTooltipOpened: false,
      isEditProfileTooltipOpened: false,
      valid: {
        isPasswordInvalid: false,
        isPasswordConfirmationInvalid: false
      }
    };
  }

  handleInputChange(e) { // Handle input change.
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  setValue(name, value) { // Set value.
    this.setState({
      [name]: value
    });
  }

  toggle(name) { // Toggle a state.
    this.setState({
      [name]: !this.state[name]
    });
  }

  confirm() { // Confirm the user account.
    var self = this;
    const {t} = self.props;
    self.setState({
      isLoading: true
    });
    UserService.confirm().then(function() {
      var user = self.state.user;
      user.is_local_account = true;
      ApplicationStore.sendMessage({
        message: t('successConfirmUser'),
        level: 'success',
        position: 'bl'
      });
      self.setState({
        isLoading: false,
        user: user
      });
    }).catch(function() {
      ApplicationStore.sendMessage({
        message: t('errorConfirmUser'),
        level: 'error',
        position: 'tr'
      });
      self.setState({
        isLoading: false
      });
    });
  }

  save() { // Save the user.
    var user = EditUserStore.getUser();
    var self = this;
    var valid = this.state.valid;
    var isValid = true;
    if (user.is_local_account) {
      user['password'] = self.state.password;
      if(user['password'] && user['password'] !== '') {
        var regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
        if (!regex.test(user['password'])) {
          valid.isPasswordInvalid = true;
          isValid = false;
        } else {
          valid.isPasswordInvalid = false;
        }
      }

      if (self.state.copiedPassword != self.state.password) {
        isValid = false;
        valid.isPasswordConfirmationInvalid = true;
      } else {
        valid.isPasswordConfirmationInvalid = false;
      }

      if (!isValid) {
        self.setState({
          valid: valid
        });
        return;
      }
    }

    const {t} = this.props;
    self.setState({
      isLoading: true
    });
    UserService.update(user).then(function() {
      ApplicationStore.sendMessage({
        message: t('successUpdateUser'),
        level: 'success',
        position: 'bl'
      });
      self.setState({
        isLoading: false
      });
    }).catch(function() {
      ApplicationStore.sendMessage({
        message: t('errorUpdateUser'),
        level: 'error',
        position: 'tr'
      });
      self.setState({
        isLoading: false
      });
    });
  }

  uploadImage(e, callback) { // Common function used to upload the image.
      e.preventDefault();
      var file = e.target.files[0];
      if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
        return;
      }

      var reader = new FileReader();
      reader.onloadend = () => {
          callback(reader.result);
      };
      reader.readAsDataURL(file);
  }

  clickPictureImage() { // When clicks on the btn then open the window explorer.
      var btn = this.refs.uploadProfileBtn;
      $(btn).click();
  }

  uploadPictureImage(e) { // Upload the picture image.
      var self = this;
      self.uploadImage(e, function (result) {
          var user = self.state.user;
          user.claims.picture = result;
          self.setState({
              user: user
          });
          AppDispatcher.dispatch({
              actionName: Constants.events.UPDATE_USER_INFORMATION_ACT,
              data: { claims: user.claims }
          });
      });
  }

  clickBannerImage() { // Execute when the user clicks on the banner image.
      var btn = this.refs.uploadBannerBtn;
      $(btn).click();
  }

  uploadBannerImage(e) { // Update the banner image.
      var self = this;
      self.uploadImage(e, function (result) {
          var user = self.state.user;
          user.claims.banner_image = result;
          self.setState({
              user: user
          });
          AppDispatcher.dispatch({
              actionName: Constants.events.UPDATE_USER_INFORMATION_ACT,
              data: {banner_image: result}
          });
      });
  }

  updateDisplayname(title) { // Update the display name.
      var user = this.state.user;
      user.claims.name = title;
      this.setState({
        user: user
      });
      AppDispatcher.dispatch({
          actionName: Constants.events.UPDATE_USER_INFORMATION_ACT,
          data: { claims: user.claims }
      });
  }

  updateEmail(email) { // Update the email
      var user = this.state.user;
      user.claims.email = email;
      this.setState({
        user: user
      });
      AppDispatcher.dispatch({
          actionName: Constants.events.UPDATE_USER_INFORMATION_ACT,
          data: { claims: user.claims }
      });
  }

  updateHomePhone(phone) { // Update the home phone number.
      var user = this.state.user;
      user.claims.home_phone_number = phone;
      this.setState({
        user: user
      });
      AppDispatcher.dispatch({
          actionName: Constants.events.UPDATE_USER_INFORMATION_ACT,
          data: { claims: user.claims }
      });
  }

  updateMobilePhone(phone) { // Update the mobile phone number.
      var user = this.state.user;
      user.claims.mobile_phone_number = phone;
      this.setState({
        user: user
      });
      AppDispatcher.dispatch({
          actionName: Constants.events.UPDATE_USER_INFORMATION_ACT,
          data: { claims: user.claims }
      });
  }

  navigatePaypal() { // Navigate to paypal.
      var getParameterByName = function (name, url) {
          if (!url) url = window.location.href;
          name = name.replace(/[\[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
              results = regex.exec(url);
          if (!results) return null;
          if (!results[2]) return '';
          return decodeURIComponent(results[2].replace(/\+/g, " "));
      };
      var self = this;
      var url = PaypalService.getAuthorizeUrl();
      var w = window.open(url, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=400');
      var interval = setInterval(function () {
          if (w.closed) {
              clearInterval(interval);
              return;
          }

          var href = w.location.href;
          var authCode = getParameterByName('code', href);
          if (authCode) {
              console.log(authCode);
              clearInterval(interval);
              w.close();
          }
      });
  }

  render() { // Render the view.
    const {t} = this.props;
    var self = this;
    if (this.state.isLoading) {
      return (<div className="container"><i className='fa fa-spinner fa-spin'></i></div>);
    }

    if (this.state.errorMessage !== null) {
        return (<div className="container">
          <Alert color="danger" isOpen={this.state.errorMessage !== null}>{this.state.errorMessage}</Alert>
        </div>);
    }

    var feedbackPassword = null;
    var errorPasswordMessage = null;
    var feedbackCopiedPassword = null;
    var errorCopiedPasswordMessage = null;
    if (this.state.valid.isPasswordInvalid) {
      errorPasswordMessage = t('passwordInvalid');
      feedbackPassword = 'danger';
    }

    if (this.state.valid.isPasswordConfirmationInvalid) {
      errorCopiedPasswordMessage= t('notSamePassword');
      feedbackCopiedPassword = 'danger';
    }

    var bannerImage = this.state.user.claims.banner_image || "/images/default-profile-banner.jpg";
    return (<div className="container">
      { /* Header */ }
      <section className="row cover">
        { /* Cover banner */ }
        <div className="cover-banner">
          <img src={bannerImage}/>
        </div>
        { /* Profile picture */ }
        <div className="profile-img">
          <img src={this.state.user.claims.picture} className="img-thumbnail" />
          {self.state.isEditable && (<Button outline color="secondary" id="edit-profile" size="sm" className="edit-profile-icon btn-icon with-border" onClick={this.clickPictureImage}>
            <i className="fa fa-pencil"></i>
          </Button>)}
          {self.state.isEditable && (
              <input type="file" accept=".png, .jpg, .jpeg" ref="uploadProfileBtn" className="upload-image" onChange={(e) => { this.uploadPictureImage(e); }}/>
          )}
          {self.state.isEditable && (
            <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isEditProfileTooltipOpened} target="edit-profile" toggle={() => this.toggle('isEditProfileTooltipOpened')}>
                {t('editUserProfilePictureTooltip')}
            </Tooltip>
          )}
        </div>
        { /* Profile information */ }
        <div className="profile-information">
          { self.state.isEditable ? (
              <EditableText className="header1" value={this.state.user.claims.name} validate={this.updateDisplayname} type='txt' maxLength={15} minLength={1}/>)
              : ( <h1>{this.state.user.claims.name}</h1> )
          }
        </div>
        { /* List of options */ }
        <ul className="nav nav-pills menu-profile-options">
          { this.state.isEditable && (
              <li className="nav-item">
                  <Button id="saveUser" className="btn btn-outline-secondary btn-sm btn-icon with-border" onClick={this.save}><i className="fa fa-floppy-o"></i></Button>
                  <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isUpdateUserTooltipOpened} target="saveUser" toggle={() => this.toggle('isUpdateUserTooltipOpened')}>
                      {t('updateUserTooltip')}
                  </Tooltip>
              </li>
          )}
          { this.state.isEditable && (
              <li className="nav-item">
                  <Button id="editBanner" className="btn btn-outline-secondary btn-sm btn-icon with-border" onClick={this.clickBannerImage}><i className="fa fa-pencil"></i></Button>
                  <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isBannerImageTooltipOpened} target="editBanner" toggle={() => this.toggle('isBannerImageTooltipOpened')}>
                      {t('editUserBannerImageTooltip')}
                  </Tooltip>
                  <input type="file" accept=".png, .jpg, .jpeg" ref="uploadBannerBtn" className="upload-image" onChange={(e) => { this.uploadBannerImage(e); }}/>
              </li>
          )}
          {this.state.isEditable && (
              <li className="nav-item">
                  <NavLink to="/manage/profile" className="btn btn-outline-secondary btn-sm btn-icon with-border" id="view-user" onClick={() => this.toggle('isEditable')}><i className="fa fa-eye"></i></NavLink>
                  <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isViewUserTooltipOpened} target="view-user" toggle={() => this.toggle('isViewUserTooltipOpened')}>
                      {t('viewUserTooltip')}
                  </Tooltip>
              </li>
          )}
          { this.state.canBeEdited && !this.state.isEditable && (
              <li className="nav-item">
                  <NavLink to="/manage/profile/edit" className="btn btn-outline-secondary btn-sm btn-icon with-border" id="edit-user" onClick={() => this.toggle('isEditable')}><i className="fa fa-pencil"></i></NavLink>
                  <Tooltip className="red-tooltip-inner" placement='bottom' isOpen={this.state.isEditUserTooltipOpened} target="edit-user" toggle={() => this.toggle('isEditUserTooltipOpened')}>
                      {t('editUserTooltip')}
                  </Tooltip>
              </li>
          ) }
        </ul>
      </section>
      { /* Paypal information */ }
      <section className="section row" style={{marginTop: "20px", paddingTop: "20px", paddingBottom: "20px"}}>
        <div className="col-md-12">
          <h5>{t('payment')}</h5>
          { !this.state.user.claims.paypal_email ? (<div>
            <button className="paypal-blue" onClick={this.navigatePaypal}>
              <svg className="PPTM" xmlns="http://www.w3.org/2000/svg" version="1.1" width="16px" height="17px" viewBox="0 0 16 17"><path className="PPTM-btm" fill="#0079c1" d="m15.603 3.917c-0.264-0.505-0.651-0.917-1.155-1.231-0.025-0.016-0.055-0.029-0.081-0.044 0.004 0.007 0.009 0.014 0.013 0.021 0.265 0.506 0.396 1.135 0.396 1.891 0 1.715-0.712 3.097-2.138 4.148-1.425 1.052-3.418 1.574-5.979 1.574h-0.597c-0.45 0-0.9 0.359-1.001 0.798l-0.719 3.106c-0.101 0.438-0.552 0.797-1.002 0.797h-1.404l-0.105 0.457c-0.101 0.438 0.184 0.798 0.633 0.798h2.1c0.45 0 0.9-0.359 1.001-0.798l0.718-3.106c0.101-0.438 0.551-0.797 1.002-0.797h0.597c2.562 0 4.554-0.522 5.979-1.574 1.426-1.052 2.139-2.434 2.139-4.149 0-0.755-0.132-1.385-0.397-1.891z"></path><path className="PPTM-top" fill="#00457c" d="m9.27 6.283c-0.63 0.46-1.511 0.691-2.641 0.691h-0.521c-0.45 0-0.736-0.359-0.635-0.797l0.628-2.72c0.101-0.438 0.552-0.797 1.002-0.797h0.686c0.802 0 1.408 0.136 1.814 0.409 0.409 0.268 0.611 0.683 0.611 1.244 0 0.852-0.315 1.507-0.944 1.97zm3.369-5.42c-0.913-0.566-2.16-0.863-4.288-0.863h-4.372c-0.449 0-0.9 0.359-1.001 0.797l-2.957 12.813c-0.101 0.439 0.185 0.798 0.634 0.798h2.099c0.45 0 0.901-0.358 1.003-0.797l0.717-3.105c0.101-0.438 0.552-0.797 1.001-0.797h0.598c2.562 0 4.554-0.524 5.979-1.575 1.427-1.051 2.139-2.433 2.139-4.148-0.001-1.365-0.439-2.425-1.552-3.123z"></path></svg>
              <b>{t('loginPaypal')}</b>
            </button>
          </div>) : (<span id="lippButton"></span>) }
        </div>
      </section>
      { /* Contact information */ }
      <section className="section row" style={{marginTop: "20px", paddingTop: "20px", paddingBottom: "20px"}}>
        <div className="col-md-12">
          <h5>{t('contactInformation')}</h5>
          <div className="row">
            { /* Email */ }
            <div className="col-md-4 shop-badge">
              <i className="fa fa-envelope fa-3 icon"></i><br />
              { self.state.isEditable ? (
                  <EditableText value={this.state.user.claims.email} type='email' validate={this.updateEmail}/>)
                  : ( <span>{this.state.user.claims.email}</span> )
              }
            </div>
            { /* Home phone */ }
            <div className="col-md-4 shop-badge">
              <i className="fa fa-phone fa-3 icon"></i><br />
              { self.state.isEditable ? (
                  <EditableText value={this.state.user.claims.home_phone_number} type='phone' validate={this.updateHomePhone} />)
                  : ( <span>{this.state.user.claims.home_phone_number}</span> )
              }
            </div>
            { /* Mobile phone */ }
            <div className="col-md-4 shop-badge">
              <i className="fa fa-mobile fa-3 icon"></i><br />
              { self.state.isEditable ? (
                  <EditableText value={this.state.user.claims.mobile_phone_number} type='phone' validate={this.updateMobilePhone} />)
                  : ( <span>{this.state.user.claims.mobile_phone_number}</span> )
              }
            </div>
          </div>
        </div>
      </section>
      { /* Credentials */ }
      { self.state.isEditable && (
        <section className="section row" style={{marginTop: "20px", paddingTop: "20px"}}>
          <div className="col-md-12">
            <h5>{t('credentials')}</h5>
            { self.state.user.is_local_account ? (
              <form onSubmit={(e) => { e.preventDefault(); self.save(); }}>
                { /* Login */ }
                <div className="form-group">
                  <label>{t('login')}</label>
                  <input type="text" className="form-control" value={self.state.user.claims.sub} disabled />
                </div>
                { /* Password */ }
                <FormGroup color={feedbackPassword}>
                  <Label className="col-form-label">{t('newPassword')}</Label>
                  <Input type="password" className="form-control" state={feedbackPassword} value={self.state.password} name="password" onChange={self.handleInputChange} />
                  <FormFeedback>{errorPasswordMessage}</FormFeedback>
                </FormGroup>
                { /* Confirm password */ }
                <FormGroup color={feedbackCopiedPassword}>
                  <Label className="col-form-label">{t('confirmNewPassword')}</Label>
                  <Input type="password" className="form-control" state={feedbackCopiedPassword} value={self.state.copiedPassword} name="copiedPassword" onChange={self.handleInputChange} />
                  <FormFeedback>{errorCopiedPasswordMessage}</FormFeedback>
                </FormGroup>
                { /* Save button */ }
                <div className="form-group">
                  <input type="submit" className="btn btn-default" value={t('update')} />
                </div>
              </form>
            ) : (
                <button className="btn btn-default" onClick={self.confirm}>{t('confirmYourAccount')}</button>
            )}
          </div>
        </section>
      )}
     </div>);
  }

  componentDidMount() { // Execute before the render.
    var self = this;
    self.setState({
      isLoading: true
    });

    const {t} = this.props;
    var sub = this.props.sub;
    var canBeEdited = this.props.canBeEdited;
    UserService.getPublicClaims(sub).then(function(user) {
      var localUser = ApplicationStore.getUser();
      canBeEdited = canBeEdited && localUser && localUser !== null && localUser.sub === user.claims.sub;
      var isEditable = self.props.isEditable || false;
      isEditable = canBeEdited && isEditable;
      self.setState({
        isLoading: false,
        user: user,
        canBeEdited: canBeEdited,
        isEditable: isEditable,
      });
      if (canBeEdited) {
        AppDispatcher.dispatch({
          actionName: Constants.events.EDIT_USER_LOADED,
          data: user
        });
        Mousetrap.bind('ctrl+s', function(e) { // Save the user (ctrl+s)
          if (self.state.isEditable) {
            e.preventDefault();
            self.save();
          }
        });
      }
    }).catch(function() {
      self.setState({
        isLoading: false,
        isEditable: false,
        errorMessage: t('errorRetrieveUser')
      });
    });
  }
}

export default translate('common', { wait: process && !process.release })(Profile);
