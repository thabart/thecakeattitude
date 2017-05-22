var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _user = {};

function loadUser(data) {
  _user = data;
}

var ApplicationStore = $.extend({} , EventEmitter.prototype, {
  getUser() {
    return _user;
  },
  emitChange: function() {
    this.emit('change');
  },
  addChangeListener: function(callback) {
    this.on('change', callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }
});

AppDispatcher.register(function(payload) {
  switch(payload.actionName) {
    case Constants.events.USER_LOGGED_IN:
      loadUser(payload.data);
      break;
    default:
      return true;
  }

  ApplicationStore.emitChange();
  return true;

});
module.exports = ApplicationStore;
