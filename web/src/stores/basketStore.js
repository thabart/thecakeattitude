var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _orders = [];
var _selectedOrderId = {};

function loadOrders(orders) {
  _orders = orders;
}

function updateOrders(json) {
  _orders = json;
}

function setSelectedOrderId(orderId) {
  _selectedOrderId = orderId;
}

var BasketStore = $.extend({} , EventEmitter.prototype, {
  getOrders() {
    return _orders;
  },
  getSelectedOrderId() {
    return _selectedOrderId;
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
    case Constants.events.BASKET_LOADED:
      loadOrders(payload.data);
      BasketStore.emitLoad();
      break;
    case Constants.events.UPDATE_BASKET_INFORMATION_ACT:
      updateOrders(payload.data);
      BasketStore.emitChange();
      break;
    case Constants.events.SELECT_ORDER_ACT:
      setSelectedOrderId(payload.data);
    break;
    default:
      return true;
  }

  return true;

});
module.exports = BasketStore;
