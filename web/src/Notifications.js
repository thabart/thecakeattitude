import React, {Component} from "react";
import MainLayout from './MainLayout';
import { translate } from 'react-i18next';
import { withRouter } from "react-router";
import { SessionService, NotificationService, UserService } from "./services/index";
import { Guid } from './utils/index';
import { ApplicationStore } from './stores/index';
import moment from 'moment';
import AppDispatcher from "./appDispatcher";

class Notifications extends Component {
    constructor(props) {
      super(props);
      this._waitForToken = null;
      this._commonId = null;
      self._currentPage = 1;
      this._count = 10;
      this._startIndex = 0;
      this.refreshNotifications = this.refreshNotifications.bind(this);
      this.readNotification = this.readNotification.bind(this);
      this.state = {
        isLoading: false,
        notifications: [],
        navigation: [],
        nbUnread: 0
      };
    }

    refreshNotifications() { // Refresh the notifications.
      var self = this;
      self.setState({
        isLoading: true
      });
      Promise.all([NotificationService.getStatus({}), NotificationService.search({
        count: self._count,
        start_index: self._startIndex
      })]).then(function(r) {
        var status = r[0]['_embedded'];
        var notifications = r[1]['_embedded'];
        if (!notifications) {
          notifications = [];
        }
        else if (!(notifications instanceof Array)) {
          notifications = [notifications];
        }

        var subs = notifications.map(function(notification) { return notification.from; });
        UserService.searchPublicClaims({subs: subs}).then(function(users) {
          notifications.forEach(function(notification) {
            var user = users.filter(function(user) { return user.sub === notification.from; });
            if (user && user.length === 1) {
              notification.name = user[0].name;
            }
          });

          self.setState({
            isLoading: false,
            notifications: notifications,
            navigation: r[1]['_links']['navigation'],
            nbUnread: status.nb_unread
          });
        }).catch(function() {
          self.setState({
            isLoading: false,
            notifications: [],
            navigation: [],
            nbUnread: 0
          });
        });
      }).catch(function() {
        self.setState({
          isLoading: false,
          notifications: [],
          navigation: [],
          nbUnread: 0
        });
      });
    }

    readNotification(notificationId) { // Read the notification.
      var self = this;
      self.setState({
        isLoading: true
      });
      self._commonId = Guid.generate();
      NotificationService.update(notificationId, {
        is_read: true
      }, self._commonId).catch(function() {
        self.setState({
          isLoading: false
        });
      });
    }

    render() { // Render the view.
      const {t} = this.props;
      var self = this;
      var notificationLst = [];
      var navigationLst = [];
      if (self.state.notifications) {
        self.state.notifications.map(function(notification) {
          var link = '';
          if (notification.parameters) { // construct the link.
            var shopId = notification.parameters.filter(function(param) { return param.type === "shop_id"; }).map(function(param) { return param.value; });
            var productId = notification.parameters.filter(function(param) { return param.type === "product_id"; }).map(function(param) { return param.value; });
            var serviceId = notification.parameters.filter(function(param) { return param.type === "service_id"; }).map(function(param) { return param.value; });
            if (shopId && shopId.length === 1) {
              link = (<i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/shops/'+shopId[0]+'/view/profile')}></i>);
            } else if (productId && productId.length === 1) {
              link = (<i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/products/'+productId[0]+'/comments')}></i>);
            } else if (serviceId && serviceId.length === 1) {
              link = (<i className="fa fa-link" style={{cursor: "pointer"}} onClick={() => self.props.history.push('/services/'+serviceId[0]+'/comments')}></i>);
            }
          }

          var name = notification.name ? notification.name : t('unknown');
          notificationLst.push((<li>
            <div className="row" style={{padding:"0px 5px 0px 5px"}}>
              <div className="col-md-2"><b>{name}</b><br /><span>{moment(notification.create_date).format('lll')}</span></div>
              <div className="col-md-8"><p>{t(notification.content)}</p></div>
              {notification.is_read ? (<div className="col-md-2"><i className="fa fa-eye"></i>{link}</div>)
              : (<div className="col-md-2"><i className="fa fa-eye-slash" style={{cursor: "pointer"}} onClick={(e) => { e.stopPropagation(); self.readNotification(notification.id);  }}></i>{link}</div>)}
            </div>
          </li>))
        });
      }

      if (self.state.navigation) {
        self.state.navigation.forEach(function(nav) {
          var cl = self._currentPage == nav.name ? "page-link active" : "page-link";
          navigationLst.push((<li className="page-item"><a href="#" className={cl}
            onClick={(e) => {
              e.preventDefault();
              self.props.history.push('/notifications/' + nav.name);
              self._currentPage = nav.name;
              var currentPage = nav.name - 1;
              self._startIndex = currentPage * self._count;
              self.refreshNotifications();
            }}>{nav.name}</a></li>));
        });
      }

      return (<MainLayout isHeaderDisplayed={true} isFooterDisplayed={true}>
        <div className="container">
          <h2>{t('yourNotifications')}</h2>
          <p>{t('pendingNotifications').replace('{0}', self.state.nbUnread)}</p>
          {self.state.isLoading ? (<div style={{textAlign: "center"}}><i className='fa fa-spinner fa-spin'></i></div>) :
            notificationLst.length === 0 ? (
              <div><ul className="list-group-default"><li style={{textAlign: "center", padding: "10px"}}><h3>{t('noNotifications')}</h3></li></ul></div>
            ) : (
              <div>
                <ul className="list-group-default list-group-default-border">
                  {notificationLst}
                </ul>
                <ul className="pagination">
                  {navigationLst}
                </ul>
              </div>
            )
          }
        </div>
      </MainLayout>);
    }

    componentDidMount() { // Execute before the render.
      var self = this;
      self._waitForToken = AppDispatcher.register(function (payload) {
          switch (payload.actionName) {
            case 'update-notification':
              var sub = ApplicationStore.getUser().sub;
              if (payload.data.to === sub) {
                self.refreshNotifications();
              }

              break;
          }
      });
    }

    componentWillMount() { // Execute after the render.
      var self = this;
      var pageId = self.props.match.params.pageId;
      pageId = pageId && pageId >= 1 ? pageId : 1;
      self._currentPage = pageId;
      self._startIndex = (pageId - 1) * self._count;
      self.refreshNotifications();
    }

    componentWillUnmount() { // Remove the registration.
      AppDispatcher.unregister(this._waitForToken);
    }
}

export default translate('common', { wait: process && !process.release })(withRouter(Notifications));
