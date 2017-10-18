game.FurnitureEntitySelector = game.SelectableEntitySelector.extend({
	init: function() {
    this._super(game.SelectableEntitySelector, "init", [
      Constants.Layers.Ground.Name,
			Constants.Selectors.Furniture
    ])
	},
	create: function(x, y, name) {
		return new game.FurnitureEntity(x, y, name);
	},
	getZIndex: function() {
		return Constants.playerZIndex;
	},
	isAtLimit: function(coordinates) {
		var minRow = coordinates.row - coordinates.nbRows + 1;
		var minCol = coordinates.col - coordinates.nbCols + 1;
		return (minRow < Constants.Layers.Ground.Position.Row || minCol < Constants.Layers.Ground.Position.Col);
	}
});
