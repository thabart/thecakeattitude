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
			// Load all NPCs & animations.
			self.game.load.atlasJSONHash('warper', Constants.apiUrl + '/characters/npc.png', 'public/sprites/warper.json');
			self.game.load.atlasJSONHash('warp', Constants.apiUrl + '/maps/tilesets/warp.png', 'public/sprites/warp.json');
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
			self.game.load.script('GoogleMapUtils', 'public/utils/GoogleMapUtils.js');
			// Load modal windows.
			self.game.load.script('BaseModal', 'public/modals/baseModal.js');
			self.game.load.script('TchatModal', 'public/modals/tchatModal.js');
			self.game.load.script('MapModal', 'public/modals/mapModal.js');
			self.game.load.script('SettingsModal', 'public/modals/settingsModal.js');
			self.game.load.script('PauseModal', 'public/modals/pauseModal.js');
			self.game.load.script('WarperModal', 'public/modals/warperModal.js');
			self.game.load.script('FreePlaceModal', 'public/modals/freePlaceModal.js');
			self.game.load.script('FreePlaceModalDescriptionTab', 'public/modals/freePlaceModalTabs/freePlaceModalDescriptionTab.js');
			self.game.load.script('FreePlaceModalAddressTab', 'public/modals/freePlaceModalTabs/freePlaceModalAddressTab.js');
			self.game.load.script('FreePlaceModalContactTab', 'public/modals/freePlaceModalTabs/freePlaceModalContactTab.js');
			self.game.load.script('FreePlaceModalPaymentTab', 'public/modals/freePlaceModalTabs/freePlaceModalPaymentTab.js');
			self.game.load.script('WarperCurrentUserShopsTab', 'public/modals/warperModalTabs/warperCurrentUserShopsTab.js');
			self.game.load.script('WarperMapsTab', 'public/modals/warperModalTabs/warperMapsTab.js');
			self.game.load.script('WarperShopsTab', 'public/modals/warperModalTabs/warperShopsTab.js');
			// Load the NPCs.
			self.game.load.script('BaseCharacter', 'public/characters/baseCharacter.js');
			self.game.load.script('Warper', 'public/characters/warper.js');
			self.game.load.script('FreePlace', 'public/characters/freePlace.js');
			// Load the animations
			self.game.load.script('WarpAnimation', 'public/animations/warpAnimation.js');
			// Load the clients
			self.game.load.script('CategoryClient', 'public/clients/categoryClient.js');
			self.game.load.script('ShopClient', 'public/clients/shopClient.js');
			self.game.load.script('TagsClient', 'public/clients/tagsClient.js');
			self.game.load.script('GoogleMapService', 'public/clients/googleMapService.js');
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
