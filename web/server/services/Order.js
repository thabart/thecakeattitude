var Constants = require('../../Constants-common');
var Promise = require('bluebird');
var http = require('http');
var Client = require('./Client');

module.exports = {
    getWellKnownConfiguration: function () { // Get well known configuration.
      return Client.get(Constants.ApiWellKnownConfiguration);
    }
};
