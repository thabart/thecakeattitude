var Warper = function(game, npc) {
	// Initialize the sprite.
	var sprite = game.add.sprite(npc.x, npc.y, 'wraper');
	sprite.animations.add('stay');
	sprite.animations.play('stay', 1, true);
	
	this.getSprite = function() {
		return sprite;
	};
};