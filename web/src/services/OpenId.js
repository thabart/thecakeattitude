import request from 'request';
import Constants from '../../Constants';
import Promise from 'bluebird';
import $ from 'jquery';

module.exports = {
  getWellKnownConfiguration: function() {
    return new Promise(function(resolve, reject) {
      request({method: 'GET', uri: Constants.OpenIdWellKnownConfiguration}, function(error, response, body) {
        if (error) {
          reject();
          return;
        }

        resolve(JSON.parse(body));
      });
    });
  },
  passwordAuthentication: function(login, password) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.getWellKnownConfiguration().then(function(resp) {
        var data = {
          grant_type: 'password',
          username: login,
          password: password,
          scope: 'openid profile',
          client_id: Constants.ClientId,
          client_secret: Constants.ClientSecret
        };
        $.ajax(resp.token_endpoint, {
          data: data,
          method: 'POST',
          dataType: 'json'
        }).then(function(r) {
          resolve(r);
        }).fail(function(e) {
          reject(e);
        });
      }).catch(function() {
        reject();
      });
    });
  },
  introspect: function(accessToken) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.getWellKnownConfiguration().then(function(resp) {
        var data = {
          client_id: Constants.ClientId,
          client_secret: Constants.ClientSecret,
          token: accessToken,
          token_type_hint: 'access_token'
        };
        $.ajax(resp.introspection_endpoint, {
          data: data,
          method: 'POST',
          dataType: 'json'
        }).then(function(intro) {
          if (intro.active) {
            resolve(intro);
            return;
          }

          reject();
        }).fail(function() {
          reject();
        })
      }).catch(function() {
        reject();
      })
    });
  },
  getAuthorizationurl : function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.getWellKnownConfiguration().then(function(res) {
        resolve(res.authorization_endpoint + "?scope=openid%20profile&state=75BCNvRlEGHpQRCT&redirect_uri=http://localhost:3000&response_type=id_token%20token&client_id="+Constants.ClientId+"&nonce=nonce&response_mode=query");
      }).catch(function() {
        reject();
      })
    });
  },
  getUserInfo: function(accessToken) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.getWellKnownConfiguration().then(function(res) {
         $.ajax(res.userinfo_endpoint, {
           type: 'GET',
           headers: {
             'Authorization':'Bearer '+accessToken
           }
         }).then(function(userInfo) {
           resolve(userInfo);
         }).fail(function() {
           reject();
         });
      }).catch(function() {
        reject();
      });
    });
  }
};
