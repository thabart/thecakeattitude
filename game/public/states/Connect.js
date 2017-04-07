'use strict';
var Connect = function() {};
Connect.prototype = {
	preload: function() {
		
	},
	init: function() {
		var titlePaddingTop = 10,
			titlePaddingLeft = 10,
			playWidth = 341,
			playHeight = 111,
			self = this;			
		var titleStyle = { font: '32px Arial', fill: '#ffffff' };
		// self.game.add.tileSprite(0, 0, 1000, 480, 'background');
		self.game.add.text(titlePaddingTop, titlePaddingLeft, 'Connect', titleStyle);
		// TODO : Display : Display a modal window to connect.
		this.start = this.game.add.button(this.game.width - playWidth, this.game.height - playHeight, 'start', function() {
			self.game.state.start("Menu");
		}, this, 2, 1, 0);
	}	
};