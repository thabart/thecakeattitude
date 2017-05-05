import request from 'request';
import Constants from '../../Constants';
import Promise from 'bluebird';
import SessionService from './Session';
import $ from 'jquery';

module.exports = {
  // Get comment
  get: function(id) {
    return new Promise(function(resolve, reject) {
      $.get(Constants.apiUrl + '/comments/'+id).then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      });
    });
  }
};
