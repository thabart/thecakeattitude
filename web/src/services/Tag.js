import Constants from "../../Constants";
import Promise from "bluebird";
import $ from "jquery";

module.exports = {
    // Get all tags
    getAll: function () {
        return new Promise(function (resolve, reject) {
            $.get(Constants.apiUrl + '/tags').then(function (r) {
                resolve(r);
            }).fail(function () {
                reject();
            });
        });
    },
    // Search tags
    search: function (json) {
        return new Promise(function (resolve, reject) {
            $.ajax(Constants.apiUrl + '/tags/.search', {
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(json)
            }).then(function (r) {
                resolve(r);
            }).fail(function () {
                reject();
            });
        });
    }
};
