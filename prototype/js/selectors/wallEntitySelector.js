game.WallEntitySelector = game.SelectableEntitySelector.extend({
	init: function() {
	   this._super(game.SelectableEntitySelector, "init", [
	     	Constants.Layers.Wall.Name,
				Constants.Selectors.Wall
	   ]);
	},
	create: function(x, y, name) {
		return new game.PosterEntity(x, y, name);
	},
	getZIndex: function() {
		return Constants.playerZIndex - 1;
	},
	moveCallback: function() {
    var isLeftWall = this.sprite.tile.row > Constants.Layers.Wall.Position.Row;
    if ((!this.sprite.flipped && isLeftWall) || (this.sprite.flipped && !isLeftWall)) {
      this.sprite.flip();
    }
	}
});
