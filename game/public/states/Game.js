var Game = function () {
	this.map = null;
	this.cursors = null;
	this.editButton = null;
	this.socket = null;
	this.isFocusLost = false;
	this.preventUpdate = false;
	var spaceBar = null,
		currentNpc = null,
		worldScale = null,
		previousScale = null;
};
Game.prototype = {
	init: function(options) {
		var self = this;
		self.options = options;
		self.modals = {};
		self.floating = {};
		self.modals.tchat = new TchatModal();
		self.modals.map = new MapModal();
		self.modals.pause = new PauseModal();
		self.modals.settings = new SettingsModal();
		self.floating.profileMenu = new ProfileMenuFloating();
		self.store = GameStateStore;
		self.modals.tchat.init();
		self.modals.map.init();
		self.modals.pause.init();
		self.modals.settings.init();
		self.floating.profileMenu.init();
		$(self.modals.tchat).on('message', function(e, data) {
			self.map.currentPlayer.displayMessage(data.content);
		});
		$(self.modals.pause).on('goToMainMap', function(e, data) {
			self.game.state.start("SplashGame", true, false, {
				isMainMap: true
			});
		});
		$(self.modals.pause).on('exit', function() {
			self.game.state.start("Menu");
		});
		$(self.floating.profileMenu).on('disconnect', function() {
			self.game.state.start('Connect');
		});
		var buildMenuOptions = function() {
			self.optionsMenu = $("<div class='floating-options-bottom-right'>"+
				"<ul class='floating-options'>"+
					"<li class='light-blue floating-option' id='map-option'><i class='fa fa-map'></i></li>"+
					"<li class='default floating-option' id='tchat-option'><i class='fa fa-comments'></i></li>"+
					"<li class='blue floating-option' id='pause-option'><i class='fa fa-pause'></i></li>"+
					"<li class='green floating-option' id='settings-option'><i class='fa fa-cog'></i></li>"+
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
		GameStateStore.onUserChanged.call(this, function(user) { // Track the user changes.
			if (!self.map || !self.map.currentPlayer || !user) {
				return;
			}

			self.map.currentPlayer.setPseudo(user.name);
		});
	},
	create: function() {
		var self = this;
		// this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
		// Start the Arcade physics systems.
		self.game.physics.startSystem(Phaser.Physics.ARCADE);
		// Change background color.
		self.game.stage.backgroundColor = '#787878';
		// Keep running on losing focus
		self.game.stage.disableVisibilityChange = true;
		// Add tile map and tile set image.
		var tileMap = self.game.add.tilemap(self.options.mapKey);
		var position = GameStateStore.getLastPlayerPosition();
		if (self.options.others.typeMap === 'shop') {
			self.map = new ShopMap();
			self.map.init(self.options.overviewKey, tileMap, self.game, self.options.others);
		} else if (self.options.others.typeMap === 'category') {
			self.map = new CategoryMap();
			self.map.init(self.options.overviewKey, tileMap, self.game, self.options.others);
		} else if (self.options.others.typeMap === 'underground') {
			self.map = new UndergroundMap();
			self.map.init(self.options.overviewKey, tileMap, self.game, self.options.others);
		} else {
			self.map = new MainMap();
			self.map.init(self.options.overviewKey, tileMap, self.game);
		}

		self.store.setCurrentMap(self.map);
		var playerPosition = self.map.getDefaultPlayerCoordinate() || {x: 300, y: 300}; // Set player position.
		self.map.setCurrentPlayer(playerPosition.x, playerPosition.y, GameStateStore.getUser().name);

		self.cursors = self.game.input.keyboard.createCursorKeys();
		self.editButton = self.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		// Connect to socket server
		self.socket = io(Constants.socketServer).connect();
		self.socket.on('connect', function() {
			self.cleanPlayers();
			self.socket.emit('new_player', { x : self.map.player.getX(), y : self.map.player.getY(), direction : self.map.player.getDirection(), mapId: self.map.key, pseudo: self.options.pseudo });
		});
		self.socket.on('disconnect', function() {
			self.socket.emit('remove');
		});
		self.socket.on('new_player', function(data) {
			if (data.mapId == self.map.key) {
				// self.addPlayer(data.id, data.x, data.y, data.direction, data.pseudo);
			}
		});
		self.socket.on('remove_player', function(data) {
			self.removePlayer(data.id);
		});
		self.socket.on('move_player', function(data) {
			self.updatePlayer(data.id, data.x, data.y, data.direction);
		});
		self.socket.on('message', function(data) {
			self.displayMessage(data.message, data.id);
		});

		// Listen keyboard events
		// spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		self.game.onFocus.add(function(e) {
			self.isFocusLost = false;
		});
		self.game.onBlur.add(function(e) {
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
			if (!this.map.currentPlayer || !this.map.layers.collision || this.preventUpdate) return;
			// Edit the shop.
			this.map.updateEdit();
			if (self.game.input.mousePointer.isDown) {
				self.map.addFurniture();
			}
			/*
			if (this.editButton.isDown) {
				this.map.updateEdit();
			}
			*/

			// Check collisions.
			this.map.players.forEach(function(p) {
				if (!self.game.physics.arcade.collide(p.sprite, self.map.layers.collision)) {
					p.updatePosition();
					p.updateMessagePosition();
				}
			});

			// Check collision.
			if (self.game.physics.arcade.collide(self.map.currentPlayer.sprite, self.map.layers.collision)) {
				return;
			}

			// Detect player sprite overlap a warp & teleport the player to the map.
			if (self.game.physics.arcade.overlap(self.map.currentPlayer.sprite, self.map.groups.warps, function(e, warp) {
				var playerPosition = GameStateStore.getLastPlayerPosition();
		    var json = {
		      map_link: warp.target_map_path,
		      overview_link: warp.target_overview_path,
					others: warp.others,
		      isMainMap: false,
					mapName: warp.map_name
		    };
		  	self.game.state.start("SplashGame", true, false, json);
				GameStateStore.saveLastPlayerPosition({ x: self.map.currentPlayer.getX(), y: self.map.currentPlayer.getY() });
			})) {
				return;
			}

			// Update player position.
			if (self.isFocusLost) {
				this.cursors.up.isDown = false;
				this.cursors.right.isDown = false;
				this.cursors.down.isDown = false;
				this.cursors.left.isDown = false;
				this.map.currentPlayer.setDirection([]);
			}

			isPositionUpdated = this.map.currentPlayer.updateDirection(this.cursors);
			this.map.currentPlayer.updatePosition();
			this.map.currentPlayer.updateMessagePosition();
			if (isPositionUpdated) {
				this.socket.emit('move_player', {x : this.map.currentPlayer.getX(), y : this.map.currentPlayer.getY(), direction : this.map.currentPlayer.getDirection() });
			}
		}
		catch(err) {
			console.log(err);
		}
	},
	render: function() {
		// if (this.map.currentPlayer) this.game.debug.spriteInfo(this.map.currentPlayer.sprite, 32, 32);
	},
	shutdown: function() {
		this.modals.tchat.remove();
		this.modals.map.remove();
		this.modals.pause.remove();
		this.modals.settings.remove();
		this.floating.profileMenu.remove();
		this.optionsMenu.remove();
		GameStateStore.offUserChanged.call(this);
		this.map.destroy();
	}
};
