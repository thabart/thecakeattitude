var Constants = require('../../Constants-server');
var Promise = require('bluebird');
var http = require('http');
var Client = require('./Client');

module.exports = {
    getWellKnownConfiguration: function () { // Get well known configuration.
      return Client.get(Constants.OpenIdWellKnownConfiguration);
    },
    introspectAccessToken: function(accessToken) { // Introspect the access token.
      var self = this;
      return new Promise(function(resolve, reject) {
        self.getWellKnownConfiguration().then(function(resp) {
          resp = JSON.parse(resp);
          var data = {
            client_id: Constants.ClientId,
            client_secret: Constants.ClientSecret,
            token: accessToken,
            token_type_hint: 'access_token'
          };
          Client.post(resp.introspection_endpoint, data, 'application/x-www-form-urlencoded').then(function(userInfo) {
            resolve(JSON.parse(userInfo));
          }).catch(function() {
            reject();
          });
        }).catch(function() {
          reject();
        });
      });
    },
    passwordAuthentication: function (login, password) { // Password authentication.
      var self = this;
      return new Promise(function(resolve, reject) {
        self.getWellKnownConfiguration().then(function(resp) {
          resp = JSON.parse(resp);
          var data = {
            grant_type: 'password',
            username: login,
            password: password,
            scope: 'openid profile phone email',
            client_id: Constants.ClientId,
            client_secret: Constants.ClientSecret
          };
          Client.post(resp.token_endpoint, data, 'application/x-www-form-urlencoded').then(function(sresp) {
            sresp = JSON.parse(sresp);
            if (!sresp.access_token) {
              reject();
            }

            resolve(sresp);
          }).catch(function() {
            reject();
          });
        }).catch(function(e) {
          reject();
        })
      });
    }
};
