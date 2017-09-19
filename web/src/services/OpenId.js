import request from "request";
import Constants from "../../Constants-common";
import Promise from "bluebird";
import $ from "jquery";

module.exports = {
    getWellKnownConfiguration: function () { // Get wellknown configuration.
        return new Promise(function (resolve, reject) {
            request({method: 'GET', uri: Constants.OpenIdWellKnownConfiguration}, function (error, response, body) {
                if (error) {
                    reject();
                    return;
                }

                resolve(JSON.parse(body));
            });
        });
    },
    getAuthorizationurl: function () { // Get authorization url.
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getWellKnownConfiguration().then(function (res) {
                resolve(res.authorization_endpoint + "?scope=openid%20profile%20phone%20email&state=75BCNvRlEGHpQRCT&redirect_uri=http://localhost:3000&response_type=id_token%20token&client_id=" + Constants.ClientId + "&nonce=nonce&response_mode=query");
            }).catch(function () {
                reject();
            })
        });
    }
};
