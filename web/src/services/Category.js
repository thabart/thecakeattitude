import request from "request";
import Promise from "bluebird";
import ConfigurationService from "./Configuration";

module.exports = {
    getAll: function () { // Get all shop categories.
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (config) {
                request({method: 'GET', url: config.shopcategories_endpoint}, function (error, response, body) {
                    if (error) {
                        reject();
                        return;
                    }

                    resolve(JSON.parse(body));
                });
            }).catch(function () {
                reject();
            });
        });
    },
    getParents: function () { // Get all shop categories (with no parent).
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (config) {
                request({
                    method: 'GET',
                    url: config.shopcategories_endpoint + '/parents'
                }, function (error, response, body) {
                    if (error) {
                        reject();
                        return;
                    }

                    resolve(JSON.parse(body));
                });
            }).catch(function () {
                reject();
            });
        });
    },
    get: function (id) { // Get shop category.
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (config) {
                request({
                    method: 'GET',
                    url: config.shopcategories_endpoint + '/' + id
                }, function (error, response, body) {
                    if (error) {
                        reject();
                        return;
                    }

                    resolve(JSON.parse(body));
                });
            }).catch(function () {
                reject();
            });
        });
    },
    getMap: function (categoryId, mapName) { // Get map.
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (config) {
                request({
                    method: 'GET',
                    url: config.shopcategories_endpoint + '/' + categoryId + '/maps/' + mapName
                }, function (error, response, body) {
                    if (error) {
                        reject();
                        return;
                    }

                    resolve(JSON.parse(body));
                });
            }).catch(function () {
                reject();
            });
        });
    }
};
