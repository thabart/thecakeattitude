game.Entities = game.Entities || {};
game.Entities.FloorEntity = game.SelectableEntity.extend({
  init: function (x, y, settings) {
      if (settings.col && settings.row) {
        var refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
        var coordinates = refLayer.getRenderer().tileToPixelCoords(settings.col, settings.row);
        x = coordinates.x;
        y = coordinates.y;
      }
      
      this._super(game.SelectableEntity, "init", [
        {
          x: x,
          y: y,
          name: settings.resource,
          id: settings.id,
          refLayerName: Constants.Layers.Ground.Name,
          selector: Constants.Selectors.Floor,
          interaction: null
        }
      ]);
      this.addCollision("grounds_collision");
      this.addShape("grounds_shapes");
      this.body.collisionType = me.collision.types.WORLD_SHAPE;
      this.body.setCollisionMask(
        me.collision.types.WORLD_SHAPE
      );
  },
  getZIndex: function() {
    return Constants.playerZIndex - 2;
  },
  getType: function() {
    return "floor";
  }
});
