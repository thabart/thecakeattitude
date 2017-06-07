var Splash = function () {};
Splash.prototype = {
	init: function() {
		this.loadingBar = this.game.make.text(this.game.world.centerX, 380, 'Loading assets ...', {fill: 'white'});
	},
	preload: function() {
		// Load tilesets
		this.game.load.image('Town@64x64', Constants.apiUrl + '/maps/tilesets/Town@64x64.png');
		this.game.load.image('Shadows@64x64', Constants.apiUrl + '/maps/tilesets/Shadows@64x64.png');
		this.game.load.image('tiles', Constants.apiUrl + '/maps/tilesets/tiles.png');
		// Load player
		this.game.load.image('player', Constants.apiUrl + '/characters/phaser-dude.png');
		// Load states
		this.game.load.script('SplashGame', 'public/states/SplashGame.js');
		this.game.load.script('Connect', 'public/states/Connect.js');
		this.game.load.script('Menu', 'public/states/Menu.js');
		this.game.load.script('CharacterChooser', 'public/states/CharacterChooser.js');
		this.game.load.script('ShopChooser', 'public/states/ShopChooser.js');
		this.game.load.script('Game', 'public/states/Game.js');
		// Load main objects.
		this.game.load.script('Map', 'public/game/Map.js');
		this.game.load.script('Player', 'public/game/Player.js');
		// Load utils.
		this.game.load.script('Calculator', 'public/utils/calculator.js');
		this.game.load.script('Configuration', 'public/utils/configuration.js');
		// Load modal windows.
		this.game.load.script('TchatModal', 'public/modals/tchatModal.js');
		this.game.load.script('MapModal', 'public/modals/mapModal.js');
		// Load the stores
		this.game.load.script('GameStateStore', 'public/stores/gameStateStore.js');
		this.game.add.existing(this.loadingBar);
	},
	create: function() {
		var self = this;
		this.game.state.add('Connect', Connect);
		this.game.state.add('Menu', Menu);
		this.game.state.add('CharacterChooser', CharacterChooser);
		this.game.state.add('Game', Game);
		this.game.state.add('ShopChooser', ShopChooser);
		this.game.state.add('SplashGame', SplashGame);
		 setTimeout(function () {
			// self.game.state.start("Connect");
			var options = {
				isMainMap: true
			};
			self.game.state.start("SplashGame", true, false, options);
		}, 1000);
	}
};
