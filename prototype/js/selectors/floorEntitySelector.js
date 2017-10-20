game.FloorEntitySelector = game.SelectableEntitySelector.extend({
	init: function() {
    this._super(game.SelectableEntitySelector, "init", [
      Constants.Layers.Ground.Name,
			Constants.Selectors.Floor
    ]);
	},
	create: function(x, y, name, interaction) {
		return new game.FloorEntity(x, y, name, interaction);
	},
	getZIndex: function() {
		return Constants.playerZIndex - 2;
	},
	isAtLimit: function(coordinates, flipped) {
		var minRow = coordinates.row - coordinates.nbRows + 1;
		var maxRow = coordinates.row;
		var minCol = coordinates.col;
		var maxCol = coordinates.col + coordinates.nbCols - 1;
		return (minRow < Constants.Layers.Ground.Position.Row || minCol < Constants.Layers.Ground.Position.Col || maxCol > this.refLayer.cols - 1 || maxRow > this.refLayer.rows - 1);
	}
});
