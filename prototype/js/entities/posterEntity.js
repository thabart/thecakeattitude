game.PosterEntity = game.SelectableEntity.extend({
  init: function (x, y, posterName, interaction) {
    this._super(game.SelectableEntity, "init", [
      {
        x: x,
        y: y,
        name: posterName,
        refLayerName: Constants.Layers.Wall.Name,
        selector: Constants.Selectors.Wall,
        interaction: interaction
      }
    ]);
    this.addCollision("posters_collision");
    this.addShape("walls_shapes");
    this.body.collisionType = me.collision.types.ACTION_OBJECT;
  }
});
