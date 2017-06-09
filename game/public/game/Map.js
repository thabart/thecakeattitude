'use strict';

var Map = function(key, overviewKey, tileMap, game) {
	var houseObj = null;
	this.key = key;
	this.overviewKey = overviewKey;
	this.tileMap = tileMap;
	this.game = game;
	this.overview = null; // overview image.
	this.npcs = []; // list of npcs.
	this.player = null; // current player.
	this.players = []; // other players.
	this.layers = { // layers displayed or not on the map.
		collision : null,
		ground: null,
		groundDecorations: null,
		shadows : null,
		houses1: null,
		houses2: null,
		decorations: null,
		walls: null
	},
	this.groups = { // group of objects
		players: null,
		overviewPlayers: null,
		warps: null,
		npcs: null
	};

	this.init = function() {
		var self = this;
		var deferredLoaded = [];
		// Load the images.
		self.tileMap.addTilesetImage('Town@64x64', 'Town@64x64');
		self.tileMap.addTilesetImage('Shadows@64x64', 'Shadows@64x64');
		self.tileMap.addTilesetImage('tiles', 'tiles');
		// Add layers.
		self.layers.collision = self.tileMap.createLayer('Collision');
		self.layers.ground = self.tileMap.createLayer('Ground');
		self.layers.groundDecorations = self.tileMap.createLayer('GroundDecorations');
		self.groups.players = game.add.group();
		self.layers.shadows = self.tileMap.createLayer('Shadows');
		self.layers.houses1 = self.tileMap.createLayer('Houses1');
		self.layers.houses2 = self.tileMap.createLayer('Houses2');
		self.layers.decorations = self.tileMap.createLayer('Decorations');
		self.layers.walls = self.tileMap.createLayer('Walls');
		var overviewCoordinate = Calculator.getOverviewImageCoordinate(game);
		var overviewSize = Configuration.getOverviewSize();
		self.overview = game.add.sprite(overviewCoordinate.x, overviewCoordinate.y, self.overviewKey);
		self.overview.width = overviewSize.w;
		self.overview.height = overviewSize.h;
		self.overview.fixedToCamera = true;
		self.groups.overviewPlayers = game.add.group();
		self.groups.overviewPlayers.fixedToCamera = true;
		self.groups.npcs = game.add.group();

		var npcObjs = self.tileMap.objects['Npcs'];
		if (npcObjs) { // Create the NPCs.
			npcObjs.forEach(function(npc) {
				var o = null;
				switch(npc.type) {
					case "warper":
						o = new Warper();
						o.init(game, npc);
					break;
				}

				if (o !== null) {
					self.npcs.push(o);
					self.groups.npcs.add(o.getSprite());
				}
			});
		}

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
		for (var layer in this.layers) {
			if (this.layers[layer]) this.layers[layer].destroy();
		}

		for (var group in this.groups) {
			if (this.groups[group]) this.groups[group].destroy();
		}

		this.players.forEach(function(p) { p.destroy() });
		this.player.destroy();
		this.npcs.forEach(function(npc) { npc.destroy(); });
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
