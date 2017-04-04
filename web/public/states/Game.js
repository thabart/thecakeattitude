var Game = function () {
	this.map = null;
	this.cursors = null;
	this.socket = null;
	var spaceBar = null,
		currentNpc = null,
		worldScale = null,
		previousScale = null,
		plane = null;
	this.getPlayer = function(id) {
		var i;
		for (i = 0; i < this.map.players.length; i++) {
			if (this.map.players[i].id === id) {
				return this.map.players[i];
			}
		}
	
		return false
	};
	this.addPlayer = function(id, x, y, direction) {
		var newPlayer = new Player(id, x, y, this.game);
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
	init: function() {
	},
	create: function() {
		var self = this;
		this.game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);
		// Start the Arcade physics systems.
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		// Change background color.				
		this.game.stage.backgroundColor = '#787878';		
		// Keep running on losing focus
		this.game.stage.disableVisibilityChange = true;
		// Add tile map and tile set image.
		var tileMap = this.game.add.tilemap('firstMap');
		this.map = new Map('firstMap', tileMap, this.game);		
		this.map.init();
		this.cursors = this.game.input.keyboard.createCursorKeys();	
		// Connect to socket server		
		this.socket = io('http://localhost:3001').connect();		
		this.socket.on('connect', function() {
			console.log('socket connected');			
			self.cleanPlayers();
			self.socket.emit('new_player', { x : self.map.player.getX(), y : self.map.player.getY(), direction : self.map.player.getDirection(), mapId: self.map.key });
		});
		this.socket.on('disconnect', function() {
			console.log('socket disconnected');
			self.socket.emit('remove');
		});
		this.socket.on('new_player', function(data) {
			console.log('new player');
			if (data.mapId == self.map.key) {
				self.addPlayer(data.id, data.x, data.y, data.direction);
			}
		});
		this.socket.on('remove_player', function(data) {
			console.log('remove player');
			self.removePlayer(data.id);
		});
		this.socket.on('move_player', function(data) {
			self.updatePlayer(data.id, data.x, data.y, data.direction);
		});
		this.socket.on('message', function(data) {
			self.displayMessage(data.message, data.id);
		});
		
		// Listen keyboard events
		spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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
		spaceBar.onDown.add(function() {
			if (currentNpc == null) {
				return;
			}
			
			currentNpc.interact();
		}, this);
	},
	update: function() {		
		var self = this;
		try {
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
			if (self.game.physics.arcade.overlap(self.map.player.sprite, self.map.getWarps(), function(e, wrap) {
				var map = wrap.map;
				var tileMap = self.game.add.tilemap(map);
				self.map.destroy();
				self.map = new Map(map, tileMap, self.game);
				self.map.init();
				// Remove the player from the map	& add him to the new map.		
				self.socket.emit('remove');
				self.socket.emit('new_player', { x : self.map.player.getX(), y : self.map.player.getY(), direction : self.map.player.getDirection(), mapId: self.map.key });
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
			isPositionUpdated = this.map.player.updateDirection(this.cursors);
			this.map.player.updatePosition();	
			this.map.player.updateMessagePosition();
			if (isPositionUpdated) {			
				this.socket.emit('move_player', {x : this.map.player.getX(), y : this.map.player.getY(), direction : this.map.player.getDirection() });
			}
			
			// Zoom on the map
			if (worldScale != previousScale) {				
				/*
				self.game.camera.scale.x = worldScale;
				self.game.camera.scale.y = worldScale;
				self.game.camera.bounds.x = plane.x * worldScale;
				self.game.camera.bounds.y = plane.y * worldScale;
				self.game.camera.bounds.width = plane.width * worldScale;
				self.game.camera.bounds.height = plane.height * worldScale;*/
				/*
				self.map.layers.earth.scale = {x:worldScale, y:worldScale};
				self.map.layers.ground.scale = {x:worldScale, y:worldScale};
				self.map.layers.collision.scale = {x:worldScale, y:worldScale};				
				self.map.npcObjs.scale.x = worldScale;		
				self.map.npcObjs.scale.y = worldScale;	
				self.map.warps.scale.x = worldScale;		
				self.map.warps.scale.y = worldScale;

				self.map.layers.earth.resizeWorld();
				self.map.layers.ground.resizeWorld();
				self.map.layers.collision.resizeWorld();
				/*
				self.game.camera.width -= 100;
				self.game.camera.x -= 100;*/
				previousScale = worldScale;
			}
		}
		catch(err) {
			
		}
		
		// Zoom & dezoom
		/*
		zoompoint.x = self.game.input.mousePointer.worldX;
        zoompoint.y = self.game.input.mousePointer.worldY;
		var globalGroup = this.map.getGlobalGroup();
		rescalefactorx = mapSizeX / (mapSizeX * globalGroup.scale.x);
        rescalefactory = mapSizeY / (mapSizeY * globalGroup.scale.y);
        prevScale.x = globalGroup.scale.x;
        prevScale.y = globalGroup.scale.y;
        nextScale.x = prevScale.x + (worldScale-globalGroup.scale.x)*0.1;
        nextScale.y = prevScale.y + (worldScale-globalGroup.scale.y)*0.1;
        var xAdjust = (zoompoint.x - self.game.camera.position.x) * (nextScale.x - prevScale.x);
        var yAdjust = (zoompoint.y - self.game.camera.position.y) * (nextScale.y - prevScale.y);
		if (prevScale.x != nextScale.x || prevScale.y != nextScale.y) {
            var scaleAdjustX = nextScale.x / prevScale.x;
            var scaleAdjustY = nextScale.y / prevScale.y;
            var focusX = (self.game.camera.position.x * scaleAdjustX) + xAdjust*(rescalefactorx);
            var focusY = (self.game.camera.position.y * scaleAdjustY) + yAdjust*(rescalefactory);
            self.game.camera.focusOnXY(focusX, focusY);
        }
		
		globalGroup.scale.x += (worldScale-globalGroup.scale.x)*0.1;   //easing
        globalGroup.scale.y += (worldScale-globalGroup.scale.y)*0.1;
		*/
	},
	render: function() {		
		this.game.debug.spriteInfo(this.map.player.sprite, 32, 32);
	},
	displayMessage : function(txt, id) {
		var player = this.map.player;
		if (id) {
			player = this.getPlayer(id);
			if (!player) {
				return;
			}
		}
		
		// 1. Destroy the message.
		if (player.evtMessage != null) {
			this.game.time.events.remove(player.evtMessage);
		}
		
		player.destroyMessage();					
		var speechBubble = new SpeechBubble(this.game, player.sprite.x + (player.sprite.width / 2), player.sprite.y, 150, txt);
		this.game.world.add(speechBubble);
		var evtMessage = this.game.time.events.add(Phaser.Timer.SECOND * 5, function() {
			player.destroyMessage();
		}, this);
		player.displayMessage(speechBubble, evtMessage);
	},
	sendMessage: function(txt) {
		this.displayMessage(txt);		
		this.socket.emit('message', { message : txt });
	}
};