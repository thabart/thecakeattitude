var Player = function(id, x, y, game, currentUser, pseudo, tileMap) {
	var hitPadding = 30,
		messageTimeoutMs = 5000; // Hide the message after 5 seconds.
	this.id = id;
	this.sprite = game.add.sprite(x, y, 'player');
	this.spriteEmoticon = null;
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
	this.hitZone = game.add.graphics(-(hitPadding / 2), -(hitPadding / 2)); // Draw hit zone.
	// TH : Hide the RECTANGLE.
	// this.hitZone.lineStyle(2, 0x0000FF, 1);
	this.hitZone.drawRect(0, 0, this.sprite.width + hitPadding, this.sprite.height + hitPadding);
	var interactionSprite = game.add.sprite(0, game.camera.height - 50, 'spacebar');
	interactionSprite.fixedToCamera = true;
	interactionSprite.visible = false;
	this.sprite.addChild(this.hitZone);
	this.tchatBubble = $("<p class='tchat-bubble' style='display:none;'></p>");
	this.messageTimeout = null;
	$(Constants.gameSelector).append(this.tchatBubble);

	// TODO : MAX : Characters in pseudo = 10
	var pseudoStyle = { font: '12px', wordWrap: true, wordWrapWidth: 60, align: 'center', fill: 'white' };
	if (currentUser) {
		pseudoStyle.fill = 'red';
	}

	this.pseudo = game.add.text(-this.sprite.width / 2, this.sprite.height, pseudo, pseudoStyle); // Draw pseudo.
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

	// Display the player position in the overview map.
	this.updateOverviewPosition = function(x, y) {
		var overviewCoordinate = Calculator.getOverviewImageCoordinate(game);
		var overviewSize = Configuration.getOverviewSize();
		var overviewPlayerCoordinate = Calculator.getOverviewPlayerCoordinate({x: x, y: y}, tileMap, overviewSize, overviewCoordinate);
		this.overviewSprite.x = overviewPlayerCoordinate.x;
		this.overviewSprite.y = overviewPlayerCoordinate.y;
	};
	// Update the message position.
	this.updateMessagePosition = function() {
		if (!$(this.tchatBubble).is(':visible')) {
			return;
		}

		var relativeX = this.sprite.x - game.camera.x - this.sprite.width / 2 - $(this.tchatBubble).outerWidth() / 2;
		var relativeY = this.sprite.y - game.camera.y - this.sprite.height - $(this.tchatBubble).outerHeight();
		$(this.tchatBubble).css('top', relativeY + 'px');
		$(this.tchatBubble).css('left', relativeX + 'px');
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
	// Hide or display the player
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
		this.updateMessagePosition();
		this.sprite.x = x;
		this.sprite.y = y;
		this.direction = direction;
	};
	// Remove emoticon
	this.removeEmoticon = function() {
		if (this.spriteEmoticon !== null) {
			this.spriteEmoticon.destroy();
			this.spriteEmoticon = null;
		}
	};
	// Display message
	this.displayMessage = function(message) {
		var self = this;
		clearTimeout(self.messageTimeout);
		self.removeEmoticon();
		$(self.tchatBubble).hide();
		var emoticon = Constants.emoticons.filter(function(em) { return em.cmd === message; });
		if (emoticon.length === 1) {
			var spriteName = emoticon[0].sprite;
			var frame = game.cache.getFrameData(spriteName).getFrame(0);
			self.spriteEmoticon = game.add.sprite(-frame.width, -frame.height, spriteName);
	    var walkAnim = self.spriteEmoticon.animations.add('walk');
	    self.spriteEmoticon.animations.play('walk', emoticon[0].fps, false);
			walkAnim.onComplete.add(function() {
				self.removeEmoticon();
			}, self);
			self.sprite.addChild(self.spriteEmoticon);
		} else {
			self.tchatBubble.html(message);
			self.updateMessagePosition();
			$(self.tchatBubble).show();
			self.messageTimeout = setTimeout(function() {
				$(self.tchatBubble).hide();
			}, messageTimeoutMs);
		}
	};
	// Destroy the player.
	this.destroy = function() {
		$(this.tchatBubble).remove();
	};
	// Update player position.
	this.updatePosition = function() {
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
		var isPositionUpdated = false;
		if (this.direction.indexOf(0) != -1) {
			// this.sprite.body.velocity.y = -300;
			this.sprite.body.velocity.y -= 300;
			isPositionUpdated = true;
		} else if (this.direction.indexOf(2) != -1) {
			// this.sprite.body.velocity.y = 300;
			this.sprite.body.velocity.y += 300;
			isPositionUpdated = true;
		}

		if (this.direction.indexOf(1) != -1) {
			// this.sprite.body.velocity.x = 300;
			this.sprite.body.velocity.x += 300;
			isPositionUpdated = true;
		} else if (this.direction.indexOf(3) != -1) {
			// this.sprite.body.velocity.x = -300;
			this.sprite.body.velocity.x -= 300;
			isPositionUpdated = true;
		}

		if (isPositionUpdated) {
			this.updateOverviewPosition(this.sprite.x, this.sprite.y);
		}

		this.updateMessagePosition();
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

	// Set the pseudo
	this.setPseudo = function(p) {
		this.pseudo.setText(p);
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
