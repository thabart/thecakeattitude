var FurnitureSelector = me.Renderable.extend({
      init: function() {
        this.refLayer = me.game.world.getChildByName("Ground")[0];
        this.isFurnitureSelected = false;
        this.diamondShape = null;
        this.overlaped = false;
        this._super(me.Renderable, 'init', [ 0, 0, 0, 0 ]);
        this.floating = true;
        this.currentTile = null;
        this.dirty = false;
        me.event.subscribe("pointermove", this.pointerMove.bind(this));
        me.event.subscribe('pointerdown', this.pointerDown.bind(this));
        ShopStore.listenSelectedFurnitureChanged(this.setFurniture.bind(this));
      },

      pointerMove : function (evt) {
        if (!this.isFurnitureSelected) {
          return;
        }

        var self = this;
        var diamond2d = this.diamondShape.clone().to2d();
        var nbCols = diamond2d.getBounds().width / (this.refLayer.tilewidth / 2);
        var nbRows = diamond2d.getBounds().height / this.refLayer.tileheight;
        var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
        var existingFurnitures = ShopStore.getFurnitures();
        if (tile && tile !== this.currentTile) {
            var bottomLeftTileCoordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col + nbCols - 1, tile.row + nbRows - 1);
            var bottomLeftTile = this.refLayer.getTile(bottomLeftTileCoordinates.x, bottomLeftTileCoordinates.y);
            if (!bottomLeftTile) return;
            this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row, this.diamondShape.pos);
            var clonedDiamonShape = this.diamondShape.clone();
            me.game.viewport.worldToLocal(
              this.diamondShape.pos.x,
              this.diamondShape.pos.y,
              this.diamondShape.pos
            );
            var diamon2dShape = new me.Rect(tile.col, tile.row, nbCols, nbRows);
            var alreadyExists = false;
            existingFurnitures.forEach(function(furniture) {
              if (furniture.get2dShape().overlaps(diamon2dShape)) {
                alreadyExists = true;
              }
            });

            this.overlaped = alreadyExists;
            this.currentTile = tile;
        };
      },

      pointerDown: function(evt) {
        if (!this.currentTile) { return; }
        var regionName = ShopStore.getSelectedFurniture();
        var region = game.furnitures.getRegion(regionName);
        var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
        if (!tile) { return; }
        var container = new game.EditableSpriteContainer(tile, regionName, game.furnitures);
        me.game.world.addChild(container, 10);
        ShopStore.addFurniture(container);
      },

      setFurniture: function() {
        var region = game.furnitures.getRegion(ShopStore.getSelectedFurniture());
        if (!region) {
          return;
        }

        var width = Math.ceil(region.width / (this.refLayer.tilewidth)) * (this.refLayer.tilewidth / 2);
        var height = Math.ceil(region.height / this.refLayer.tileheight) * this.refLayer.tileheight;
        this.diamondShape = new me.Rect(0, 0, width, height).toPolygon().toIso();
        this.isFurnitureSelected = true;
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
        if (!this.overlaped) {
          renderer.setColor("#FF0000");
        } else {
          renderer.setColor("#c0c0c0");
        }

        renderer.drawShape(this.diamondShape);
        renderer.restore();
      }
});
