game.WallEntitySelector = game.SelectableEntitySelector.extend({
	init: function() {

	},
	create: function(x, y, name) {
		return new game.PosterEntity(x, y, name);
	},
	getZIndex: function() {
		return Constants.playerZIndex - 1;
	}
});
