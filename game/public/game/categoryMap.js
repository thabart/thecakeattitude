'use strict';
var CategoryMap = function() { };
CategoryMap.prototype = $.extend({}, BaseMap.prototype, {
	init: function(overviewKey, tileMap, game) {
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
		// Load the images.
		self.tileMap.addTilesetImage('Town@64x64', 'Town@64x64');
		self.tileMap.addTilesetImage('Shadows@64x64', 'Shadows@64x64');
		self.tileMap.addTilesetImage('tiles', 'tiles');
		// Create the layers.
		self.addCollisionLayer();
		self.layers.ground = self.tileMap.createLayer('Ground');
		self.layers.groundDecorations = self.tileMap.createLayer('GroundDecorations');
		self.addPlayersGroup();
		self.layers.shadows = self.tileMap.createLayer('Shadows');
		self.layers.houses1 = self.tileMap.createLayer('Houses1');
		self.layers.houses2 = self.tileMap.createLayer('Houses2');
		self.layers.decorations = self.tileMap.createLayer('Decorations');
		self.layers.walls = self.tileMap.createLayer('Walls');
		// Add overview image
		self.addOverviewPlayersGroup();
		self.addNpcsGroup();
		self.addWarpsGroup();
		// Resize the world & set boundaries.
		self.layers.ground.resizeWorld();
		game.world.setBounds(0, 0, self.game.world.width, self.game.world.height);
	}
});
