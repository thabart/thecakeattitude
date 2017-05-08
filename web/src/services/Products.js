import request from 'request';
import Constants from '../../Constants';
import Promise from 'bluebird';
import ConfigurationService from './Configuration';
import $ from 'jquery';

module.exports = {
  // POST: Search products
  search: function(content) {
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
  },
  // Get product
  get: function(id) {
    return new Promise(function(resolve, reject) {
      ConfigurationService.get().then(function(configuration) {
        $.get(configuration.products_endpoint + '/' + id).then(function(r) {
          resolve(r);
        }).fail(function(e) {
          reject(e);
        });
      });
    });
  }
};
