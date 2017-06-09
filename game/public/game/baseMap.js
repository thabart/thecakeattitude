'use strict';
var BaseMap = function() { };
BaseMap.prototype = {
  create: function(overviewKey, tileMap, game) {
    var self = this;
    self.game = game;
    self.tileMap = tileMap;
    self.overviewKey = overviewKey;
  	self.overview = null; // overview image.
  	self.npcs = []; // list of npcs.
  	self.currentPlayer = null; // current player.
  	self.players = []; // other players.
  	self.layers = { // layers displayed or not on the map.
  		collision : null
  	};
  	self.groups = { // group of objects
  		players: null,
  		overviewPlayers: null,
  		warps: null,
  		npcs: null
  	};
  },
  addCollisionLayer: function() {
    this.layers.collision = this.tileMap.createLayer('Collision'); // Create collision layer.
		this.tileMap.setCollision(3, true, 'Collision');
  },
  addOverviewImage: function() {
    var self = this;
    var overviewCoordinate = Calculator.getOverviewImageCoordinate(self.game);
    var overviewSize = Configuration.getOverviewSize();
		self.overview = self.game.add.sprite(overviewCoordinate.x, overviewCoordinate.y, self.overviewKey);
		self.overview.width = overviewSize.w;
		self.overview.height = overviewSize.h;
		self.overview.fixedToCamera = true;
  },
  addOverviewPlayersGroup: function() {
    var self = this;
    self.groups.overviewPlayers = self.game.add.group();
    self.groups.overviewPlayers.fixedToCamera = true;
  },
  addNpcsGroup: function() {
    var self = this;
    self.groups.npcs = self.game.add.group();
		var npcObjs = self.tileMap.objects['Npcs'];
		if (npcObjs) { // Create the NPCs.
			npcObjs.forEach(function(npc) {
				var o = null;
				switch(npc.type) {
					case "warper":
						o = new Warper();
						o.init(self.game, npc);
					break;
				}

				if (o !== null) {
					self.npcs.push(o);
					self.groups.npcs.add(o.getSprite());
				}
			});
		}
  },
  addWarpsGroup: function() {
    var self = this;
    self.groups.warps = self.game.add.group();
		var warpObjs = self.tileMap.objects['Warps'];
		if (warpObjs) { // Create the warps.
			warpObjs.forEach(function(warpObj) {
				var warp = self.game.add.sprite(warpObj.x, warpObj.y, null);
				self.game.physics.enable(warp, Phaser.Physics.ARCADE);
				warp.name = warpObj.name;
				warp.body.setSize(warpObj.width, warpObj.height, 0, 0);
				self.groups.warps.add(warp);
				for (var property in warpObj.properties) {
					self.groups.warps.set(warp, property, warpObj.properties[property], false, false, 0, true);
				}
			});
		}
  },
  addPlayersGroup: function() {
    this.groups.players = this.game.add.group();
  },
	setCurrentPlayer: function(playerX, playerY, pseudo) {
    var self = this;
		self.currentPlayer = new Player(null, playerX, playerY, self.game, true, pseudo, self.tileMap);
		self.currentPlayer.sprite.body.collideWorldBounds = true;
		self.groups.overviewPlayers.add(self.currentPlayer.overviewSprite);
		self.game.camera.focusOnXY(playerX, playerY);
		self.game.camera.follow(self.currentPlayer.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    self.groups.players.add(self.currentPlayer.sprite);
	},
	destroy: function() {
		for (var layer in this.layers) {
			if (this.layers[layer]) this.layers[layer].destroy();
		}

		for (var group in this.groups) {
			if (this.groups[group]) this.groups[group].destroy();
		}

		this.players.forEach(function(p) { p.destroy() });
		this.currentPlayer.destroy();
		this.npcs.forEach(function(npc) { npc.destroy(); });
	}
};
