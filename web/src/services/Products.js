import request from 'request';
import Constants from '../../Constants';
import Promise from 'bluebird';
import $ from 'jquery';

module.exports = {
  // Search products
  search: function(content) {
    var param = $.param(content);
    return new Promise(function(resolve, reject) {
      $.get(Constants.apiUrl + '/products/.search?'+param).then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      });
    });
  },
  // POST: Search products
  postSearch: function(content) {
    return new Promise(function(resolve, reject) {
      $.ajax(Constants.apiUrl + '/products/.search', {
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(content)
      }).then(function(r) {
        resolve(r);
      }).fail(function(e) {
        reject(e);
      });
    });
  }
};
