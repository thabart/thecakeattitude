game.Entities = game.Entities || {};
game.Entities.FurnitureEntity = game.SelectableEntity.extend({
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
        refLayerName: Constants.Layers.Ground.Name,
        selector: Constants.Selectors.Furniture,
        isCollidable: true,
        interaction: null,
        flipped: settings.flipped || false
      }
    ]);
    this.addCollision("furnitures_collision");
    this.addShape("furnitures_shapes");
    this.body.collisionType = me.collision.types.ACTION_OBJECT;
    this.body.setCollisionMask(
        me.collision.types.ACTION_OBJECT |
        me.collision.types.PLAYER_OBJECT
    );
  },
  getZIndex: function() {
    return Constants.playerZIndex;
  }
});
