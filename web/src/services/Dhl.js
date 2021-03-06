import Promise from "bluebird";
import ConfigurationService from "./Configuration";
import Session from "./Session";
import $ from "jquery";

module.exports = {
    searchParcelShops: function (content) { // Search parcel shops.
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.dhl_endpoint + '/parcelshops/.search', {
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(content)
                }).then(function (r) {
                    resolve(r);
                }).fail(function (e) {
                    reject(e);
                });
            });
        });
    },
    searchCapabalities: function(content) { // Search capabilities.
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.dhl_endpoint + '/ratings/.search', {
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(content)
                }).then(function (r) {
                    resolve(r);
                }).fail(function (e) {
                    reject(e);
                });
            });
        });
    }
};
