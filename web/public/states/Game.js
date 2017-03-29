var Game = function () {
	this.map = null;
	this.cursors = null;
	this.getPlayer = function(id) {
		var i;
		for (i = 0; i < this.map.players.length; i++) {
			if (this.map.players[i].id === id) {
				return this.map.players[i];
			}
		}
	
		return false
	}
};
Game.prototype = {
	init: function() {
	},
	create: function() {
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
	}
};