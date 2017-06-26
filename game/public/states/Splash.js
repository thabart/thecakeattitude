var Splash = function () {};
Splash.prototype = {
	init: function() {
		var self = this;
		var messageCoordinage = Calculator.getLoadingMessageCoordinage(self.game);
		self.loadingBar = self.game.make.text(messageCoordinage.x, 380, $.i18n('loadingAssets'), {fill: 'white'});
		GameStateStore.onSizeChanged.call(this, function(size) {
			var coordinate = Calculator.getBgCoordinate(size, self.game, 'bg1');
			var messageCoordinage = Calculator.getLoadingMessageCoordinage(self.game);
			if (self.bg && self.bg !== null) self.bg.x = coordinate.x;
			if (self.loadingBar && self.loadingBar !== null) self.loadingBar.x = messageCoordinage.x;
		});
	},
	preload: function() {
		var self = this;
		var txtGroup = this.game.add.group();
		var bgGroup = this.game.add.group();
		var bg1Loader = this.game.load.image('bg1', 'styles/backgrounds/bg1.jpg');
		self.game.load.image('bg2', 'styles/backgrounds/bg2.jpg');
		self.game.load.image('bg3', 'styles/backgrounds/bg3.jpg');
		self.game.load.image('bg4', 'styles/backgrounds/bg4.jpg');
		bg1Loader.onFileComplete.add(function(e, f) {
			if (f === 'bg1') {
				var coordinate = Calculator.getBgCoordinate(GameStateStore.getSize(), self.game, 'bg1');
				self.bg = self.game.add.tileSprite(coordinate.x, 0, coordinate.w, self.game.world.height, 'bg1');
				bgGroup.add(self.bg);
				txtGroup.add(self.loadingBar);
				self.game.world.bringToTop(txtGroup);
			}
		}, this);
		// Load all NPCs & animations.
		self.game.load.atlasJSONHash('warper', '/styles/characters/npc-men.png', 'public/sprites/warper.json');
		self.game.load.atlasJSONHash('stockManager', '/styles/characters/npc-men.png', 'public/sprites/stockManager.json');
		self.game.load.atlasJSONHash('crier', '/styles/characters/npc-men.png', 'public/sprites/crier.json');
		self.game.load.atlasJSONHash('informer', '/styles/characters/npc-men.png', 'public/sprites/informer.json');
		self.game.load.atlasJSONHash('player', '/styles/players/acolyte-m.png', 'public/sprites/acolyte.json');
		self.game.load.atlasJSONHash('blackHeadsWomen', '/styles/players/black-heads-women.png', 'public/sprites/blackHeadsWomen.json');
		self.game.load.atlasJSONHash('blackHeadsMen', '/styles/players/blackHeadsMen.png', 'public/sprites/blackHeadsMen.json');
		// self.game.load.image('player', '/styles/characters/phaser-dude.png');
		self.game.load.atlasJSONHash('warp', Constants.apiUrl + '/maps/tilesets/warp.png', 'public/sprites/warp.json');
		self.game.load.spritesheet('freeShopSection', '/styles/characters/shadow_npc.png', 72, 39, 35);
		// Load tilesets
		self.game.load.image('Town@64x64', Constants.apiUrl + '/maps/tilesets/Town@64x64.png');
		self.game.load.image('TownInterior@64x64', Constants.apiUrl + '/shops/tilesets/TownInterior@64x64.png');
		self.game.load.image('Shadows@64x64', Constants.apiUrl + '/maps/tilesets/Shadows@64x64.png');
		self.game.load.image('ShopShadows@64x64', Constants.apiUrl + '/shops/tilesets/Shadows@64x64.png');
		self.game.load.image('freePlace', Constants.apiUrl + '/maps/tilesets/freePlace.png');
		self.game.load.image('takenShopSection', Constants.apiUrl + '/shops/tilesets/shop-section.png');
		self.game.load.image('shop', Constants.apiUrl + '/maps/tilesets/shop.png');
		self.game.load.image('tiles', Constants.apiUrl + '/maps/tilesets/tiles.png');
		// Load states
		self.game.load.script('SplashGame', 'public/states/SplashGame.js');
		self.game.load.script('Connect', 'public/states/Connect.js');
		self.game.load.script('Menu', 'public/states/Menu.js');
		self.game.load.script('MyShops', 'public/states/MyShops.js');
		self.game.load.script('ShopChooser', 'public/states/ShopChooser.js');
		self.game.load.script('Game', 'public/states/Game.js');
		// Load main objects.
		self.game.load.script('BaseMap', 'public/game/baseMap.js');
		self.game.load.script('ShopMap', 'public/game/shopMap.js');
		self.game.load.script('UndergroundMap', 'public/game/undergroundMap.js');
		self.game.load.script('CategoryMap', 'public/game/categoryMap.js');
		self.game.load.script('MainMap', 'public/game/mainMap.js');
		self.game.load.script('Player', 'public/game/Player.js');
		// Load utils.
		self.game.load.script('Configuration', 'public/utils/configuration.js');
		self.game.load.script('GoogleMapUtils', 'public/utils/GoogleMapUtils.js');
		self.game.load.script('HrefUtils', 'public/utils/href.js');
		self.game.load.script('Guid', 'public/utils/guid.js');
		// Load modal windows.
		self.game.load.script('BaseModal', 'public/modals/baseModal.js');
		self.game.load.script('EditProfileModal', 'public/modals/editProfileModal.js');
		self.game.load.script('TchatModal', 'public/modals/tchatModal.js');
		self.game.load.script('MapModal', 'public/modals/mapModal.js');
		self.game.load.script('SettingsModal', 'public/modals/settingsModal.js');
		self.game.load.script('PauseModal', 'public/modals/pauseModal.js');
		self.game.load.script('WarperModal', 'public/modals/warperModal.js');
		self.game.load.script('FreePlaceModal', 'public/modals/freePlaceModal.js');
		self.game.load.script('LoginModal', 'public/modals/loginModal.js');
		self.game.load.script('MenuModal', 'public/modals/menuModal.js');
		self.game.load.script('ShopSectionModal', 'public/modals/shopSectionModal.js');
		self.game.load.script('AddProductcategoryModal', 'public/modals/addProductcategoryModal.js');
		self.game.load.script('ShopChooserModal', 'public/modals/shopChooserModal.js');
		self.game.load.script('EmoticonsSelectorModal', 'public/modals/emoticonsSelectorModal.js');
		self.game.load.script('MyShopsSelectorModal', 'public/modals/myShopsSelectorModal.js');
		self.game.load.script('StockManagerModal', 'public/modals/stockManagerModal.js');
		self.game.load.script('AddProductModal', 'public/modals/addProductModal.js');
		self.game.load.script('CrierModal', 'public/modals/crierModal.js');
		self.game.load.script('InformerModal', 'public/modals/informerModal.js');
		self.game.load.script('ShopSectionPresentationTab', 'public/modals/shopSectionModalTabs/presentation.js');
		self.game.load.script('ShopSectionSearchProductsTab', 'public/modals/shopSectionModalTabs/searchProducts.js');
		self.game.load.script('FreePlaceModalDescriptionTab', 'public/modals/freePlaceModalTabs/freePlaceModalDescriptionTab.js');
		self.game.load.script('FreePlaceModalAddressTab', 'public/modals/freePlaceModalTabs/freePlaceModalAddressTab.js');
		self.game.load.script('FreePlaceModalContactTab', 'public/modals/freePlaceModalTabs/freePlaceModalContactTab.js');
		self.game.load.script('FreePlaceModalPaymentTab', 'public/modals/freePlaceModalTabs/freePlaceModalPaymentTab.js');
		self.game.load.script('WarperCurrentUserShopsTab', 'public/modals/warperModalTabs/warperCurrentUserShopsTab.js');
		self.game.load.script('WarperMapsTab', 'public/modals/warperModalTabs/warperMapsTab.js');
		self.game.load.script('WarperShopsTab', 'public/modals/warperModalTabs/warperShopsTab.js');
		self.game.load.script('CrierModalDescriptionTab', 'public/modals/crierModalTabs/description.js');
		self.game.load.script('CrierModalAddressTab', 'public/modals/crierModalTabs/address.js');
		self.game.load.script('AddProductDescriptionTab', 'public/modals/addProductModalTabs/description.js');
		self.game.load.script('AddProductCharacteristicTab', 'public/modals/addProductModalTabs/characteristics.js');
		// Load floating menu.
		self.game.load.script('ProfileMenuFloating', 'public/floating/profile.js');
		self.game.load.script('BackMenuFloating', 'public/floating/back.js');
		// Load the components.
		self.game.load.script('AddressSearch', 'public/components/addressSearch.js');
		self.game.load.script('SelectCategory', 'public/components/selectCategory.js');
		// Load the NPCs.
		self.game.load.script('BaseCharacter', 'public/characters/baseCharacter.js');
		self.game.load.script('Warper', 'public/characters/warper.js');
		self.game.load.script('FreePlace', 'public/characters/freePlace.js');
		self.game.load.script('ShopSection', 'public/characters/shopSection.js');
		self.game.load.script('StockManager', 'public/characters/stockManager.js');
		self.game.load.script('Crier', 'public/characters/crier.js');
		self.game.load.script('Informer', 'public/characters/informer.js');
		// Load the animations
		self.game.load.script('WarpAnimation', 'public/animations/warpAnimation.js');
		// Load the clients
		self.game.load.script('CategoryClient', 'public/clients/categoryClient.js');
		self.game.load.script('ShopClient', 'public/clients/shopClient.js');
		self.game.load.script('TagsClient', 'public/clients/tagsClient.js');
		self.game.load.script('GoogleMapService', 'public/clients/googleMapService.js');
		self.game.load.script('OpenIdClient', 'public/clients/openIdClient.js');
		self.game.load.script('UserClient', 'public/clients/userClient.js');
		// Load the emoticons.
		self.game.load.spritesheet('sorry', 'styles/emoticons/sorry.png', 32, 50, 25);
		self.game.load.spritesheet('love-eyes', 'styles/emoticons/love-eyes.png', 31, 24, 5);
		self.game.load.spritesheet('money', 'styles/emoticons/money.png', 27, 24, 6);
		self.game.load.spritesheet('love', 'styles/emoticons/love.png', 112, 97, 29);
		self.game.load.spritesheet('thanks', 'styles/emoticons/thx.png', 43, 43, 22);
		bg1Loader.start();
	},
	create: function() {
		var self = this;
		this.game.state.add('Connect', Connect);
		this.game.state.add('Menu', Menu);
		this.game.state.add('MyShops', MyShops);
		this.game.state.add('Game', Game);
		this.game.state.add('ShopChooser', ShopChooser);
		this.game.state.add('SplashGame', SplashGame);
		 setTimeout(function () {
			self.game.state.start('Connect');
			// self.game.state.start('ShopChooser');
			// self.game.state.start('MyShops');
			// self.game.state.start('Menu');
			// self.game.state.start("Connect");
			/*
			var options = {
				isMainMap: true
			};
			self.game.state.start("SplashGame", true, false, options);
			*/
		}, 1000);
	},
	shutdown: function() {
		GameStateStore.offSizeChanged.call(this);
	}
};
