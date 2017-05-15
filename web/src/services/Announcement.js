import Promise from "bluebird";
import ConfigurationService from "./Configuration";
import Session from "./Session";
import $ from "jquery";

module.exports = {
    // Search announcements
    search: function (content) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.announcements_endpoint + '/.search', {
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
    // Get announcement
    get: function (id) {
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.get(configuration.announcements_endpoint + '/' + id).then(function (r) {
                    resolve(r);
                }).fail(function (e) {
                    reject(e);
                });
            });
        });
    },
    // Remove announcement
    remove: function (id) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.announcements_endpoint + '/' + id, {
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
    // Add announcement
    add: function (content) {
        var accessToken = Session.getSession().access_token;
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (configuration) {
                $.ajax(configuration.announcements_endpoint, {
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
    }
};
