'use strict';
var ShopMap = function() { };
ShopMap.prototype = $.extend({}, BaseMap.prototype, {
	init: function(overviewKey, tileMap, game, opts) {
		var self = this;
		self.opts = opts;
		ShopMapStateStore.setShop(opts.shop); // Store the shop into the store.
		self.create(overviewKey, tileMap, game);
		self.layers = $.extend({}, self.layers, {
			ground: null,
			subFloor: null,
			shadows : null,
			walls: null,
			stairs: null,
			floorDecorations: null,
			furnitures: null,
			decorations: null
		});
		// Load the images.
		self.tileMap.addTilesetImage('TownInterior@64x64', 'TownInterior@64x64');
		self.tileMap.addTilesetImage('ShopShadows@64x64', 'ShopShadows@64x64');
		self.tileMap.addTilesetImage('tiles', 'tiles');
		// Create the layers.
		self.addCollisionLayer();
		self.layers.ground = self.tileMap.createLayer('Ground');
		self.layers.subFloor = self.tileMap.createLayer('SubFloor');
		self.layers.walls = self.tileMap.createLayer('Walls');
		self.layers.stairs = self.tileMap.createLayer('Stairs');
		self.layers.floorDecorations = self.tileMap.createLayer('FloorDecorations');
		self.addPlayersGroup();
		self.layers.shadows = self.tileMap.createLayer('Shadows');
		self.layers.furnitures = self.tileMap.createLayer('Furnitures');
		self.layers.decorations = self.tileMap.createLayer('Decorations');
		// Add overview image
		// self.addNpcsGroup();
		var npcObjs = self.getNpcObjs(); // Add NPCS.
    self.groups.npcs = self.game.add.group();
		if (npcObjs) {
			npcObjs.forEach(function(npc) {
				var o = null;
				switch(npc.type) {
					case "shop-section":
            o = new ShopSection();
						var productCategories = self.opts.shop.product_categories.filter(function(productCategory) { return npc.name === productCategory.shop_section_name });
						if (productCategories && productCategories.length !== 1) {
							o.initFree(self.game, npc);
						} else {
							var productCategory = productCategories[0];
							o.initTaken(self.game, npc);
						}
					break;
					case "informer":
            o = new Informer();
            o.init(self.game, npc);
					break;
				}

				if (o !== null) {
					self.npcs.push(o);
					self.groups.npcs.add(o.getSprite());
				}
			});
		}

		self.addOverviewImage();
		self.addOverviewPlayersGroup();
		self.trackSizeChanged();
		self.addWarpsGroup({categoryId: opts.categoryId, place: opts.place, shop: opts.shop});
		self.layers.ground.resizeWorld();
		game.world.setBounds(0, 0, self.game.world.width, self.game.world.height);
		AppDispatcher.register(function(obj) {
			if (obj.actionName === 'update-shop' && obj.data && obj.data.id === opts.shop.id) {
				console.log('shop has been updated');
			}
		});
  },
	getDefaultPlayerCoordinate: function() {
		var self = this;
		if (self.opts.entry === 'underground') {
			var warpFrame = self.game.cache.getFrameData('warp').getFrame(0);
			var result = self.getWarpCoordinate('underground_portal');
			result.x = result.x + warpFrame.width + 20;
			result.y = result.y + warpFrame.height + 60;
			return result;
		} else {
			return self.getEntryWarpCoordinate();
		}
	},
	destroy: function() {
		var self = this;
		self.commonDestroy();

	}
});
