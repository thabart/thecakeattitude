var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _user = {};

function loadUser(user) {
  _user = user;
}

function updateUser(json) {
  _user = $.extend({}, _user, json);
}

var EditUserStore = $.extend({} , EventEmitter.prototype, {
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
    case Constants.events.EDIT_USER_LOADED:
      loadUser(payload.data);
      break;
    case Constants.events.UPDATE_USER_INFORMATION_ACT:
      updateUser(payload.data);
      EditUserStore.emitChange();
    break;
    default:
      return true;
  }

  return true;

});
module.exports = EditUserStore;
