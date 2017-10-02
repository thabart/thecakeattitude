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
        var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
        var existingFurnitures = ShopStore.getFurnitures();
        if (tile && tile !== this.currentTile) {
            var nbRows = Math.ceil(this.width / (this.refLayer.tilewidth));
            var nbCols = Math.ceil(this.height / this.refLayer.tileheight) - 1;
            this.refLayer.getRenderer().tileToPixelCoords(tile.col - nbRows, tile.row - nbCols, this.diamondShape.pos);
            var clonedDiamonShape = this.diamondShape.clone();
            me.game.viewport.worldToLocal(
              this.diamondShape.pos.x,
              this.diamondShape.pos.y,
              this.diamondShape.pos
            );
            var alreadyExists = false;
            var minX = clonedDiamonShape.pos.x;
            var maxX = clonedDiamonShape.pos.x + this.width;
            var minY = clonedDiamonShape.pos.y;
            var maxY = clonedDiamonShape.pos.y + (this.height / 2);
            existingFurnitures.forEach(function(furniture) {
              var newMaxX = furniture.getSelector().pos.x + self.width;
              var newMaxY = furniture.getSelector().pos.y + (self.height / 2);
              console.log("old y " + minY);
              console.log("old max y " + maxY);
              console.log("new y " + furniture.getSelector().pos.y);
              console.log("new max y " + newMaxY);
              console.log("old x " + minX);
              console.log("old max x " + maxX);
              console.log("new x " + furniture.getSelector().pos.x);
              console.log("new max x " + newMaxX);
              if ((minX < newMaxX && maxX > furniture.getSelector().pos.x) && (minY < newMaxY && maxY > furniture.getSelector().pos.y)) {
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
        var position = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
        var container = new game.EditableSpriteContainer(position, regionName, game.furnitures);
        me.game.world.addChild(container, 10);
        ShopStore.addFurniture(container);
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
        if (!this.overlaped) {
          renderer.setColor("#FF0000");
        } else {
          renderer.setColor("#c0c0c0");
        }

        renderer.drawShape(this.diamondShape);
        renderer.restore();
      }
});
