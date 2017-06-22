var BaseCharacter = function() { };
BaseCharacter.prototype = {
  create: function(game, npc, spriteName, characterName, fps) {
    this.sprite = game.add.sprite(npc.x, npc.y, spriteName);
    this.sprite.animations.add('stay');
    if (fps) {
      this.sprite.animations.play('stay', fps, true);
    }

    this.sprite.inputEnabled = true;
    this.sprite.events.onInputOver.add(function() {
      game.canvas.style.cursor = "pointer";
    });
    this.sprite.events.onInputOut.add(function() {
      game.canvas.style.cursor = "default";
    });
    this.sprite.events.onInputDown.add(function() {
		  this.interact();
	  }, this);
    if (characterName && characterName !== null) {
    	var pseudoStyle = { font: '12px', fill: 'white', boundsAlignH: "center", boundsAlignV: 'bottom' };
      this.pseudo = game.add.text(0, 0, characterName, pseudoStyle);
      this.pseudo.setTextBounds(npc.x, npc.y, this.sprite.width, this.sprite.height);
    }
  },
  getSprite: function() {
		return this.sprite;
	},
  destroy: function() {
    this.pseudo.destroy();
    this.sprite.destroy();
  }
};
