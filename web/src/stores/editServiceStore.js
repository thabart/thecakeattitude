var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _service = {};
var _mode = 'view';

function loadService(service) {
  _service = service;
}

function updateService(json) {
  _service = $.extend({}, _service, json);
}

var EditServiceStore = $.extend({} , EventEmitter.prototype, {
  getService() {
    return _service;
  },
  getMode() {
      return _mode;
  },
  emitModeChange: function() {
    this.emit('modeChange');
  },
  addModeChangeListener: function(callback) {
    this.on('modeChange', callback);
  },
  removeModeChangeListener: function(callback) {
    this.removeListener ('modeChange', callback);
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
    case Constants.events.VIEW_PRODUCT_ACT:
      _mode = 'view';
      EditServiceStore.emitModeChange();
      break;
    case Constants.events.EDIT_PRODUCT_ACT:
      _mode = 'edit';
      EditServiceStore.emitModeChange();
    break;
    case Constants.events.EDIT_SERVICE_LOADED:
      loadService(payload.data);
      break;
    case Constants.events.UPDATE_SERVICE_INFORMATION_ACT:
      updateService(payload.data);
      EditServiceStore.emitChange();
    break;
    default:
      return true;
  }

  return true;

});
module.exports = EditServiceStore;
