var FurnitureSelector = me.Renderable.extend({
      init: function() {
        this.refLayer = me.game.world.getChildByName("Ground")[0];
        this.isFurnitureSelected = false;
        this.diamondShape = null;
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
            me.game.viewport.worldToLocal(
              this.diamondShape.pos.x,
              this.diamondShape.pos.y,
              this.diamondShape.pos
            );
            var alreadyExists = false;
            // var normalPosition = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
            /*
            var region = game.furnitures.getRegion(ShopStore.getSelectedFurniture()); 
            var square = new me.Rect(normalPosition.x, normalPosition.y, 
              Math.ceil(region.width / (this.refLayer.tilewidth)) * (this.refLayer.tilewidth), 
              Math.ceil(region.height / this.refLayer.tileheight) * this.refLayer.tileheight);
            existingFurnitures.forEach(function(furniture) {
              if (square.overlaps(furniture)) {
                alreadyExists = true;
              }
            });
            */

            if (alreadyExists) { this.currentTile = null; return; }
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
        var container = new game.EditableSpriteContainer(position, { w : this.diamondShape.getBounds().width, h: this.diamondShape.getBounds().height }, 
          this.diamondShape.clone(), regionName, game.furnitures);
        me.game.world.addChild(container, 10);
        ShopStore.addFurniture(container);
        /*
        var furniture = new Furniture(position.x, position.y, ShopStore.getSelectedFurniture(), this.diamondShape.clone());
        me.game.world.addChild(furniture, 10);
        ShopStore.addFurniture(furniture);
        */
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
        var furnitures = ShopStore.getFurnitures();
        furnitures.forEach(function(furniture) {
          renderer.drawShape(furniture.getSelectionShape());          
        });
        renderer.restore();
      }
});
