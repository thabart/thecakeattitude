game.FloorEntity = game.SelectableEntity.extend({
  init: function (x, y, floorName) {
    this._super(game.SelectableEntity, "init", [
      {
        x: x,
        y: y,
        name: floorName,
        refLayerName: Constants.Layers.Ground.Name
      }
    ]);
    this.body.collisionType = me.collision.types.WORLD_SHAPE;
    this.body.setCollisionMask(
      me.collision.types.WORLD_SHAPE
    );
  }
});
