var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _shop = {};

function loadShop(shop) {
  _shop = shop;
}

function updateShop(json) {
  _shop = $.extend({}, _shop, json);
}

var EditShopStore = $.extend({} , EventEmitter.prototype, {
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
    case Constants.events.EDIT_SHOP_LOADED:
      loadShop(payload.data);
      break;
    case Constants.events.UPDATE_SHOP_INFORMATION_ACT:
      updateShop(payload.data);
      EditShopStore.emitChange();
    break;
    default:
      return true;
  }

  return true;

});
module.exports = EditShopStore;
