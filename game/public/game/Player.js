var Player = function(id, x, y, game, currentUser, pseudo, tileMap) {
	var messageTimeoutMs = 5000; // Hide the message after 5 seconds.
	var paddingYHeader = -20;
	this.id = id;
	this.sprite = game.add.sprite(x, y, 'player');
	this.sprite.animations.add('goDown', [0, 1, 2, 3, 4, 5, 6, 7], 10, true); // Add animations.
	this.sprite.animations.add('goBottomRight', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
	this.sprite.animations.add('goRight', [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
	this.sprite.animations.add('goTopRight', [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
	this.sprite.animations.add('goTop', [32, 33, 34, 35, 36, 37, 38, 39], 10, true);
	this.sprite.animations.add('goTopLeft', [40, 41, 42, 43, 44, 45, 46, 47], 10, true);
	this.sprite.animations.add('goLeft', [48, 49, 50, 51, 52, 53, 54, 55], 10, true);
	this.sprite.animations.add('goBottomLeft', [56, 57, 58, 59, 60, 61, 62, 63], 10, true);
	this.sprite.animations.add('stayDown', [64]);
	this.sprite.animations.add('stayBottomRight', [65]);
	this.sprite.animations.add('stayRight', [66]);
	this.sprite.animations.add('stayTopRight', [67]);
	this.sprite.animations.add('stayTop', [68]);
	this.sprite.animations.add('stayTopLeft', [69]);
	this.sprite.animations.add('stayLeft', [70]);
	this.sprite.animations.add('stayBottomLeft', [71]);
	this.header = game.add.sprite(-1, paddingYHeader, 'blackHeadsMen'); // Add head.
	this.header.animations.add('bottom', [0]);
	this.header.animations.add('bottomRight', [1]);
	this.header.animations.add('right', [2]);
	this.header.animations.add('topRight', [3]);
	this.header.animations.add('top', [4]);
	this.header.animations.add('topLeft', [5]);
	this.header.animations.add('left', [6]);
	this.header.animations.add('bottomLeft', [7]);
	this.sprite.addChild(this.header);
	this.sprite.play('stayDown');
	this.header.play('bottom');

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
	var interactionSprite = game.add.sprite(0, game.camera.height - 50, 'spacebar');
	interactionSprite.fixedToCamera = true;
	interactionSprite.visible = false;
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
	this.sprite.body.setSize(this.sprite.width, this.sprite.height - paddingYHeader, 0, paddingYHeader);

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

		var relativeX = this.sprite.x - game.camera.x + this.sprite.width / 2 - $(this.tchatBubble).outerWidth() / 2;
		var relativeY = this.sprite.y - game.camera.y - this.sprite.height / 2 - $(this.tchatBubble).outerHeight() - 20;
		$(this.tchatBubble).css('top', relativeY + 'px');
		$(this.tchatBubble).css('left', relativeX + 'px');
	};
	// Remove the player.
	this.remove = function() {
		this.sprite.destroy();
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
		if (result) {
			if (cursors.up.isDown && cursors.right.isDown && !cursors.down.isDown && !cursors.left.isDown) { // Top + Right
				this.sprite.play('goTopRight');
				this.header.play('topRight');
			} else if (!cursors.up.isDown && cursors.right.isDown && !cursors.down.isDown && !cursors.left.isDown) { // Right
				this.sprite.play('goRight');
				this.header.play('right');
			} else if (!cursors.up.isDown && cursors.right.isDown && cursors.down.isDown && !cursors.left.isDown) { // Bottom + Right
				this.sprite.play('goBottomRight');
				this.header.play('bottomRight');
			} else if (!cursors.up.isDown && !cursors.right.isDown && cursors.down.isDown && !cursors.left.isDown) { // Bottom
				this.sprite.play('goDown');
				this.header.play('bottom');
			} else if (!cursors.up.isDown && !cursors.right.isDown && cursors.down.isDown && cursors.left.isDown) { // Bottom + Left
				this.sprite.play('goBottomLeft');
				this.header.play('bottomLeft');
			} else if (!cursors.up.isDown && !cursors.right.isDown && !cursors.down.isDown && cursors.left.isDown) { // Left
				this.sprite.play('goLeft');
				this.header.play('left');
			} else if (cursors.up.isDown && !cursors.right.isDown && !cursors.down.isDown && cursors.left.isDown) { // Left + Top
				this.sprite.play('goTopLeft');
				this.header.play('topLeft');
			} else if (cursors.up.isDown && !cursors.right.isDown && !cursors.down.isDown && !cursors.left.isDown) { // Top
				this.sprite.play('goTop');
				this.header.play('top');
			} else {
				switch(this.sprite.animations.currentAnim.name) {
					case "goDown":
						this.sprite.play('stayDown');
					break;
					case "goBottomRight":
						this.sprite.play('stayBottomRight');
					break;
					case "goRight":
						this.sprite.play('stayRight');
					break;
					case "goTopRight":
						this.sprite.play('stayTopRight');
					break;
					case "goTop":
						this.sprite.play('stayTop');
					break;
					case "goTopLeft":
						this.sprite.play('stayTopLeft');
					break;
					case "goLeft":
						this.sprite.play('stayLeft');
					break;
					case "goBottomLeft":
						this.sprite.play('stayBottomLeft');
					break;
					default:
						this.sprite.animations.stop();
					break;
				}
				this.sprite.animations.stop();
			}
		}

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
			self.spriteEmoticon = game.add.sprite(-frame.width / 2, -frame.height, spriteName);
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
