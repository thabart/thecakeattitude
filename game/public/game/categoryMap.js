'use strict';
var CategoryMap = function() { };
CategoryMap.prototype = $.extend({}, BaseMap.prototype, {
	init: function(overviewKey, tileMap, game, categoryId) {
		var self = this;
		self.create(overviewKey, tileMap, game);
		self.layers = $.extend({}, self.layers, {
			ground: null,
			groundDecorations: null,
			shadows : null,
			houses1: null,
			houses2: null,
			decorations: null,
			walls: null
		});
		self.groups = $.extend({}, self.groups, {
			shops: null,
			freePlaces: null
		});
		// Load the images.
		self.tileMap.addTilesetImage('Town@64x64', 'Town@64x64');
		self.tileMap.addTilesetImage('Shadows@64x64', 'Shadows@64x64');
		self.tileMap.addTilesetImage('tiles', 'tiles');
		// Create the layers.
		self.addCollisionLayer();
		self.layers.ground = self.tileMap.createLayer('Ground');
		self.layers.groundDecorations = self.tileMap.createLayer('GroundDecorations');
		self.groups.freePlaces = self.game.add.group();
		self.addPlayersGroup();
		self.layers.shadows = self.tileMap.createLayer('Shadows');
		self.layers.houses1 = self.tileMap.createLayer('Houses1');
		self.layers.houses2 = self.tileMap.createLayer('Houses2');
		self.groups.shops = self.game.add.group();
		self.layers.decorations = self.tileMap.createLayer('Decorations');
		self.layers.walls = self.tileMap.createLayer('Walls');
		// Add overview image
		self.addNpcsGroup();
    self.groups.warps = self.game.add.group();
		var shopsObj = self.tileMap.objects['Houses'];
		if (shopsObj) {
			var freePlaceImage = self.game.cache.getImage('freePlace'),
				shopImage = self.game.cache.getImage('shop'),
				warpFrame = self.game.cache.getFrameData('warp').getFrame(0);
			ShopClient.searchShops({category_id : [ categoryId ] }).then(function(r) {
				var embeddedShops = r._embedded;
				if (!(embeddedShops instanceof Array)) {
					embeddedShops = [embeddedShops];
				}

				shopsObj.forEach(function(shopObj) {
					var f = embeddedShops.filter(function(embeddedShop) { return embeddedShop.place === shopObj.name });
					if (f && f.length > 0) {
						var shopX = shopObj.x + freePlaceImage.width - shopImage.width;
						var shopY = shopObj.y - shopImage.height;
						var warpX = shopX + (shopImage.width / 2) - warpFrame.width / 2;
						var warpY = shopY + (shopImage.height);
						var shopSpr = self.game.add.sprite(shopX, shopY, 'shop'); // Add shop.
						self.groups.shops.add(shopSpr);
						var warp = self.game.add.sprite(warpX, warpY, 'warp');
						warp.animations.add('stay');
						warp.animations.play('stay', 10, true);
						self.game.physics.enable(warp, Phaser.Physics.ARCADE); // Add warp.
						self.groups.warps.add(warp);
						var targetMapPath = Constants.apiUrl + f[0].map.map_link,
							targetOverviewPath = Constants.apiUrl + f[0].map.overview_link;
						self.groups.warps.set(warp, 'target_map_path', targetMapPath, false, false, 0, true);
						self.groups.warps.set(warp, 'target_overview_path', targetOverviewPath, false, false, 0, true);
					} else {
						var shopSpr = self.game.add.sprite(shopObj.x, shopObj.y - freePlaceImage.height, 'freePlace');
						self.groups.freePlaces.add(shopSpr);
					}
				});
			});
		}

		self.addOverviewImage();
		self.addOverviewPlayersGroup();

		// Resize the world & set boundaries.
		self.layers.ground.resizeWorld();
		game.world.setBounds(0, 0, self.game.world.width, self.game.world.height);
	}
});
