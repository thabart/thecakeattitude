import Promise from "bluebird";
import Session from "./Session";
import ConfigurationService from "./Configuration";
import $ from "jquery";

module.exports = {
    search: function (content) {   // Search orders
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.orders_endpoint + '/.search', {
                    method: 'POST',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    },
                    data: JSON.stringify(content)
                }).then(function (r) {
                    resolve(r);
                }).fail(function (e) {
                    reject(e);
                });
            });
        });
    },
    add: function (content) { // Add order
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.orders_endpoint, {
                    method: 'POST',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    },
                    data: JSON.stringify(content)
                }).then(function (r) {
                    resolve(r);
                }).fail(function (e) {
                    reject(e);
                });
            });
        });
    },
    get: function (id) {   // Get order
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.orders_endpoint + '/' + id, {
                  method: 'GET',
                  headers: {
                    'Authorization': 'Bearer ' + accessToken
                  }
                }).then(function(r) {
                  resolve(r);
                }).fail(function(e) {
                  reject(e);
                });
            });
        });
    },
    getTransaction: function(id) { // Get the order transaction.
      var accessToken = Session.getSession().access_token;
      return new Promise(function (resolve, reject) {
          ConfigurationService.get().then(function (configuration) {
              $.ajax(configuration.orders_endpoint + '/' + id + '/transaction', {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + accessToken
                }
              }).then(function(r) {
                resolve(r);
              }).fail(function(e) {
                reject(e);
              });
          });
      });
    },
    remove: function (id, commonId) { // Remove the order
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.orders_endpoint + '/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'CommonId': commonId
                    }
                }).then(function (r) {
                    resolve(r);
                }).fail(function (e) {
                    reject(e);
                });
            });
        });
    },
    update: function(orderId, content, commonId) { // Update the order
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.orders_endpoint + '/' + orderId, {
                    method: 'PUT',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken,
                        'CommonId': commonId
                    },
                    data: JSON.stringify(content)
                }).then(function (r) {
                    resolve(r);
                }).fail(function (e) {
                    reject(e);
                });
            });
        });
    },
    status: function(commonId) { // Get status
      var accessToken = Session.getSession().access_token;
      return new Promise(function (resolve, reject) {
          ConfigurationService.get().then(function (configuration) {
              $.ajax(configuration.orders_endpoint + '/status', {
                  method: 'GET',
                  headers: {
                      'Authorization': 'Bearer ' + accessToken,
                      'CommonId': commonId
                  },
              }).then(function (r) {
                  resolve(r);
              }).fail(function (e) {
                  reject(e);
              });
          });
      });
    }
};
