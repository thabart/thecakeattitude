var Player = function(id, x, y, game, currentUser, pseudo, tileMap) {
	var hitPadding = 30;
	this.id = id;
	this.sprite = game.add.sprite(x, y, 'player');
	var overviewCoordinate = Calculator.getOverviewImageCoordinate(game);
	var overviewSize = Configuration.getOverviewSize();
	var overviewPlayerCoordinate = Calculator.getOverviewPlayerCoordinate({x: x, y: y}, tileMap, overviewSize, overviewCoordinate);
	this.overviewSprite = game.add.graphics(overviewPlayerCoordinate.x, overviewPlayerCoordinate.y); // Add overview sprite.
	if (currentUser) {
		this.overviewSprite.beginFill(0xFF0000, 1);
	} else {
		this.overviewSprite.beginFill(0x0000FF, 1);
	}

	this.overviewSprite.drawCircle(0, 0, 2);
	this.direction = [];
	this.message = null;
	this.evtMessage = null;
	this.hitZone = game.add.graphics(-(hitPadding / 2), -(hitPadding / 2));
	this.hitZone.lineStyle(2, 0x0000FF, 1);
	this.hitZone.drawRect(0, 0, this.sprite.width + hitPadding, this.sprite.height + hitPadding);
	var interactionSprite = game.add.sprite(0, game.camera.height - 50, 'spacebar');
	interactionSprite.fixedToCamera = true;
	interactionSprite.visible = false;
	this.sprite.addChild(this.hitZone);

	// TODO : MAX : Characters in pseudo = 10
	var pseudoStyle = { font: '15px', wordWrap: true, wordWrapWidth: 60, align: 'center' };
	if (currentUser) {
		pseudoStyle.fill = '#FFA500';
	}

	this.pseudo = game.add.text(-this.sprite.width / 2, -15, pseudo, pseudoStyle);
	this.sprite.addChild(this.pseudo);
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

	this.updateOverviewPosition = function(x, y) {
		var overviewCoordinate = Calculator.getOverviewImageCoordinate(game);
		var overviewSize = Configuration.getOverviewSize();
		var overviewPlayerCoordinate = Calculator.getOverviewPlayerCoordinate({x: x, y: y}, tileMap, overviewSize, overviewCoordinate);
		this.overviewSprite.x = overviewPlayerCoordinate.x;
		this.overviewSprite.y = overviewPlayerCoordinate.y;
	};

	// Remove the player.
	this.remove = function() {
		this.sprite.destroy();
		this.hitZone.destroy();
		this.overviewSprite.destroy();
		this.pseudo.destroy();
		interactionSprite.destroy();
		if (this.message != null)
		{
			this.message.destroy();
		}
	};
	// Update message position.
	this.updateMessagePosition = function() {
		if (this.message == null) {
			return;
		}

		this.message.x = Math.floor(this.sprite.x + (this.sprite.width / 2));
		this.message.y = Math.floor(this.sprite.y);
	};
	this.display = function(isVisible) {
		if (this.sprite) this.sprite.visible = isVisible;
		if (this.hitZone) this.hitZone.visible = isVisible;
		if (this.pseudo) this.pseudo.visible = isVisible;
		if (this.overviewSprite) this.overviewSprite.visible = isVisible;
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
		this.updateOverviewPosition(x, y);
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
		var isPositionUpdated = false;
		if (this.direction.indexOf(0) != -1) {
			this.sprite.body.velocity.y = -300;
			isPositionUpdated = true;
		} else if (this.direction.indexOf(2) != -1) {
			this.sprite.body.velocity.y = 300;
			isPositionUpdated = true;
		}

		if (this.direction.indexOf(1) != -1) {
			this.sprite.body.velocity.x = 300;
			isPositionUpdated = true;
		} else if (this.direction.indexOf(3) != -1) {
			this.sprite.body.velocity.x = -300;
			isPositionUpdated = true;
		}

		if (isPositionUpdated) {
			this.updateOverviewPosition(this.sprite.x, this.sprite.y);
		}
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
	// Get the pseudo.
	this.getPseudo = function() {
		return pseudo;
	}
	// Get direction.
	this.getDirection = function() {
		return this.direction;
	};
	// Set direction
	this.setDirection = function(dir) {
		this.direction = dir;
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
