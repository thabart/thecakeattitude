game.Entities = game.Entities || {};
game.FurnitureEntity = game.SelectableEntity.extend({
  init: function (x, y, settings) {
    // console.log(settings);
    this._super(game.SelectableEntity, "init", [
      {
        x: x,
        y: y,
        name: settings.tile.tileset.name,
        refLayerName: Constants.Layers.Ground.Name,
        selector: Constants.Selectors.Furniture,
        isCollidable: true,
        interaction: null
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
  /*
  init: function (x, y, furnitureName, interaction) {
    console.log(furnitureName);
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
  */
});
game.Entities.FurnitureEntity = game.FurnitureEntity;
