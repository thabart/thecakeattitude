var FurnitureSelector = me.Renderable.extend({
      init: function() {
        this.refLayer = me.game.world.getChildByName("Ground")[0];
        this.isFurnitureSelected = false;
        this._super(me.Renderable, 'init', [ 0, 0, 0, 0 ]);
        this.floating = true;
        this.currentTile = null;
        this.dirty = false;
        me.event.subscribe("pointermove", this.pointerMove.bind(this));
        me.event.subscribe('pointerdown', this.pointerDown.bind(this));
        this.viewportEvent = me.event.subscribe(me.event.VIEWPORT_ONCHANGE, this.viewportMove.bind(this));
        ShopStore.listenSelectedFurnitureChanged(this.setFurniture.bind(this));
      },

      pointerMove : function (evt) {
        if (!this.isFurnitureSelected) {
          return;
        }

        var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY); // Get bottom right corner.
        if (tile && tile !== this.currentTile) {
            var nbRows = Math.ceil(this.width / (this.refLayer.tilewidth));
            var nbCols = Math.ceil(this.height / this.refLayer.tileheight) - 1;
            console.log(nbRows);
            console.log(nbCols);
            this.refLayer.getRenderer().tileToPixelCoords(tile.col - nbRows, tile.row - nbCols, this.diamondShape.pos);
            me.game.viewport.worldToLocal(
              this.diamondShape.pos.x,
              this.diamondShape.pos.y,
              this.diamondShape.pos
            );

            console.log(this.diamondShape);
            this.currentTile = tile;
        };
      },

      pointerDown: function(evt) {
        if (!this.currentTile) { return; }        
        var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
        if (!tile) { return; }
        var position = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
        console.log(game.furnitures);
        var MySprite = new me.Sprite(position.x, position.y, {
          region: ShopStore.getSelectedFurniture(),
          image: game.furnitures
        });
        me.game.world.addChild(MySprite, 2);
      },

      setFurniture: function() {
        var region = game.furnitures.getRegion(ShopStore.getSelectedFurniture());
        if (!region) {
          return;
        }

        this.width = Math.ceil(region.width / (this.refLayer.tilewidth)) * (this.refLayer.tilewidth / 2);
        this.height = Math.ceil(region.height / this.refLayer.tileheight) * this.refLayer.tileheight;
        this.isFurnitureSelected = true;
        this.diamondShape = this.clone().toPolygon().toIso();
      },

      viewportMove : function (pos) {
        this.currentTile = null;
      },

      update : function (dt) {
        return (typeof(this.currentTile) === "object");
      },

      draw: function(renderer) {
        if (!this.currentTile) {
          return;
        }

        renderer.save();
        renderer.setColor("#FF0000");
        renderer.drawShape(this.diamondShape);
        renderer.restore();
      }
});
