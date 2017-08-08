import React, {Component} from "react";
import { translate } from 'react-i18next';
import { UserService } from '../services/index';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user : props.user || {}
    };
  }

  render() {
    const {t} = this.props;
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
        </div>
        { /* Profile information */ }
        <div className="profile-information">
          <h1>{this.state.user.name}</h1>
        </div>
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
    var sub = this.props.sub;
    UserService.getPublicClaims(sub).then(function(user) {
      self.setState({
        isLoading: false,
        user: user
      });
    }).catch(function() {
      self.setState({
        isLoading: false
      });
    });
  }
}

export default translate('common', { wait: process && !process.release })(Profile);
