import request from 'request';
import Constants from '../../Constants';
import Promise from 'bluebird';
import $ from 'jquery';
import ConfigurationService from './Configuration';

module.exports = {
  // Get all shop categories
  getAll: function() {
    return new Promise(function(resolve, reject) {
      ConfigurationService.get().then(function(config) {
        request({method: 'GET', url : config.shopcategories_endpoint }, function(error, response, body) {
          if (error) {
            reject();
            return;
          }

          resolve(JSON.parse(body));
        });
      }).catch(function() {
        reject();
      });
    });
  },
  // Get all shop categories (with no parent)
  getParents: function() {
    return new Promise(function(resolve, reject) {
      ConfigurationService.get().then(function(config) {
        request({method: 'GET', url : config.shopcategories_endpoint + '/parents' }, function(error, response, body) {
          if (error) {
            reject();
            return;
          }

          resolve(JSON.parse(body));
        });
      }).catch(function() {
        reject();
      });
    });
  },
  // Get shop category
  get: function(id) {
    return new Promise(function(resolve, reject) {
      ConfigurationService.get().then(function(config) {
        request({method: 'GET', url : config.shopcategories_endpoint + '/' + id }, function(error, response, body) {
          if (error) {
            reject();
            return;
          }

          resolve(JSON.parse(body));
        });
      }).catch(function() {
        reject();
      });
    });
  },
  // Get map
  getMap: function(categoryId, mapName) {
    return new Promise(function(resolve, reject) {
      ConfigurationService.get().then(function(config) {
        request({method: 'GET', url : config.shopcategories_endpoint + '/' + categoryId + '/maps/' + mapName }, function(error, response, body) {
          if (error) {
            reject();
            return;
          }

          resolve(JSON.parse(body));
        });
      }).catch(function() {
        reject();
      });
    });
  }
};
