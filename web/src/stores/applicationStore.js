var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _user = {};
var _message = {};

function loadUser(data) {
  _user = data;
}

var ApplicationStore = $.extend({} , EventEmitter.prototype, {
  getUser() {
    return _user;
  },
  getMessage() {
    return _message;
  },
  sendMessage(message) {
    _message = message;
    this.emit('message');
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
