import Constants from "../../Constants";
import SessionService from "./Session";
import Promise from "bluebird";
import $ from "jquery";

module.exports = {
    update: function (json) {  // Update claims.
        return new Promise(function (resolve, reject) {
            var session = SessionService.getSession();
            if (!session || !session.access_token) {
                reject();
            }

            $.ajax(Constants.openIdUrl + '/users', {
                method: 'PUT',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + session.access_token
                },
                data: JSON.stringify(json)
            }).then(function (r) {
                resolve(r);
            }).fail(function (e) {
                reject(e);
            });
        });
    },

    confirm: function() { // Confirm the account.
      return new Promise(function (resolve, reject) {
          var session = SessionService.getSession();
          if (!session || !session.access_token) {
              reject();
          }

          $.ajax(Constants.openIdUrl + '/users/confirm', {
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + session.access_token
              }
          }).then(function (r) {
              resolve(r);
          }).fail(function (e) {
              reject(e);
          });
      });
    },

    getClaims: function () { // Get claims
        return new Promise(function (resolve, reject) {
            var session = SessionService.getSession();
            if (!session || !session.access_token) {
                reject();
            }

            $.ajax(Constants.openIdUrl + '/users/claims', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + session.access_token
                }
            }).then(function (r) {
                resolve(r);
            }).fail(function (e) {
                reject(e);
            });
        });
    },
    getPublicClaims: function (subject) { // Get public claims
        return new Promise(function (resolve, reject) {
            $.get(Constants.openIdUrl + '/users/' + subject + '/public').then(function (r) {
                resolve(r);
            }).fail(function (e) {
                reject(e);
            })
        });
    },
    updateImage: function(img) { // Update image.
        return new Promise(function (resolve, reject) {
            var session = SessionService.getSession();
            if (!session || !session.access_token) {
                reject();
            }

            $.ajax(Constants.openIdUrl + '/users/image', {
                method: 'PUT',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + session.access_token
                },
                data: JSON.stringify({picture: img})
            }).then(function (r) {
                resolve(r);
            }).fail(function (e) {
                reject(e);
            });
        });
    },
    searchPublicClaims: function(content) { // Search public claims.
        return new Promise(function (resolve, reject) {
            $.ajax(Constants.openIdUrl + '/users/bulk/public', {
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(content)
            }).then(function (r) {
              resolve(r);
            }).fail(function (e) {
              reject(e);
            });
        });
    }
};
