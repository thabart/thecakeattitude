import Promise from "bluebird";
import ConfigurationService from "./Configuration";
import Session from "./Session";
import $ from "jquery";

module.exports = {
    searchParcelShops: function (content) { // Search parcel shops.
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.ups_endpoint + '/parcelshops/.search', {
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
    searchRatings: function(content) { // Search capabilities.
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.ups_endpoint + '/ratings/.search', {
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
    purchaseLabel: function(content) { // Purchase the label.
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.ups_endpoint + '/buylabel', {
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
    getServices : function(countryCode) { // Get the UPS services.
      return new Promise(function(resolve, reject) {
        ConfigurationService.get().then(function (configuration) {
          $.ajax(configuration.ups_endpoint + '/services/'+countryCode, {
              method: 'GET'
          }).then(function (r) {
              resolve(r);
          }).fail(function (e) {
              reject(e);
          });
        });
      });
    }
};
