var Player = function(id, x, y, game, currentUser) {
	console.log('new player');
	var hitPadding = 30;
	this.id = id;
	this.sprite = game.add.sprite(x, y, 'player');;
	this.direction = [];
	this.message = null;
	this.evtMessage = null;
	this.hitZone = game.add.graphics(x, y);
	this.hitZone.lineStyle(2, 0x0000FF, 1);
	this.hitZone.drawRect(x - hitPadding / 2, y - hitPadding / 2, this.sprite.width + hitPadding, this.sprite.height + hitPadding);
	var interactionSprite = game.add.sprite(0, game.camera.height - 50, 'spacebar');
	interactionSprite.fixedToCamera = true;
	interactionSprite.visible = false;
	this.sprite.addChild(this.hitZone);
	
	// TODO : MAX : Characters in pseudo = 10
	var pseudoStyle = { font: '15px', wordWrap: true, wordWrapWidth: 60, align: 'center' };
	if (currentUser) {
		pseudoStyle.fill = '#FFA500';
	}
	pseudo = game.add.text(this.sprite.x - 20, this.sprite.y - this.sprite.height / 2,  'aaaaaaaaaa', pseudoStyle);
	
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	
	function updateDirection(dir, val) {
		var result = false;
		if (dir.isDown && this.direction.indexOf(val) == -1) {
			this.direction.push(val);
			result = true;
		} else if (dir.isUp && this.direction.indexOf(val) != -1) {
			this.direction.splice(this.direction.indexOf(val), 1);		
			result = true;
		}
		
		return result;
	}
	
	// Remove the player.
	this.remove = function() {
		this.sprite.destroy();
		this.hitZone.destroy();
		pseudo.destroy();
		interactionSprite.destroy();
		if (this.message != null)
		{					
			this.message.destroy();
		}
	};				
	// Update direction.
	// Returns : true if the direction changes.
	this.updateDirection = function(cursors) {
		var result = false;
		result = result || updateDirection.call(this, cursors.up, 0);
		result = result || updateDirection.call(this, cursors.right, 1);
		result = result || updateDirection.call(this, cursors.down, 2);
		result = result || updateDirection.call(this, cursors.left, 3);
		return result;
	};				
	// Update the properties.
	this.update = function(x, y, direction) {
		this.sprite.x = x;
		this.sprite.y = y;
		this.direction = direction;
	};				
	// Display message
	this.displayMessage = function(message, evtMessage) {
		this.message = message;
		this.evtMessage = evtMessage;
	};				
	// Destroy the message.
	this.destroyMessage = function() {
		if (this.message == null) {
			return;
		}
		
		this.message.destroy();
		this.message = null;
		this.evtMessage = null;					
	};				
	// Update player position.
	this.updatePosition = function() {					
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
		if (this.direction.indexOf(0) != -1) {						
			this.sprite.body.velocity.y = -200;
		} else if (this.direction.indexOf(2) != -1) {			
			this.sprite.body.velocity.y = 200;						
		}
		
		if (this.direction.indexOf(1) != -1) {	
			this.sprite.body.velocity.x = 200;
		} else if (this.direction.indexOf(3) != -1) {			
			this.sprite.body.velocity.x = -200;						
		}
		
		pseudo.x = this.sprite.x - 20 ;
		pseudo.y = this.sprite.y - this.sprite.height / 2;
	};				
	// Update message position.
	this.updateMessagePosition = function() {
		if (this.message == null) {
			return;
		}
		
		this.message.x = Math.floor(this.sprite.x + (this.sprite.width / 2));
		this.message.y = Math.floor(this.sprite.y);				
	};				
	// Reset the direction.
	this.resetDirection = function() {
		this.direction = [];
	};
	// Get x.
	this.getX = function() {
		return this.sprite.x;
	};
	// Get y.
	this.getY = function() {
		return this.sprite.y;
	};
	// Get direction.
	this.getDirection = function() {
		return this.direction;
	};
	// Display the interaction button.
	this.displayInteraction = function() {
		interactionSprite.visible = true;
	};
	// Hide interaction button.
	this.hideInteraction = function() {
		 interactionSprite.visible = false;		
	};
}
		