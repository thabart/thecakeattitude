var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _product = {};
var _mode = 'view';

function loadProduct(product) {
  _product = product;
}

var EditProductStore = $.extend({} , EventEmitter.prototype, {
  getProduct() {
    return _product;
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
  emitProductChange: function() {
    this.emit('productChange');
  },
  addProductChangeListener: function(callback) {
    this.on('productChange', callback);
  },
  removeProductChangeListener: function(callback) {
    this.removeListener('productChange', callback);
  }
});

AppDispatcher.register(function(payload) {
  switch(payload.actionName) {
    case Constants.events.VIEW_PRODUCT_ACT:
      _mode = 'view';
      EditProductStore.emitModeChange();
      break;
    case Constants.events.EDIT_PRODUCT_ACT:
      _mode = 'edit';
      EditProductStore.emitModeChange();
    break;
    default:
      return true;
  }

  return true;

});
module.exports = EditProductStore;
