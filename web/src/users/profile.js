import React, {Component} from "react";
import { translate } from 'react-i18next';
import { Alert, Tooltip, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { UserService } from '../services/index';
import { ApplicationStore } from '../stores/index';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.setValue = this.setValue.bind(this);
    this.toggle = this.toggle.bind(this);
    this.save = this.save.bind(this);
    this.clickBannerImage = this.clickBannerImage.bind(this);
    this.uploadBannerImage = this.uploadBannerImage.bind(this);
    this.uploadPictureImage = this.uploadPictureImage.bind(this);
    this.clickPictureImage = this.clickPictureImage.bind(this);
    this.state = {
      isLoading: false,
      canBeEdited: false,
      isEditable: false,
      errorMessage: null,
      user : props.user || {},
      isEditUserTooltipOpened: false, // Tooltip
      isViewUserTooltipOpened: false,
      isUpdateUserTooltipOpened: false,
      isBannerImageTooltipOpened: false,
      isEditProfileTooltipOpened: false
    };
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

  }

  clickBannerImage() { // Execute when the user clicks on the banner image.

  }

  uploadPictureImage() { // Upload the picture image.

  }

  uploadBannerImage() { // Update the banner image.

  }

  clickPictureImage() { // When clicks on the btn then open the window explorer.

  }

  render() { // Render the view.
    const {t} = this.props;
    var self = this;
    if (this.state.isLoading) {
      return (<div className="container"><i className='fa fa-spinner fa-spin'></i></div>);
    }

    if (this.state.errorMessage !== null) {
        return (<div className="container">
          <Alert color="danger" isOpen={this.state.errorMessage !== null} toggle={() => this.setValue('errorMessage', null)}>{this.state.errorMessage}</Alert>
        </div>);
    }

    var bannerImage = "/images/default-shop-banner.jpg";
    return (<div className="container">
      { /* Header */ }
      <section className="row cover">
        { /* Cover banner */ }
        <div className="cover-banner">
          <img src={bannerImage}/>
        </div>
        { /* Profile picture */ }
        <div className="profile-img">
          <img src={this.state.user.picture} className="img-thumbnail" />
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
          <h1>{this.state.user.name}</h1>
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
              <span>{this.state.user.email}</span>
            </div>
            { /* Home phone */ }
            <div className="col-md-4 shop-badge">
              <i className="fa fa-phone fa-3 icon"></i><br />
              <span>{this.state.user.home_phone_number}</span>
            </div>
            { /* Mobile phone */ }
            <div className="col-md-4 shop-badge">
              <i className="fa fa-mobile fa-3 icon"></i><br />
              <span>{this.state.user.mobile_phone_number}</span>
            </div>
          </div>
        </div>
      </section>
     </div>);
  }

  componentDidMount() { // Execute before the render.
    var self = this;
    self.setState({
      isLoading: true
    });
    const {t} = this.props;
    var sub = this.props.sub;
    UserService.getPublicClaims(sub).then(function(user) {
      var localUser = ApplicationStore.getUser();
      var canBeEdited = localUser && localUser !== null && localUser.sub === user.sub;
      var isEditable = self.props.isEditable || false;
      isEditable = canBeEdited && isEditable;
      self.setState({
        isLoading: false,
        user: user,
        canBeEdited: canBeEdited,
        isEditable: isEditable,
      });
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
