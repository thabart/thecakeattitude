import Constants from "../../Constants-common";
import Promise from "bluebird";
import $ from "jquery";

module.exports = {
    get: function () { // Get the configuration.
        return new Promise(function (resolve, reject) {
            $.get(Constants.ApiWellKnownConfiguration).then(function (result) {
                resolve(result);
            }).catch(function () {
                reject();
            })
        });
    }
};
