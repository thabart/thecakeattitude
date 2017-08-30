var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _orders = {};

function loadOrders(orders) {
  _orders = orders;
}

function updateOrders(json) {
  _orders = $.extend({}, _orders, json);
}

var BasketStore = $.extend({} , EventEmitter.prototype, {
  getOrders() {
    return _orders;
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
      break;
    default:
      return true;
  }

  return true;

});
module.exports = BasketStore;
