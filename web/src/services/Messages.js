import Promise from "bluebird";
import Session from "./Session";
import $ from "jquery";
import ConfigurationService from "./Configuration";

module.exports = {
  search: function (content) { // Search messages.
      var accessToken = Session.getSession().access_token;
      return new Promise(function (resolve, reject) {
          ConfigurationService.get().then(function (configuration) {
              $.ajax(configuration.messages_endpoint + '/.search', {
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
  }
};
