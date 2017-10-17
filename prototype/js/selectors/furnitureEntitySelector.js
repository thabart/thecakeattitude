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
	}
});
