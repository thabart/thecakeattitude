import request from 'request';
import Constants from '../../Constants';
import SessionService from './Session';
import Promise from 'bluebird';
import $ from 'jquery';

module.exports = {
  // Update claims.
  updateClaims: function(json) {
    return new Promise(function(resolve, reject) {
      var session = SessionService.getSession();
      if (!session || !session.access_token) {
        reject();
      }

      $.ajax(Constants.openIdUrl + '/users/claims', {
        method: 'PUT',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer '+session.access_token
        },
        data: JSON.stringify(json)
      }).then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      });
    });
  },
  // Get claims
  getClaims: function() {
    return new Promise(function(resolve, reject) {
      var session = SessionService.getSession();
      if (!session || !session.access_token) {
        reject();
      }

      $.ajax(Constants.openIdUrl + '/users/claims', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '+session.access_token
        }
      }).then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      });
    });
  },
  // Get public claims
  getPublicClaims: function(subject) {
    return new Promise(function(resolve, reject) {
      $.get(Constants.openIdUrl + '/users/' + subject + '/public').then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      })
    });
  }
};
