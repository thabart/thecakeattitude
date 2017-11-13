game.TileSelectorEntity = me.Entity.extend({
    init: function(col, row) {
        this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
        var coordinates = this.refLayer.getRenderer().tileToPixelCoords(col, row);
        var image = me.loader.getImage("tile_hover");
        this._super(me.Entity, "init", [coordinates.x, coordinates.y, {
          width: image.width,
          height: image.height
        }]);
        this.body.gravity = 0;
        var texture =  new me.video.renderer.Texture(
            { framewidth: image.width, frameheight: image.height },
            image
        );
        this.body.pos.x = -(image.width / 2);
        this.body.collisionType = me.collision.types.ACTION_OBJECT;
        this.body.setCollisionMask(
            me.collision.types.PLAYER_OBJECT
        );
        this.pointerMoveSub = me.event.subscribe('pointermove', this.pointerMove.bind(this));
        this.renderable = texture.createAnimationFromName([0]);
        this.renderable.addAnimation("stay", [0]);
        this.renderable.setCurrentAnimation("stay");
        this.renderable.alpha = 0;
    },
    pointerMove: function(evt) {
      var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
      if (!tile) { return; }
      this.renderable.alpha = 1;
      var coordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
      this.pos.x = coordinates.x;
      this.pos.y = coordinates.y;
      console.log('row '+ tile.row+" col "+ tile.col+" x " + this.pos.x+" y "+this.pos.y);
    },
    update: function(dt) {
      this._super(me.Entity, "update", [dt]);
      return true;
    },
    destroy: function() {
      if (this.pointerMoveSub) me.event.unsubscribe(this.pointerMoveSub);
    }
});
