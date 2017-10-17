game.FloorEntitySelector = game.SelectableEntitySelector.extend({
	init: function() {
    this._super(game.SelectableEntitySelector, "init", [
      Constants.Layers.Ground.Name,,
			Constants.Selectors.Floor
    ])
	},
	create: function(x, y, name) {
		return new game.FloorEntity(x, y, name);
	},
	getZIndex: function() {
		return Constants.playerZIndex - 2;
	}
});
