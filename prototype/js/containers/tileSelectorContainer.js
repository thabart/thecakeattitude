game.TileSelectorContainer = me.Container.extend({
	init: function() {
		this._super(me.Container, "init", [ 0, 0, me.game.world.width, me.game.world.height ]);
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground)[0];
    this.sprite = new me.Sprite(0, 0 , {
      image: "tile_hover"
    });
    this.addChild(this.sprite, 1);
    this.pointerEvent = me.event.subscribe("pointermove", this.pointerMove.bind(this));
	},
  pointerMove : function (evt) { // Move the cursor when the mouse move.
    var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
    if (tile) {
      var coordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
      this.sprite.pos.x = coordinates.x + 5; // TODO : Replace the coordinates if needed.
      this.sprite.pos.y = coordinates.y + 8;
    };
  }
});
