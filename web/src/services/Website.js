import Promise from "bluebird";
import ConfigurationService from "./Configuration";
import Session from "./Session";
import Constants from '../../Constants';
import $ from "jquery";

module.exports = {
    login: function (login, password) { // Search parcel shops.
        return new Promise(function (resolve, reject) {
            var request = { "login": login, "password": password };
            $.ajax(Constants.loginUrl, {
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(request)
            }).then(function(r) {
              resolve(r);
            }).fail(function(e) {
              reject(e);
            });
        });
    }
};
