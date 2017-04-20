import OpenIdService from './OpenId';
import SessionService from './Session';
import Promise from 'bluebird';

module.exports = {
  authenticate(accessToken) {
      return new Promise(function(resolve, reject) {
        OpenIdService.introspect(accessToken).then(function(introspect) {
          if (!introspect.active) {
            reject();
          }

          var session = {
            access_token: accessToken
          };
          SessionService.setSession(session);
          resolve();
        }).catch(function() {
          reject();
        })
      });
  }
};
