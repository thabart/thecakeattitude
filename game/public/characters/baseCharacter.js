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
      game.canvas.style.cursor = "url(/styles/cursors/help_select/help_select0003.png) 0 0, auto";
    });
    this.sprite.events.onInputOut.add(function() {
      game.canvas.style.cursor = "url(/styles/cursors/mouse_cursor_halt/mouse_cursor_halt0000.png) 0 0, auto";
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
