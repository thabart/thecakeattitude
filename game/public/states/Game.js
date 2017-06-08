var Game = function () {
	this.map = null;
	this.cursors = null;
	this.socket = null;
	this.isFocusLost = false;
	this.preventUpdate = false;
	var spaceBar = null,
		currentNpc = null,
		worldScale = null,
		previousScale = null;
	this.getPlayerPosition = function(warp, wps, playerHeight, playerWidth) {
		var map = warp.map;
		var warpEntryName = warp.warp_entry;
		var padding = 20;
		var result = {
			x : 0,
			y : 0
		};

		if (warpEntryName) {
			if (wps) {
				wps.children.forEach(function(wp) {
					if (wp.name == warpEntryName && (wp.entry_dir == "top" || wp.entry_dir == "bottom"  || wp.entry_dir == "right" || wp.entry_dir == "left")) {
						var x = wp.x,
							y = wp.y;
						switch(wp.entry_dir) {
							case "top":
								y -= playerHeight + padding;
								x += wp.width / 2;
							break;
							case "bottom":
								y += wp.height + playerHeight + padding;
								x += wp.width / 2;
							break;
							case "right":
								y += wp.height / 2;
								x += playerWidth + wp.width + padding;
							break;
							case "left":
								y += wp.height / 2;
								x -= playerWidth + padding;
							break;
						}

						result.x = x;
						result.y = y;
					}
				});
			}
		}

		return result;
	};
	this.getPlayer = function(id) {
		var i;
		for (i = 0; i < this.map.players.length; i++) {
			if (this.map.players[i].id === id) {
				return this.map.players[i];
			}
		}

		return false
	};
	this.addPlayer = function(id, x, y, direction, pseudo) {
		var newPlayer = new Player(id, x, y, this.game, false, pseudo);
		newPlayer.direction = direction;
		this.map.players.push(newPlayer);
	};
	this.removePlayer = function(id) {
		var player = this.getPlayer(id);
		if (!player) {
			return;
		}

		player.remove();
		this.map.players.splice(this.map.players.indexOf(player), 1);
	};
	this.cleanPlayers = function() {
		this.map.players.forEach(function(player) {
			player.remove();
		});

		this.map.players = [];
	};
	this.updatePlayer = function(id, x, y, direction) {
		var player = this.getPlayer(id);
		if (!player) {
			return;
		}

		player.update(x, y, direction);
	};
};
Game.prototype = {
	init: function(options) {
		var self = this;
		self.options = options;
		self.modals = {};
		self.modals.tchat = new TchatModal();
		self.modals.map = new MapModal();
		self.modals.pause = new PauseModal();
		self.modals.settings = new SettingsModal();
		self.store = GameStateStore;
		self.modals.tchat.init();
		self.modals.map.init();
		self.modals.pause.init();
		self.modals.settings.init();
		$(self.modals.tchat).on('message', function(e, data) {
			self.map.player.displayMessage(data.content);
		});
		$(self.modals.pause).on('goToMainMap', function(e, data) {
			self.game.state.start("SplashGame", true, false, {
				isMainMap: true
			});
		});
		var buildMenuOptions = function() {
			self.optionsMenu = $("<div class='game-menu'>"+
				"<ul class='menu-options'>"+
					"<li class='light-blue menu-option' id='map-option'><i class='fa fa-map'></i></li>"+
					"<li class='default menu-option' id='tchat-option'><i class='fa fa-comments'></i></li>"+
					"<li class='blue menu-option' id='pause-option'><i class='fa fa-pause'></i></li>"+
					"<li class='green menu-option' id='settings-option'><i class='fa fa-cog'></i></li>"+
				"</ul>"+
				"</div>");
			$(game).append(self.optionsMenu);
			$(self.optionsMenu).find('#tchat-option').click(function() {
				self.modals.tchat.toggle();
			});
			$(self.optionsMenu).find('#settings-option').click(function() {
				self.modals.settings.toggle();
			});
			$(self.optionsMenu).find('#pause-option').click(function() {
				self.modals.pause.toggle();
			});
			$(self.optionsMenu).find('#map-option').click(function() {
				self.modals.map.toggle();
			});
			return self.optionsMenu;
		};
		buildMenuOptions();
	},
	create: function() {
		var self = this;
		// this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
		// Start the Arcade physics systems.
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		// Change background color.
		this.game.stage.backgroundColor = '#787878';
		// Keep running on losing focus
		this.game.stage.disableVisibilityChange = true;
		// Add tile map and tile set image.
		var tileMap = this.game.add.tilemap(self.options.mapKey);
		this.map = new Map(self.options.mapKey, self.options.overviewKey, tileMap, this.game);
		this.map.init();
		this.store.setCurrentMap(this.map);
		this.map.addPlayer(300, 300, self.options.pseudo);
		this.cursors = this.game.input.keyboard.createCursorKeys();
		// Connect to socket server
		this.socket = io(Constants.socketServer).connect();
		this.socket.on('connect', function() {
			self.cleanPlayers();
			self.socket.emit('new_player', { x : self.map.player.getX(), y : self.map.player.getY(), direction : self.map.player.getDirection(), mapId: self.map.key, pseudo: self.options.pseudo });
		});
		this.socket.on('disconnect', function() {
			self.socket.emit('remove');
		});
		this.socket.on('new_player', function(data) {
			if (data.mapId == self.map.key) {
				self.addPlayer(data.id, data.x, data.y, data.direction, data.pseudo);
			}
		});
		this.socket.on('remove_player', function(data) {
			self.removePlayer(data.id);
		});
		this.socket.on('move_player', function(data) {
			self.updatePlayer(data.id, data.x, data.y, data.direction);
		});
		this.socket.on('message', function(data) {
			self.displayMessage(data.message, data.id);
		});

		// Listen keyboard events
		// spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		worldScale = 1
		previousScale = 1;
		this.game.input.mouse.mouseWheelCallback = function(evt) {
			var wheelDelta = self.game.input.mouse.wheelDelta;
            if (wheelDelta < 0)  {
				worldScale -= 0.005;
			}
            else {
				worldScale += 0.005;
			}
		};

		this.game.onFocus.add(function(e) {
			self.isFocusLost = false;
		});
		this.game.onBlur.add(function(e) {
			self.isFocusLost = true;
		});

		/*
		spaceBar.onDown.add(function() {
			if (currentNpc == null) {
				return;
			}

			currentNpc.interact();
		}, this);
		*/
	},
	update: function() {
		var self = this;
		try {
			if (!this.map.player || !this.map.layers.collision || this.preventUpdate) return;
			this.map.players.forEach(function(p) {
				if (!self.game.physics.arcade.collide(p.sprite, self.map.layers.collision)) {
					p.updatePosition();
					p.updateMessagePosition();
				}
			});

			if (self.game.physics.arcade.collide(self.map.player.sprite, self.map.layers.collision)) {
				return;
			}

			// Warp the player to another map.
			if (self.game.physics.arcade.overlap(self.map.player.sprite, self.map.getWarps(), function(e, warp) {
				var tileMap = self.game.add.tilemap(warp.map),
					playerHeight = self.map.player.sprite.height,
					playerWidth = self.map.player.sprite.width,
					pseudo = self.map.player.getPseudo();
				self.preventUpdate = true;
				self.map.destroy();
				self.map = new Map(warp.map, tileMap, self.game, warp.category); // TODO : Pass category.
				self.map.init().done(function() {
					var playerPosition = self.getPlayerPosition(warp, self.map.getWarps(), playerHeight, playerWidth);
					self.map.addPlayer(playerPosition.x, playerPosition.y, pseudo);
					// Remove the player from the map & add him to the new map.
					self.socket.emit('remove');
					self.socket.emit('new_player', { x : self.map.player.getX(), y : self.map.player.getY(), direction : self.map.player.getDirection(), mapId: self.map.key, pseudo: pseudo });
					self.game.camera.focusOnXY(playerPosition.x, playerPosition.y);
					self.preventUpdate = false;
				});
			})) {
				return;
			}

			// Interact with NPCs.
			if (!self.game.physics.arcade.overlap(self.map.player.hitZone, self.map.getNpcObjs(), function(e, npc) {
				currentNpc = self.map.getNpc(npc);
				if (!currentNpc.getIsEnabled()) {
					self.map.player.hideInteraction();
					return;
				}

				self.map.player.displayInteraction();
			})) {
				self.map.player.hideInteraction();
				currentNpc = null;
			}

			// Update player.
			if (self.isFocusLost) {
				this.cursors.up.isDown = false;
				this.cursors.right.isDown = false;
				this.cursors.down.isDown = false;
				this.cursors.left.isDown = false;
				this.map.player.setDirection([]);
			}

			isPositionUpdated = this.map.player.updateDirection(this.cursors);

			this.map.player.updatePosition();
			this.map.player.updateMessagePosition();
			if (isPositionUpdated) {
				this.socket.emit('move_player', {x : this.map.player.getX(), y : this.map.player.getY(), direction : this.map.player.getDirection() });
			}

			// Zoom on the map
			if (worldScale != previousScale) {
				// self.game.world.scale.set(worldScale);
				previousScale = worldScale;
			}
		}
		catch(err) {
			console.log(err);
		}
	},
	render: function() {
		if (this.map.player) this.game.debug.spriteInfo(this.map.player.sprite, 32, 32);
	},
	shutdown() {
		this.modals.tchat.remove();
		this.modals.map.remove();
		this.modals.pause.remove();
		this.modals.settings.remove();
		this.optionsMenu.remove();
		this.map.destroy();
	}
};
