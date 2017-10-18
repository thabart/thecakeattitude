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
			var activeEntity = ShopStore.getActiveEntity();
			activeEntity.isFlipped = this.sprite.flipped;
    }
	},
	isAtLimit: function(coordinates, flipped) {
		var minRow = coordinates.row;
		var maxRow = coordinates.row;
		var minCol = coordinates.col;
		var maxCol = coordinates.col + coordinates.nbCols - 1;
		if (flipped) {
			maxCol = minCol = coordinates.col;
			maxRow = coordinates.row + coordinates.nbRows - 1;
		}

		return (minRow < Constants.Layers.Wall.Position.Row || minCol < Constants.Layers.Wall.Position.Col || maxCol > this.refLayer.cols - 1 || maxRow > this.refLayer.rows - 1);
	}
});