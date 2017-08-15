import React, {Component} from "react";
import { Alert, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { ClientService, UserService } from './services/index';
import { translate } from 'react-i18next';
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import MainLayout from './MainLayout';
import Constants from '../Constants';

const clientServiceOpts = {
    url: '/images/service-pin.png',
    scaledSize: new window.google.maps.Size(34, 38)
};

const GettingStartedGoogleMap = withGoogleMap(props => {
    return (
        <GoogleMap
            ref={props.onMapLoad}
            center={props.center}
            defaultZoom={12}
        >
            <Marker
                icon={clientServiceOpts}
                position={props.center}/>
        </GoogleMap>
    );
});

class ClientServices extends Component {
  constructor(props) {
    super(props);
    this._googleMap = null;
    this.onMapLoad = this.onMapLoad.bind(this);
    this.state = {
      isLoading: false,
      errorMessage: null,
      user : null,
      clientService: null
    };
  }

  onMapLoad(map) { // Store google map reference.
      this._googleMap = map;
  }

  refresh() { // Refresh client service.
    var self = this,
      id = self.props.match.params.id;
    self.setState({
      isLoading: true
    });
    const {t} = this.props;
    ClientService.get(id).then(function(clientServiceResult) {
      var clientServiceEmbedded = clientServiceResult['_embedded'];
      UserService.getPublicClaims(clientServiceEmbedded.subject).then(function(userResult) {
        self.setState({
          isLoading: false,
          user: userResult,
          clientService: clientServiceEmbedded
        });
      }).catch(function() {
        self.setState({
          errorMessage: t('errorGetClientService'),
          isLoading: false
        });
      });
    }).catch(function() {
      self.setState({
        errorMessage: t('errorGetClientService'),
        isLoading: false
      });
    });
  }

  render() { // Display the view.
    const {t} = this.props;
    var self = this;
    if (this.state.isLoading) {
        return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
            <div className="container">
              <i className='fa fa-spinner fa-spin'></i>
            </div>
        </MainLayout>);
    }

    if (this.state.errorMessage !== null) {
      return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <Alert color="danger" isOpen={this.state.errorMessage !== null}>{this.state.errorMessage}</Alert>
        </div>
      </MainLayout>);
    }

    var img = "/images/profile-picture.png";
    if (this.state.user.claims.picture && this.state.user.claims.picture !== null) {
      img = this.state.user.claims.picture;
    }

    return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
      <div className="container">
        <section className="section" style={{paddingBottom: "20px"}}>
            <Breadcrumb>
                <BreadcrumbItem><NavLink className="no-decoration red" to={"/users/" + this.state.user.claims.sub}>{this.state.user.claims.name}</NavLink></BreadcrumbItem>
                <BreadcrumbItem active>{this.state.clientService.name}</BreadcrumbItem>
            </Breadcrumb>
            <div className="row">
              { /* Left side */ }
              <div className="col-md-8">
                <div style={{paddingLeft: "10px"}}>
                  { /* Title */ }
                  <h2>{this.state.clientService.name}</h2>
                  { /* Category */ }
                  <h5>{t('category')}</h5>
                  {
                    this.state.clientService.category && this.state.clientService.category !== null ?
                    (<p dangerouslySetInnerHTML={{ __html: t('clientAskedServiceToTheCommunity').replace('{0}', this.state.clientService.category.name)}}></p>) :
                    (<p>{t('clientAskedServiceToEveryone')}</p>)
                  }
                  { /* Description */ }
                  <h5>{t('description')}</h5>
                  <p>{this.state.clientService.description}</p>
                </div>
              </div>
              { /* Right side */ }
              <div className="col-md-4">
                { /* Display the user */ }
                <div className="row">
                  <div className="col-md-2">
                    <img src={img} className="rounded-circle image-small"/>
                  </div>
                  <div className="col-md-10">
                    <h5><NavLink to={"/users/" + this.state.user.claims.sub} style={{color: "inherit"}}>{this.state.user.claims.name}</NavLink></h5>
                  </div>
                </div>
                <h5>{t('proposedPrice')}</h5>
                <h4 className="price">€ {this.state.clientService.price}</h4>
                <h5>{t('contactClient')}</h5>
                <ul className="list-group">
                  {this.state.user.claims.email && this.state.user.claims.email !== null && (
                    <li className="list-group-item justify-content-between">
                      {this.state.user.claims.email}
                      <i className="fa fa-envelope fa-3"></i>
                    </li>
                  )}
                  {this.state.user.claims.home_phone_number && this.state.user.claims.home_phone_number !== null && (
                    <li className="list-group-item justify-content-between">
                      {this.state.user.claims.home_phone_number}
                      <i className="fa fa-phone fa-3"></i>
                    </li>
                  )}
                  {this.state.user.claims.mobile_phone_number && this.state.user.claims.mobile_phone_number !== null && (
                    <li className="list-group-item justify-content-between">
                      {this.state.user.claims.mobile_phone_number}
                      <i className="fa fa-mobile fa-3"></i>
                    </li>
                  )}
                </ul>
                <button className="btn btn-default" onClick={(e) => { e.preventDefault(); self.props.history.push('/newmessage'); }}>{t('sendMessage')}</button>
                <h5>{t('address')}</h5>
                <i>{this.state.clientService.street_address}</i>
                <div style={{width: "100%", height: "200px"}}>
                    <GettingStartedGoogleMap
                        onMapLoad={this.onMapLoad}
                        center={this.state.clientService.location}
                        containerElement={
                            <div style={{height: `100%`}}/>
                        }
                        mapElement={
                            <div style={{height: `100%`}}/>
                        }>
                    </GettingStartedGoogleMap>
                </div>
              </div>
            </div>
        </section>
      </div>
    </MainLayout>);
  }

  componentWillMount() {
    this.refresh();
  }
}

export default translate('common', { wait: process && !process.release })(withRouter(ClientServices));
