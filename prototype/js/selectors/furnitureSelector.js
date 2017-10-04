game.FurnitureSelector = me.Object.extend({
	init: function(zIndex) {
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground)[0];
		this.sprite = null;
		this.zIndex = zIndex;
    me.event.subscribe("pointermove", this.pointerMove.bind(this));
    me.event.subscribe('pointerdown', this.pointerDown.bind(this));
		ShopStore.listenSelectedFurnitureChanged(this.updateFurniture.bind(this));
		// ShopStore.listenOrientationChanged(this.updateFurniture.bind(this));
	},
  pointerMove : function (evt) { // Move the furniture.
		if (this.sprite) {
			this.moveFurniture(evt);
			return;
		}
  },
	pointerDown: function(evt) { // Add the furniture.
		if (evt.which !== 1) { return; }
		if (this.sprite) {
			this.addFurniture(evt);
			return;
		}

		this.selectFurniture(evt);
	},
	moveFurniture: function(evt) { // Move the selected furniture.
		var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
		if (!tile) { return; }
		var regionName = ShopStore.getSelectedFurniture();
		var region = game.furnitures.getRegion(regionName);
		var nbRows = Math.ceil(region.width / (this.refLayer.tilewidth / 2));
		var nbCols = Math.ceil(region.height / this.refLayer.tileheight);
		var topRightCornerCoordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col - nbCols + 1, tile.row - nbRows + 1);
		var tileTopRight = this.refLayer.getTile(topRightCornerCoordinates.x, topRightCornerCoordinates.y);
		if(!tileTopRight) { return; }
		var furnitures = ShopStore.getFurnitures();
		var intersects = false;
		if (furnitures && furnitures.length > 0) {
			var rect = new me.Rect(tile.row, tile.col, nbRows, nbCols);
			furnitures.forEach(function(furniture) {
				if (furniture.rect.overlaps(rect)) {
					intersects = true;
					return;
				}
			});
		}

		var coordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
		if (intersects) {
			this.sprite.alpha = 0.1;
		} else {
			this.sprite.alpha = 0.5;
		}

		this.sprite.tile = tile;
		this.sprite.nbRows = nbRows;
		this.sprite.nbCols = nbCols;
		this.sprite.pos.x = coordinates.x + ((0.5 * region.width) / nbRows);
		this.sprite.pos.y = coordinates.y - ((0.5 * region.height) / nbCols);
	},
	selectFurniture: function(evt) {
		var furnitures = ShopStore.getFurnitures();
		if (!furnitures || furnitures.length === 0) { return; }
		var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
		if (!tile) { return; }
		var selectedFurniture = null;
		furnitures.forEach(function(furniture) {
			if (furniture.rect.containsPoint(tile.row, tile.col)) {
				selectedFurniture = furniture;
			}
		});


	},
	addFurniture: function(evt) {
		var regionName = ShopStore.getSelectedFurniture();
		var rect = new me.Rect(this.sprite.tile.row, this.sprite.tile.col, this.sprite.nbRows, this.sprite.nbCols);
		var spr = new me.Sprite(this.sprite.pos.x, this.sprite.pos.y , {
			region: regionName,
			image: game.furnitures
		});
		var entity = new game.FurnitureEntity(spr, rect);
		ShopStore.addFurniture(entity);
		me.game.world.addChild(spr, this.zIndex);
		me.game.world.removeChild(this.sprite);
		this.sprite = null;
		ShopStore.setSelectedFurniture(null);
	},
	updateFurniture: function() { // Update the selected furniture.
		var regionName = ShopStore.getSelectedFurniture();
		if(!regionName) { return; }
		if (this.sprite) {
			me.game.world.removeChild(this.sprite);
		}

		this.sprite = new me.Sprite(0, 0 , {
			region: regionName,
			image: game.furnitures
		});
		this.sprite.alpha = 0.5;
		me.game.world.addChild(this.sprite, this.zIndex);
	}
});
