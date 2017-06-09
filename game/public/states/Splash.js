var Splash = function () {};
Splash.prototype = {
	init: function() {
		this.loadingBar = this.game.make.text(this.game.world.centerX, 380, 'Loading assets ...', {fill: 'white'});
	},
	preload: function() {
		var self = this;
		var txtGroup = this.game.add.group();
		var bgGroup = this.game.add.group();
		var bg1Loader = this.game.load.image('bg1', 'styles/backgrounds/bg1.jpg');
		bg1Loader.onFileComplete.add(function() {
			bgGroup.add(self.game.add.tileSprite(0, 0, 980, 600, 'bg1'));
			txtGroup.add(self.loadingBar);
			self.game.world.bringToTop(txtGroup);
			// Load all NPCs.
			self.game.load.atlasJSONHash('warper', Constants.apiUrl + '/characters/warper.png', 'public/sprites/warper.json');
			// Load tilesets
			self.game.load.image('Town@64x64', Constants.apiUrl + '/maps/tilesets/Town@64x64.png');
			self.game.load.image('TownInterior@64x64', Constants.apiUrl + '/shops/tilesets/TownInterior@64x64.png');
			self.game.load.image('Shadows@64x64', Constants.apiUrl + '/maps/tilesets/Shadows@64x64.png');
			self.game.load.image('ShopShadows@64x64', Constants.apiUrl + '/shops/tilesets/Shadows@64x64.png');
			self.game.load.image('freePlace', Constants.apiUrl + '/maps/tilesets/freePlace.png');
			self.game.load.image('shop', Constants.apiUrl + '/maps/tilesets/shop.png');
			self.game.load.image('tiles', Constants.apiUrl + '/maps/tilesets/tiles.png');
			// Load player
			self.game.load.image('player', Constants.apiUrl + '/characters/phaser-dude.png');
			// Load states
			self.game.load.script('SplashGame', 'public/states/SplashGame.js');
			self.game.load.script('Connect', 'public/states/Connect.js');
			self.game.load.script('Menu', 'public/states/Menu.js');
			self.game.load.script('CharacterChooser', 'public/states/CharacterChooser.js');
			self.game.load.script('ShopChooser', 'public/states/ShopChooser.js');
			self.game.load.script('Game', 'public/states/Game.js');
			// Load main objects.
			self.game.load.script('BaseMap', 'public/game/baseMap.js');
			self.game.load.script('ShopMap', 'public/game/shopMap.js');
			self.game.load.script('CategoryMap', 'public/game/categoryMap.js');
			self.game.load.script('MainMap', 'public/game/mainMap.js');
			self.game.load.script('Player', 'public/game/Player.js');
			// Load utils.
			self.game.load.script('Calculator', 'public/utils/calculator.js');
			self.game.load.script('Configuration', 'public/utils/configuration.js');
			// Load modal windows.
			self.game.load.script('BaseModal', 'public/modals/baseModal.js');
			self.game.load.script('TchatModal', 'public/modals/tchatModal.js');
			self.game.load.script('MapModal', 'public/modals/mapModal.js');
			self.game.load.script('SettingsModal', 'public/modals/settingsModal.js');
			self.game.load.script('PauseModal', 'public/modals/pauseModal.js');
			self.game.load.script('WarperModal', 'public/modals/warperModal.js');
			// Load the stores
			self.game.load.script('GameStateStore', 'public/stores/gameStateStore.js');
			// Load the NPCs.
			self.game.load.script('BaseCharacter', 'public/characters/baseCharacter.js');
			self.game.load.script('Warper', 'public/characters/warper.js');
			// Load the clients
			self.game.load.script('CategoryClient', 'public/clients/categoryClient.js');
			self.game.load.script('ShopClient', 'public/clients/shopClient.js');
		}, this);
		bg1Loader.start();
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
