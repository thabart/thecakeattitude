import Constants from '../../Constants';
import Promise from 'bluebird';
import $ from 'jquery';

module.exports = {
  get: function() {
    return new Promise(function(resolve, reject) {
      $.get(Constants.configurationApiUrl).then(function(result) {
        resolve(result);
      }).catch(function() {
        reject();
      })
    });
  }
};
