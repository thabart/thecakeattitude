'use strict';
var MainMap = function() { };
MainMap.prototype = $.extend({}, BaseMap.prototype, {
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
		self.groups = $.extend({}, self.groups, {
			houses: null
		});
		// Load the images.
		self.tileMap.addTilesetImage('Town@64x64', 'Town@64x64');
		self.tileMap.addTilesetImage('Shadows@64x64', 'Shadows@64x64');
		self.tileMap.addTilesetImage('tiles', 'tiles');
		// Create the layers.
		self.addCollisionLayer();
		self.layers.ground = self.tileMap.createLayer('Ground');
		self.layers.groundDecorations = self.tileMap.createLayer('GroundDecorations');
		self.groups.houses = self.game.add.group();
		self.addPlayersGroup();
		self.layers.shadows = self.tileMap.createLayer('Shadows');
		self.layers.decorations = self.tileMap.createLayer('Decorations');
		self.layers.walls = self.tileMap.createLayer('Walls');
		// Add overview image
		self.addNpcsGroup();
		self.addOverviewImage();
		self.trackSizeChanged();
		self.addOverviewPlayersGroup();

		var player = game.add.sprite(200, 200, 'acolyte'); // Add sprites.
		var animationName = "secondBottom";
		var heads = {
			"firstBottom": {
				"indexes": [1],
				"relativeX": 4,
				"relativeY": -23
			},
			"secondBottom": {
				"indexes": [2],
				"relativeX": 6,
				"relativeY": -20
			},
			"thirdBottom": {
				"indexes": [3],
				"relativeX": 5,
				"relativeY": -20
			}
		};
		var headProperties = heads[animationName];
		var blackHead = game.add.sprite(headProperties.relativeX, headProperties.relativeY, 'blackHeadsMen');
		blackHead.animations.add(animationName, headProperties.indexes);
		player.animations.add('stay', [0]);
		var goDown = player.animations.add('goDown', [1, 2, 3, 4, 5, 6, 7, 8]);
		goDown.enableUpdate = true;
		goDown.onUpdate.add(function() {
			var relativeX = headProperties.relativeX;
			if ($.inArray(goDown.frame, [2, 4])) { // 13
				blackHead.x = relativeX;
			}

			if ($.inArray(goDown.frame, [1, 5])) { // 12
				blackHead.x = relativeX - 1;
			}
		}, self);
    player.animations.play('goDown', 10, true); // Play animtions. // FPS = 10
		blackHead.animations.play(animationName);
		player.addChild(blackHead);

		// Resize the world & set boundaries.
		self.layers.ground.resizeWorld();
		game.world.setBounds(0, 0, self.game.world.width, self.game.world.height);
	}
});
