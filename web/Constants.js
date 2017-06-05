'use strict';

module.exports = {
    ClientId: 'website',
    ClientSecret: 'website',
    OpenIdWellKnownConfiguration: 'http://localhost:5001/.well-known/openid-configuration',
    googleMapUrl: 'https://maps.googleapis.com/maps/api',
    googleMapKey: 'AIzaSyBN72d3ipuyzbqhJgjwav5HnnKkLqp3KCU',
    apiUrl: 'http://localhost:5000',
    configurationApiUrl: 'http://localhost:5000/.well-known/configuration',
    openIdUrl: 'http://localhost:5001',
    events: {
      USER_LOGGED_IN: 'USER_LOGGED_IN',
      USER_LOGGED_OUT: 'USER_LOGGED_OUT',
      ADD_PRODUCT_LOADED: 'ADD_PRODUCT_LOADED',
      EDIT_SHOP_LOADED: 'EDIT_SHOP_LOADED',
      UPDATE_SHOP_INFORMATION: 'UPDATE_SHOP_INFORMATION'
    }
};
