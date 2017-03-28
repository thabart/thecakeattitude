var Splash = function () {};
Splash.prototype = {
	init: function() {
		this.loadingBar = this.game.make.text(this.game.world.centerX, 380, 'Loading...', {fill: 'white'});
	},
	preload: function() {		
		this.game.add.existing(this.loadingBar);
	},
	create: function() {
		
	}
};