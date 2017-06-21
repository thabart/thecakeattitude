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
          case "shop-section":
            o = new ShopSection();
            o.init(self.game, npc);
          break;
          case "stockManager":
            o = new StockManager();
            o.init(self.game, npc);
          break;
          case "crier":
            o = new Crier();
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
  addWarpsGroup: function(opts) {
    var self = this;
    self.groups.warps = self.game.add.group();
		var warpObjs = self.tileMap.objects['Warps'];
		if (warpObjs) { // Create the warps.
			warpObjs.forEach(function(warpObj) {
        var newOpts = $.extend({}, opts);
				var warp = self.game.add.sprite(warpObj.x, warpObj.y, 'warp');
        warp.animations.add('stay');
        warp.animations.play('stay', 10, true);
				self.game.physics.enable(warp, Phaser.Physics.ARCADE);
				self.groups.warps.add(warp);
				for (var property in warpObj.properties) {
					self.groups.warps.set(warp, property, warpObj.properties[property], false, false, 0, true);
          if (property === 'typeMap') {
            newOpts.typeMap = warpObj.properties[property];
          }

          if (property === 'map_name') {
            newOpts.mapName = warpObj.properties[property];
          }
				}

        if (opts) {
          self.groups.warps.set(warp, 'others', newOpts, false, false, 0, true);
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
  getDefaultPlayerCoordinate: function() {
    return this.getEntryWarpCoordinate();
  },
  getEntryWarpCoordinate: function() {
    return this.getWarpCoordinate('entry_portal');
  },
  getWarpCoordinate: function(name) {
    var self = this;
		var warpObjs = self.tileMap.objects['Warps'];
    if (!warpObjs) return null;
    var filteredWarps = warpObjs.filter(function(warp) { return warp.name === name });
    if (!filteredWarps || filteredWarps.length === 0) {
      return null;
    }

    var x = filteredWarps[0].x,
      y = filteredWarps[0].y,
      playerFrame = self.game.cache.getImage('player');
    y = y - playerFrame.height;
    return { x : x, y : y };
  },
  trackSizeChanged: function() { // Update overview map on size changed.
    var self = this;
    GameStateStore.onSizeChanged.call(this, function(d) {
      var overviewCoordinate = Calculator.getOverviewImageCoordinate(self.game);
      var overviewSize = Configuration.getOverviewSize();
      self.overview.cameraOffset.x = overviewCoordinate.x;
      self.overview.cameraOffset.y = overviewCoordinate.y;
      for(var key in self.layers) {
        var layer = self.layers[key];
        if (layer === null || !layer) continue;
        layer.resize(d.w, d.h);
      }

      if (self.currentPlayer && self.currentPlayer !== null) {
        self.currentPlayer.updateOverviewPosition(self.currentPlayer.getX(), self.currentPlayer.getY());
      }
    });
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
    GameStateStore.offSizeChanged.call(this);
	}
};
