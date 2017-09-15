var Constants = require('../../Constants-server');
var Promise = require('bluebird');
var http = require('http');
var Client = require('./Client');
var Constants = require('../../Constants-common');
var ServerConstants = require('../../Constants-server');

module.exports = {
  getOpenIdAccessToken: function(code) { // Get openid access token.
    return new Promise(function(resolve, reject) {
      var url = Constants.PaypalApiBaseUrl + '/v1/identity/openidconnect/tokenservice';
      var data = {
        grant_type : 'authorization_code',
        code: code
      };

      var credentials = new Buffer(Constants.PaypalClientId + ':' + ServerConstants.PaypalClientSecret).toString('base64');
      Client.post(url, data, 'application/x-www-form-urlencoded', 'Basic ' + credentials).then(function(r) {
        resolve(JSON.parse(r));
      }).catch(function() {
        reject();
      });
    });
  }
};
