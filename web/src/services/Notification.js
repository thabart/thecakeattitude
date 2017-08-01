import Promise from "bluebird";
import Session from "./Session";
import $ from "jquery";
import ConfigurationService from "./Configuration";

module.exports = {
  search: function (content) { // Search notifications.
      var accessToken = Session.getSession().access_token;
      return new Promise(function (resolve, reject) {
          ConfigurationService.get().then(function (configuration) {
              $.ajax(configuration.notifications_endpoint + '/.search', {
                  headers: {
                      'Authorization': 'Bearer ' + accessToken
                  },
                  method: 'POST',
                  contentType: 'application/json',
                  data: JSON.stringify(content)
              }).then(function (r) {
                  resolve(r);
              }).fail(function (e) {
                  reject(e);
              });
          }).catch(function(e) {
            reject(e);
          });
      });
  },
  update: function(id, content, commonId) { // Update notification.
      var accessToken = Session.getSession().access_token;
      return new Promise(function (resolve, reject) {
          ConfigurationService.get().then(function (configuration) {
              $.ajax(configuration.notifications_endpoint + '/' + id, {
                  headers: {
                      'Authorization': 'Bearer ' + accessToken,
                      'CommonId': commonId
                  },
                  method: 'PUT',
                  contentType: 'application/json',
                  data: JSON.stringify(content)
              }).then(function (r) {
                  resolve(r);
              }).fail(function (e) {
                  reject(e);
              });
          }).catch(function(e) {
            reject(e);
          });
      });
  }
};
