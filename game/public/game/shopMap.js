'use strict';
var ShopMap = function() { };
ShopMap.prototype = $.extend({}, BaseMap.prototype, {
	init: function(overviewKey, tileMap, game) {
		var self = this;
		self.create(overviewKey, tileMap, game);
		self.layers = $.extend({}, self.layers, {
			ground: null,
			subFloor: null,
			shadows : null,
			walls: null,
			stairs: null,
			groundDecorations: null,
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
		self.layers.shadows = self.tileMap.createLayer('Shadows');
		self.layers.walls = self.tileMap.createLayer('Walls');
		self.layers.stairs = self.tileMap.createLayer('Stairs');
		self.addPlayersGroup();
		self.layers.groundDecorations = self.tileMap.createLayer('GroundDecorations');
		self.layers.decorations = self.tileMap.createLayer('Decorations');
		// Add overview image
		self.addOverviewPlayersGroup();
		self.addNpcsGroup();
		self.addWarpsGroup();
		self.layers.ground.resizeWorld();
		game.world.setBounds(0, 0, self.game.world.width, self.game.world.height);
  }
});
