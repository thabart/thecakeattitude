game.FurnitureEntitySelector = game.SelectableEntitySelector.extend({
	init: function() {
    this._super(game.SelectableEntitySelector, "init", [
      Constants.Layers.Ground.Name,
			Constants.Selectors.Furniture
    ])
	},
	create: function(x, y, settings) {
		return new game.Entities.FurnitureEntity(x, y, settings);
	},
	isAtLimit: function(coordinates, flipped) {
		var minRow = coordinates.row - coordinates.nbRows + 1;
		var maxRow = coordinates.row;
		var minCol = coordinates.col - coordinates.nbCols + 1;
		var maxCol = coordinates.col;
		if (flipped) {
			minCol = coordinates.col;
			maxCol = coordinates.col + coordinates.nbCols - 1;
		}

		return (minRow < Constants.Layers.Ground.Position.Row || minCol < Constants.Layers.Ground.Position.Col || maxCol > this.refLayer.cols - 1 || maxRow > this.refLayer.rows - 1);
	}
});
