import request from 'request';
import Constants from '../../Constants';
import Promise from 'bluebird';
import $ from 'jquery';

module.exports = {
  search: function(content) {
    return new Promise(function(resolve, reject) {
      $.ajax(Constants.apiUrl + '/shop/.search', {
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
