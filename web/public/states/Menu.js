'use strict';
var Menu = function() {};
Menu.prototype = {
	preload: function() {
		
	},
	init: function() {
		var titlePaddingTop = 10,
			titlePaddingLeft = 10,
			self = this;			
		var titleStyle = { font: '32px Arial', fill: '#ffffff' };
		self.game.add.text(titlePaddingTop, titlePaddingLeft, 'Cook attitude', titleStyle);
		// TODO : Display : Connect as a client
		// TODO : Display : Connect as a shopper.
	}
};