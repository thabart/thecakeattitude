import request from 'request';
import Constants from '../../Constants';
import Promise from 'bluebird';
import $ from 'jquery';

module.exports = {
  // Search comments
  search: function(content) {
    var param = $.param(content);
    return new Promise(function(resolve, reject) {
      $.get(Constants.apiUrl + '/comments/.search?'+param).then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      });
    });
  },
  // Get comment
  get: function(id) {
    return new Promise(function(resolve, reject) {
      $.get(Constants.apiUrl + '/comments/'+id).then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      });
    });
  },
  // Remove the comment.
  remove: function(id) {

  }
};
