var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _user = {};
var _message = {};
var _loading = { displayed: false };

function loadUser(data) {
  _user = data;
}

function setLoading(loading) {
  _loading = loading;
}

var ApplicationStore = $.extend({} , EventEmitter.prototype, {
  getUser() {
    return _user;
  },
  getMessage() {
    return _message;
  },
  getLoading() {
    return _loading;
  },
  sendMessage(message) {
    _message = message;
    this.emit('message');
  },
  displayLoading(loading) {
    _loading = loading;
    this.emit('loading');
  },
  emitChange: function() {
    this.emit('change');
  },
  addChangeListener: function(callback) {
    this.on('change', callback);
  },
  addMessageListener: function(callback) {
    this.on('message', callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  },
  removeMessageListener: function(callback) {
    this.removeListener('message', callback);
  },
  addLoadingListener: function(callback) {
    this.on('loading', callback);
  },
  removeLoadingListener: function(callback) {
    this.removeListener('loading', callback);
  }
});

AppDispatcher.register(function(payload) {
  switch(payload.actionName) {
    case Constants.events.USER_LOGGED_IN:
      loadUser(payload.data);
      break;
    case Constants.events.USER_LOGGED_OUT:
      loadUser(null);
    break;
    default:
      return true;
  }

  ApplicationStore.emitChange();
  return true;

});
module.exports = ApplicationStore;
