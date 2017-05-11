import request from 'request';
import Promise from 'bluebird';
import ConfigurationService from './Configuration';
import Session from './Session';
import $ from 'jquery';

module.exports = {
  // Search services
  search: function(content) {
    return new Promise(function(resolve, reject) {
      ConfigurationService.get().then(function(configuration) {
        $.ajax(configuration.services_endpoint +'/.search', {
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(content)
        }).then(function(r) {
          resolve(r);
        }).fail(function(e) {
          reject(e);
        });
      });
    });
  }
};
