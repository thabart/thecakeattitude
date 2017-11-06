game.Entities = game.Entities || {};
game.Entities.PosterEntity = game.SelectableEntity.extend({
  init: function (x, y, settings) {
    if (settings.col && settings.row) {
      var refLayer = me.game.world.getChildByName(Constants.Layers.Wall.Name)[0];
      var coordinates = refLayer.getRenderer().tileToPixelCoords(settings.col, settings.row);
      x = coordinates.x;
      y = coordinates.y;
    }
    
    this._super(game.SelectableEntity, "init", [
      {
        x: x,
        y: y,
        name: settings.resource,
        refLayerName: Constants.Layers.Wall.Name,
        selector: Constants.Selectors.Wall,
        interaction: settings.interaction
      }
    ]);
    this.addCollision("posters_collision");
    this.addShape("walls_shapes");
    this.body.collisionType = me.collision.types.ACTION_OBJECT;
  },
	getZIndex: function() {
		return Constants.playerZIndex - 1;
	}
});
