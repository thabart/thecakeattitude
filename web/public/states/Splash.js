var Splash = function () {};
Splash.prototype = {
	init: function() {
		this.loadingBar = this.game.make.text(this.game.world.centerX, 380, 'Loading...', {fill: 'white'});
	},
	preload: function() {		
		this.game.load.script('splash', 'public/states/Game.js');
		this.game.add.existing(this.loadingBar);
	},
	create: function() {
		var self = this;
		this.game.state.add('Game', Game);
		 setTimeout(function () {
		  self.game.state.start("Game");
		}, 1000);
	}
};