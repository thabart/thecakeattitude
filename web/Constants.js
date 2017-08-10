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
      UPDATE_SHOP: 'UPDATE_SHOP',
      NEW_PRODUCT: 'NEW_PRODUCT',
      NEW_SERVICE: 'NEW_SERVICE',
      EDIT_SHOP_LOADED: 'EDIT_SHOP_LOADED', // Loaded
      EDIT_USER_LOADED: 'EDIT_USER_LOADED',
      ADD_PRODUCT_LOADED: 'ADD_PRODUCT_LOADED',
      UPDATE_SHOP_INFORMATION_ACT: 'UPDATE_SHOP_INFORMATION_ACT', // Actions performed on the website.
      UPDATE_USER_INFORMATION_ACT: 'UPDATE_USER_INFORMATION_ACT',
      NEW_SHOP_COMMENT_ARRIVED: 'NEW_SHOP_COMMENT_ARRIVED', // signalr events.
      REMOVE_SHOP_COMMENT_ARRIVED: 'REMOVE_SHOP_COMMENT_ARRIVED',
      SHOP_UPDATE_ARRIVED: "SHOP_UPDATE_ARRIVED",
      NEW_PRODUCT_COMMENT_ARRIVED: "NEW_PRODUCT_COMMENT_ARRIVED",
      REMOVE_PRODUCT_COMMENT_ARRIVED: "REMOVE_PRODUCT_COMMENT_ARRIVED",
      NEW_SERVICE_COMMENT_ARRIVED: "NEW_SERVICE_COMMENT_ARRIVED",
      REMOVE_SERVICE_COMMENT_ARRIVED: "REMOVE_SERVICE_COMMENT_ARRIVED",
      REMOVE_SHOP_ARRIVED: "REMOVE_SHOP_ARRIVED",
      REMOVE_CLIENT_SERVICE_ARRIVED: "REMOVE_CLIENT_SERVICE_ARRIVED"
    }
};
