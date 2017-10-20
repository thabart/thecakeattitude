game.FurnitureEntity = game.SelectableEntity.extend({
  init: function (x, y, furnitureName, interaction) {
    this._super(game.SelectableEntity, "init", [
      {
        x: x,
        y: y,
        name: furnitureName,
        refLayerName: Constants.Layers.Ground.Name,
        selector: Constants.Selectors.Furniture,
        isCollidable: true,
        interaction: interaction
      }
    ]);
    this.addCollision("furnitures_collision");
    this.addShape("furnitures_shapes");
    this.body.collisionType = me.collision.types.ACTION_OBJECT;
    this.body.setCollisionMask(
        me.collision.types.ACTION_OBJECT |
        me.collision.types.PLAYER_OBJECT
    );
  }
});
