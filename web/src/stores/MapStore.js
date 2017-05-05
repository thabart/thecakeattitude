import AppDispatcher from '../appDispatcher';
import events from 'events';
import $ from 'jquery';
var EventEmitter = events.EventEmitter;

var _shops = [];

function setShops(shops) {
  _shops = shops;
}

function addShop(shop) {
  _shops.push(shop);
}

var MapStore = $.extend({}, EventEmitter.prototype, {
  getShops() {
    return _shops;
  },
  emitChange: function() {
    this.emit('change');
  },
  addChangeHandler: function(callback) {
    this.on('change', callback);
  }
});

AppDispatcher.register(function(payload) {
  switch(payload.actionName) {
    case 'new-shop':
      addShop(payload.data);
    break;
    case 'set-shops':
      setShops(payload.data);
    break;
    default:
      return true;
    break;
  }

  MapStore.emitChange();
});

module.exports = MapStore;
