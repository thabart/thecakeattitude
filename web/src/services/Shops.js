import Promise from "bluebird";
import Session from "./Session";
import ConfigurationService from "./Configuration";
import $ from "jquery";

module.exports = {
    search: function (content) {   // Search shops
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.shops_endpoint + '/.search', {
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
    // Search mine shops
    searchMineShops: function (content) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.shops_endpoint + '/me/.search', {
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(content),
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
    // Search comments
    searchComments: function (shopId, content) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.shops_endpoint + '/' + shopId + '/comments', {
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
    // Add shop
    add: function (content) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.shops_endpoint, {
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
    // Get shop
    get: function (id) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.get(configuration.shops_endpoint + '/' + id).then(function (r) {
                    resolve(r);
                }).fail(function (e) {
                    reject(e);
                });
            });
        });
    },
    // Remove the shop
    remove: function (id, commonId) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.shops_endpoint + '/' + id, {
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
    // Add comment
    addComment: function (content) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.shops_endpoint + '/comments', {
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
    // Remove the comment
    removeComment: function (id, commentId) {
        return new Promise(function (resolve, reject) {
            var session = Session.getSession();
            if (!session || !session.access_token) {
                reject();
            }

            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.shops_endpoint + '/' + id + '/comments/' + commentId, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + session.access_token
                    },
                }).then(function () {
                    resolve();
                }).catch(function (e) {
                    reject(e);
                });
            });
        });
    },
    // Update the shop
    update: function(shopId, content, commonId) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.shops_endpoint + '/' + shopId, {
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
    }
};
