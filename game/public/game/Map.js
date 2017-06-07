'use strict';

var Map = function(key, tileMap, game) {
	var houseObj = null;
	this.key = key;
	this.tileMap = tileMap;
	this.game = game;
	this.npcs = [];
	this.overview = null;
	this.npcObjs = null;
	this.warps = null;
	this.playersGroup = null;
	this.player = null;
	this.players = [];
	this.warpRectangles = [];
	this.layers = {
		collision : null,
		ground: null,
		groundDecorations: null,
		shadows : null,
		houses1: null,
		houses2: null,
		decorations: null,
		walls: null
	},
	this.groups = {
		players: null,
		overviewPlayers: null
	};

	this.init = function() {
		var self = this;
		var deferredLoaded = [];
		// Load the images.
		this.tileMap.addTilesetImage('Town@64x64', 'Town@64x64');
		this.tileMap.addTilesetImage('Shadows@64x64', 'Shadows@64x64');
		this.tileMap.addTilesetImage('tiles', 'tiles');

		/*
		this.tileMap.addTilesetImage('tallgrass', 'tallgrass');
		this.tileMap.addTilesetImage('farming_fishing', 'farming_fishing');
		this.tileMap.addTilesetImage('plowed_soil', 'plowed_soil');
		this.tileMap.addTilesetImage('house', 'house');
		this.tileMap.addTilesetImage('freePlace', 'freePlace');
		this.tileMap.addTilesetImage('floor', 'floor');
		this.tileMap.addTilesetImage('stuff', 'stuff');
		this.tileMap.addTilesetImage('panel-info', 'panel-info');
		*/

		// Add layers.
		this.layers.collision = this.tileMap.createLayer('Collision');
		this.layers.ground = this.tileMap.createLayer('Ground');
		this.layers.groundDecorations = this.tileMap.createLayer('GroundDecorations');
		this.groups.players = game.add.group();
		this.layers.shadows = this.tileMap.createLayer('Shadows');
		this.layers.houses1 = this.tileMap.createLayer('Houses1');
		this.layers.houses2 = this.tileMap.createLayer('Houses2');
		this.layers.decorations = this.tileMap.createLayer('Decorations');
		this.layers.walls = this.tileMap.createLayer('Walls');
		var overviewCoordinate = Calculator.getOverviewImageCoordinate(game);
		var overviewSize = Configuration.getOverviewSize();
		this.overview = game.add.sprite(overviewCoordinate.x, overviewCoordinate.y, 'overview');
		this.overview.width = overviewSize.w;
		this.overview.height = overviewSize.h;
		this.overview.fixedToCamera = true;
		this.groups.overviewPlayers = game.add.group();
		this.groups.overviewPlayers.fixedToCamera = true;
		this.tileMap.createLayer('Wraps');

		/*
		// Create all the objects.
		this.warps = game.add.group();
		this.npcObjs = game.add.group();
		this.warps.enableBody = true;
		this.npcObjs.enableBody = true;
		var npcsObjs = tileMap.objects['Npcs'];
		var wps = tileMap.objects['Wraps'];
		// Create npcs.
		if (npcsObjs) {
			npcsObjs.forEach(function(npc) {
				var o = null;
				switch(npc.type) {
					case "warper":
						o = new Warper(game, npc);
					break;
					case "shop":
						var promise = $.Deferred();
						o = new Shop(game, npc, tileMap, category);
						o.init().then(function(obj) {
							if (obj.panelInfo == null || obj.warp == null || obj.map_id == null) {
								promise.resolve();
								return;
							}

							self.npcObjs.add(obj.panelInfo.getSprite());
							self.npcs.push([obj.panelInfo.getSprite(), obj.panelInfo ]);
							self.warps.add(obj.warp);
							self.warps.set(obj.warp, 'map', "shop_" + obj.map_id, false, false, 0, true);
							self.warps.set(obj.warp, 'warp_entry', 'warp', false, false, 0, true);
							self.warps.set(obj.warp, 'entry_dir', 'bottom', false, false, 0, true);
							self.warps.set(obj.warp, 'category', category, false, false, 0, true);
							promise.resolve();
						});
						deferredLoaded.push(promise);
					break;
					case "stock_manager":
						o = new StockManager(game, npc);
					break;
				}

				if (o == null) {
					return;
				}

				var sp = o.getSprite();
				self.npcObjs.add(sp);
				self.npcs.push([sp, o ]);
			});
		}

		// Create warps.
		if (wps) {
			wps.forEach(function(warp) {
				// Display warp.
				var warpRectangle = game.add.graphics(0, 0);
				warpRectangle.lineStyle(2, 0xd9d9d9, 1);
				warpRectangle.beginFill(0xFFFFFF, 1);
				warpRectangle.drawRect(warp.x, warp.y, warp.width, warp.height);
				self.warpRectangles.push(warpRectangle);
				// Add transparent warp into the group.
				var rect = game.add.sprite(warp.x, warp.y, null);
				game.physics.enable(rect, Phaser.Physics.ARCADE);
				rect.name = warp.name;
				rect.body.setSize(warp.width, warp.height, 0, 0);
				self.warps.add(rect);
				for (var property in warp.properties)
				{
					self.warps.set(rect, property, warp.properties[property], false, false, 0, true);
				}

				self.warps.set(rect, 'category', category, false, false, 0, true);
			});
		}
		*/

		// Specify which tile can collide.
		this.tileMap.setCollision(3, true, 'Collision');
		var result = $.Deferred();
		$.when.apply(null, deferredLoaded).done(function() {
			result.resolve();
		});

		return result.promise();
	};

	this.addPlayer = function(playerX, playerY, pseudo) {
		this.layers.ground.resizeWorld();
    game.world.setBounds(0, 0, game.world.width, game.world.height);
		this.player = new Player(null, playerX, playerY, game, true, pseudo, this.tileMap); // Set current player.
		this.player.sprite.body.collideWorldBounds = true;
		this.groups.players.add(this.player.sprite);
		this.groups.overviewPlayers.add(this.player.overviewSprite);
		game.camera.focusOnXY(playerX, playerY);
		game.camera.follow(this.player.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
	};

	this.display = function(isVisible) {
		if (this.layers.collision) this.layers.collision.visible = isVisible;
		if (this.layers.ground) this.layers.ground.visible = isVisible;
		if (this.layers.earth) this.layers.earth.visible = isVisible;
		if (this.layers.alimentation) this.layers.alimentation.visible = isVisible;
		this.npcs.forEach(function(npc) {
			npc[1].isVisible = isVisible;
		});

		if (this.warps) this.warps.visible = isVisible;
		if (this.npcObjs) this.npcObjs.visible = isVisible;
		if (this.player) this.player.display(isVisible);
		if (this.players) this.players.forEach(function(p) {
			p.display(isVisible);
		});
	};

	this.destroy = function() {
		// Destroy the layers
		if (this.layers.collision) this.layers.collision.destroy();
		if (this.layers.ground) this.layers.ground.destroy();
		if (this.layers.earth) this.layers.earth.destroy();
		if (this.layers.alimentation) this.layers.alimentation.destroy();

		// Destroy objects
		this.npcs.forEach(function(npc) {
			npc[1].destroy();
		});
		this.warpRectangles.forEach(function(warp) {
			warp.destroy();
		});
		this.players.forEach(function(p) {
			p.remove();
		});

		if (this.warps) this.warps.destroy();
		if (this.npcObjs) this.npcObjs.destroy();
		if (this.tileMap) this.tileMap.destroy();
		if (this.player) this.player.remove();
	};

	this.getNpcObjs = function() {
		return this.npcObjs;
	};

	this.getNpc = function(sprite) {
		var result = null;
		this.npcs.forEach(function(kvp) {
			if (kvp[0] == sprite) {
				result = kvp[1];
			}
		});

		return result;
	};

	this.getWarps = function() {
		return this.warps;
	};
};
