var BaseCharacter = function() { };
BaseCharacter.prototype = {
  create: function(game, npc, spriteName) {
    this.sprite = game.add.sprite(npc.x, npc.y, spriteName);
    this.sprite.animations.add('stay');
    this.sprite.animations.play('stay', 1, true);
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
  },
  getSprite: function() {
		return this.sprite;
	},
  destroy: function() {
    this.sprite.destroy();
  }
};
