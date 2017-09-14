import Constants from "../../Constants";
import Promise from "bluebird";
import $ from "jquery";

module.exports = {
    getAuthorizeUrl: function() { // Get the authorize url
      return Constants.PayPalBaseUrl + '/webapps/auth/protocol/openidconnect/v1/authorize?client_id=' + Constants.PaypalClientId + '&response_type=code&scope=openid%20email&redirect_uri=' + Constants.PayPalCallbackUrl + '&nonce=86655724&newUI=Y';
    }
};
