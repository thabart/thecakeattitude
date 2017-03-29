var Game = function () {
	this.map = null;
	this.cursors = null;
	this.socket = null;
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
		var newPlayer = this.game.add.sprite(x, y, 'player');
		this.game.physics.enable(newPlayer, Phaser.Physics.ARCADE)
		var newPlayer = new Player(id, newPlayer);
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
		// Start the Arcade physics systems.
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		// Change background color.				
		this.game.stage.backgroundColor = '#787878';		
		// Keep running on losing focus
		this.game.stage.disableVisibilityChange = true;
		// Add tile map and tile set image.
		var tileMap = this.game.add.tilemap('firstMap');
		this.map = new Map(tileMap, this.game);		
		this.map.init();
		this.cursors = this.game.input.keyboard.createCursorKeys();	
		// Connect to socket server		
		this.socket = io('http://localhost:3001').connect();		
		this.socket.on('connect', function() {
			console.log('socket connected');			
			self.cleanPlayers();
			self.socket.emit('new_player', { x : self.map.player.getX(), y : self.map.player.getY(), direction : self.map.player.getDirection() });
		});
		this.socket.on('disconnect', function() {
			console.log('socket disconnected');
		});
		this.socket.on('new_player', function(data) {
			console.log('new player');
			self.addPlayer(data.id, data.x, data.y, data.direction);
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
	},
	update: function() {		
		var self = this;
		this.map.players.forEach(function(p) {
			if (!self.game.physics.arcade.collide(p.sprite, self.map.layers.collision)) {
				p.updatePosition();		
				p.updateMessagePosition();						
			}
		});
		
		if (self.game.physics.arcade.collide(self.map.player.sprite, self.map.layers.collision)) {
			return;
		}
		
		if (self.game.physics.arcade.overlap(self.map.player.sprite, self.map.wraps, function(e, wrap) {
			// TODO : Load an another map.
			var map = wrap.map;
			var tileMap = self.game.add.tilemap(map);
			self.map.destroy();
			self.map = new Map(tileMap, self.game);
			self.map.init();
		})) {
			return;
		}
		
		// Update player.
		isPositionUpdated = this.map.player.updateDirection(this.cursors);
		this.map.player.updatePosition();	
		this.map.player.updateMessagePosition();
		if (isPositionUpdated) {			
			this.socket.emit('move_player', {x : this.map.player.getX(), y : this.map.player.getY(), direction : this.map.player.getDirection() });
		}
	},
	displayMessage : function(txt, id) {
		var player = this.map.player;
		if (id) {
			player = this.getPlayer(id);
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