import Promise from "bluebird";
import ConfigurationService from "./Configuration";
import Session from "./Session";
import $ from "jquery";

module.exports = {
    // Search products
    search: function (content) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.products_endpoint + '/.search', {
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
    // Get product
    get: function (id) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.get(configuration.products_endpoint + '/' + id).then(function (r) {
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
                $.ajax(configuration.products_endpoint + '/' + productId + '/shop', {
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
    // Search comments
    searchComments: function (productId, content) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.products_endpoint + '/' + productId + '/comments', {
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
    removeComment: function (productId, commentId) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.products_endpoint + '/' + productId + '/comments/' + commentId, {
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
                $.ajax(configuration.products_endpoint + '/comments', {
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
    // Add a product
    add: function(content, commonId) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.products_endpoint, {
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
