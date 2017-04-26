import request from 'request';
import Constants from '../../Constants';
import Promise from 'bluebird';
import Session from './Session';
import $ from 'jquery';

module.exports = {
  // Search shops
  search: function(content) {
    return new Promise(function(resolve, reject) {
      $.ajax(Constants.apiUrl + '/shops/.search', {
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(content)
      }).then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      });
    });
  },
  // Add shop
  add: function(content) {
    var accessToken = Session.getSession().access_token;
    return new Promise(function(resolve, reject) {
      $.ajax(Constants.apiUrl + '/shops', {
        method: 'POST',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer '+accessToken
        },
        data: JSON.stringify(content)
      }).then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      });
    });
  },
  // Get shop
  get: function(id) {
    return new Promise(function(resolve, reject) {
      $.get(Constants.apiUrl + '/shops/'+id).then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      });
    });
  },
  // Get rating
  getRating: function(id) {
    return new Promise(function(resolve, reject) {
      $.get(Constants.apiUrl + '/shops/'+id+'/rating').then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      });
    });
  }
};
