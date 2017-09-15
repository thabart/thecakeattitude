var http = require('http');
var URL = require('url');
var Promise = require('bluebird');
var querystring = require('querystring');

module.exports = {
  get: function(url) { // Execute get request.
    return new Promise(function(resolve, reject) {
      url = URL.parse(url);
      var getOptions = {
        hostname: url.hostname,
        port    : url.port,
        path    : url.path,
        method  : 'GET'
      };
      var getRequest = http.request(getOptions, function (res) {
          res.setEncoding('utf8');
          var body = '';
          res.on('data', function (chunk) {
            body += chunk;
          });
          res.on('end', function() {
            resolve(body);
          });
      });
      getRequest.on('error', function(e) {
        reject();
      });
      getRequest.end();
    });
  },
  post: function(url, content, type) { // Execute post request.
    return new Promise(function(resolve, reject) {
      type = type || 'application/json';
      if (type === 'application/x-www-form-urlencoded') {
        content = querystring.stringify(content);
      }
      else {
        content = JSON.stringify(content);
      }

      url = URL.parse(url);
      var postOptions = {
        hostname: url.hostname,
        port    : url.port,
        path    : url.path,
        method  : 'POST',
        headers : {
            'Content-Type': type,
            'Cache-Control': 'no-cache',
            'Content-Length': content.length
        }
      };

      var postRequest = http.request(postOptions, function (res) {
          res.setEncoding('utf8');
          var body = '';
          res.on('data', function (chunk) {
            body += chunk;
          });
          res.on('end', function() {
            resolve(body);
          });
      });
      postRequest.on('error', function(e) {
        reject();
      });
      postRequest.write(content);
      postRequest.end();
    });
  }
};
