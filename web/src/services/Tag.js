import Constants from "../../Constants";
import Promise from "bluebird";
import ConfigurationService from "./Configuration";
import $ from "jquery";

module.exports = {    
    getAll: function () { // Get all tags
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.get(configuration.tags_endpoint).then(function (r) {
                    resolve(r);
                }).fail(function () {
                    reject();
                });
            });
        });
    },    
    search: function (json) { // Search tags
        return new Promise(function (resolve, reject) {
          ConfigurationService.get().then(function (configuration) {
              $.ajax(configuration.tags_endpoint + '/.search', {
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(json)
              }).then(function (r) {
                  resolve(r);
              }).fail(function (e) {
                  reject(e);
              });
          }).catch(function(e) {
            reject(e);
          });
        });
    },
    get: function(id) { // Get the tag.
        return new Promise(function(resolve, reject) {
          ConfigurationService.get().then(function (configuration) {
              $.ajax(configuration.tags_endpoint + '/' + id, {
                  method: 'GET'
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
