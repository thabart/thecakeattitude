game.TileSelector = me.Object.extend({
	init: function(zIndex) {
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground)[0];
    this.sprite = new me.Sprite(0, 0 , {
      image: "tile_hover"
    });
    me.game.world.addChild(this.sprite, zIndex);
    this.pointerEvent = me.event.subscribe("pointermove", this.pointerMove.bind(this));
	},
  pointerMove : function (evt) { // Move the cursor when the mouse move.
    var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
    if (tile) {
      var coordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
      this.sprite.pos.x = coordinates.x + 5; // TODO : Replace the coordinates if needed.
      this.sprite.pos.y = coordinates.y + 8;
      me.game.repaint();
    };
  }
});
