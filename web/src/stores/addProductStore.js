var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _shop = {};

function loadShop(shop) {
  _shop = shop;
}

var AddProductStore = $.extend({} , EventEmitter.prototype, {
  getShop() {
    return _shop;
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
    case Constants.events.ADD_PRODUCT_LOADED:
      loadShop(payload.data);
      break;
    default:
      return true;
  }

  AddProductStore.emitChange();
  return true;

});
module.exports = AddProductStore;
