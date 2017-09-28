var TileSelector = me.Renderable.extend({
      init: function() {
        this.refLayer = me.game.world.getChildByName("Ground")[0];
        this._super(me.Renderable, 'init', [ 0, 0,
          this.refLayer.tilewidth / 2,
          this.refLayer.tileheight
        ]);

        this.floating = true;
        this.diamondShape = this.clone().toPolygon().toIso();
        this.currentTile = null;
        this.font = new me.Font("Arial", 10, "#FFFFFF");
        this.font.textAlign = "center";
        this.dirty = false;
        this.pointerEvent = me.event.subscribe("pointermove", this.pointerMove.bind(this));
        this.viewportEvent = me.event.subscribe(me.event.VIEWPORT_ONCHANGE, this.viewportMove.bind(this));
      },

      pointerMove : function (event) {
        var tile = this.refLayer.getTile(event.gameWorldX, event.gameWorldY);
        if (tile && tile !== this.currentTile) {
            this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row, this.diamondShape.pos);
            me.game.viewport.worldToLocal(
              this.diamondShape.pos.x,
              this.diamondShape.pos.y,
              this.diamondShape.pos
            );

            this.currentTile = tile;
        };
      },

      viewportMove : function (pos) {
        this.currentTile = null;
      },

      update : function (dt) {
        return (typeof(this.currentTile) === "object");
      },

      draw: function(renderer) {
        if (this.currentTile) {
          renderer.save();
          renderer.setColor("#FF0000");
          renderer.drawShape(this.diamondShape);
          renderer.setColor("#FFFFFF");
          this.font.draw (
            renderer,
            "( " + this.currentTile.col + "/" + this.currentTile.row + " )",
            this.diamondShape.pos.x,
            (this.diamondShape.pos.y + (this.currentTile.height / 2) - 8)
          );
          renderer.restore();
        }
      }
});
