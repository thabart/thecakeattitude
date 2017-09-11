var AppDispatcher = require('../appDispatcher');
var EventEmitter = require('events').EventEmitter;
var $ = require('jquery');
import Constants from '../../Constants';

var _order = {};

function loadOrder(order) {
  _order = order;
}

var PrintOrderLabelStore = $.extend({} , EventEmitter.prototype, {
});

AppDispatcher.register(function(payload) {

});
module.exports = PrintOrderLabelStore;
