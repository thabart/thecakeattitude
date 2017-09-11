var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _order = {};

function loadOrder(order) {
  _order = order;
}

var PrintOrderLabelStore = $.extend({} , EventEmitter.prototype, {
  getOrder() {
    return _order;
  },
  emitLoad: function() {
    this.emit('load');
  },
  addLoadListener: function(callback) {
    this.on('load', callback);
  },
  removeLoadListener: function(callback) {
    this.removeListener('load', callback);
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
    case Constants.events.PRINT_ORDER_LABEL_LOADED:
      loadOrder(payload.data);
      PrintOrderLabelStore.emitLoad();
    break;
    case Constants.events.UPDATE_ORDER_LABEL_ACT:
      loadOrder(payload.data);
      PrintOrderLabelStore.emitChange();
    break;
  }

  return true;
});

module.exports = PrintOrderLabelStore;
