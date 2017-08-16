import Promise from "bluebird";
import ConfigurationService from "./Configuration";
import Session from "./Session";
import $ from "jquery";

module.exports = {
    // Search service occurrences
    searchOccurrences: function (content) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.services_endpoint + '/occurrences/.search', {
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
    // Search services
    search: function (content) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.services_endpoint + '/.search', {
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
    // Get shop
    getShop: function (productId) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.services_endpoint + '/' + productId + '/shop', {
                    method: 'POST',
                    contentType: 'application/json'
                }).then(function (r) {
                    resolve(r);
                }).fail(function (e) {
                    reject(e);
                });
            });
        });
    },
    // Get service
    get: function (id) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.get(configuration.services_endpoint + '/' + id).then(function (r) {
                    resolve(r);
                }).fail(function (e) {
                    reject(e);
                });
            });
        });
    },
    // Search comments
    searchComments: function (serviceId, content) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.services_endpoint + '/' + serviceId + '/comments', {
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
    // Remove comment
    removeComment: function (serviceId, commentId) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.services_endpoint + '/' + serviceId + '/comments/' + commentId, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                }).then(function (r) {
                    resolve(r);
                }).fail(function (e) {
                    reject(e);
                });
            });
        });
    },
    // Add comment
    addComment: function (content) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.services_endpoint + '/comments', {
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
    // Add service
    add: function(content, commonId) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.services_endpoint, {
                    method: 'POST',
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
    }
};
