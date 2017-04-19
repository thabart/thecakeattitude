import request from 'request';
import Constants from '../../Constants';
import Promise from 'bluebird';
import $ from 'jquery';

module.exports = {
  getAll: function() {
    return new Promise(function(resolve, reject) {
      request({method: 'GET', uri: Constants.apiUrl + '/categories'}, function(error, response, body) {
        if (error) {
          reject();
          return;
        }

        resolve(JSON.parse(body));
      });
    });
  },
  getParents: function() {
    return new Promise(function(resolve, reject) {
      request({method: 'GET', uri: Constants.apiUrl + '/categories/parents'}, function(error, response, body) {
        if (error) {
          reject();
          return;
        }

        resolve(JSON.parse(body));
      });
    });
  },
  get: function(id) {
    return new Promise(function(resolve, reject) {
      request({method: 'GET', uri: Constants.apiUrl + '/categories/'+id}, function(error, response, body) {
        if (error) {
          reject();
          return;
        }

        resolve(JSON.parse(body));
      });
    });
  }
};
