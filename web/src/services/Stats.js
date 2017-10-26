import request from "request";
import Promise from "bluebird";
import ConfigurationService from "./Configuration";

module.exports = {
    get: function () { // Get all shop categories.
        return new Promise(function (resolve, reject) {
            ConfigurationService.get().then(function (config) {
                request({method: 'GET', url: config.stats_endpoint}, function (error, response, body) {
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
