game.TileSelector = me.Object.extend({
	init: function(zIndex) {
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
    this.sprite = new me.Sprite(0, 0 , {
      image: "tile_hover"
    });
		this.sprite.alpha = 0;
    me.game.world.addChild(this.sprite, zIndex);
    this.pointerEvent = me.event.subscribe("pointermove", this.pointerMove.bind(this));
	},
  pointerMove : function (evt) { // Move the cursor when the mouse move.
    var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
    if (tile) {
			this.sprite.alpha = 1;
      var coordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
      this.sprite.pos.x = coordinates.x;
      this.sprite.pos.y = coordinates.y + this.sprite.height / 2;
      me.game.repaint();
    };
  }
});