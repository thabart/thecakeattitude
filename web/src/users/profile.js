import React, {Component} from "react";
import { translate } from 'react-i18next';
import { Alert, Tooltip, Button, Input, FormFeedback } from "reactstrap";
import { NavLink } from "react-router-dom";
import { UserService } from '../services/index';
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
    this.state = {
      password: null,
      isLoading: false,
      canBeEdited: false,
      isEditable: false,
      errorMessage: null,
      user : props.user || { claims : {} },
      isPasswordInvalid: false,
      isEditUserTooltipOpened: false, // Tooltip
      isViewUserTooltipOpened: false,
      isUpdateUserTooltipOpened: false,
      isBannerImageTooltipOpened: false,
      isEditProfileTooltipOpened: false
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

  save() { // Save the user.
    var user = EditUserStore.getUser();
    var self = this;
    if (user.is_local_account) {
      user['password'] = self.state.password;
      if(user['password'] && user['password'] !== '') {
        var regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
        if (!regex.test(user['password'])) {
          self.setState({
            isPasswordInvalid: true
          });
          return;
        }
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

    var feedbackName = null;
    var errorMessage = null;
    if (this.state.isPasswordInvalid) {
      errorMessage = t('passwordInvalid');
      feedbackName = 'danger';
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
      { /* Contact information */ }
      <section className="section row" style={{marginTop: "20px", paddingTop: "20px"}}>
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
                <div className="form-group">
                  <label>{t('newPassword')}</label>
                  <Input type="password" className="form-control" state={feedbackName} value={self.state.password} name="password" onChange={self.handleInputChange} />
                  <FormFeedback>{errorMessage}</FormFeedback>
                </div>
                { /* Save button */ }
                <div className="form-group">
                  <input type="submit" className="btn btn-default" value={t('update')} />
                </div>
              </form>
            ) : (
                <button className="btn btn-default">{t('confirmYourAccount')}</button>
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
