import Constants from "../../Constants-common";
import Promise from "bluebird";
import $ from "jquery";

module.exports = {
    getAuthorizeUrl: function() { // Get the authorize url
      return Constants.PayPalBaseUrl + '/webapps/auth/protocol/openidconnect/v1/authorize?client_id=' + Constants.PaypalClientId + '&response_type=code&scope=openid%20email&redirect_uri=' + Constants.PayPalCallbackUrl + '&nonce=86655724&newUI=Y';
    },
    getUserInformation: function(accessToken) { // Get the user information.
      return new Promise(function(resolve, reject) {
        $.ajax(Constants.PaypalApiBaseUrl + '/v1/oauth2/token/userinfo?schema=openid', {
          type: 'GET',
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
        }).then(function(result) {
          resolve(result);
        }).fail(function() {
          reject();
        });
      });
    }
};
