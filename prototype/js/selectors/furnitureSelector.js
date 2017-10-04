game.FurnitureSelector = me.Object.extend({
	init: function(zIndex) {
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground)[0];
		this.sprite = null;
		this.zIndex = zIndex;
    me.event.subscribe("pointermove", this.pointerMove.bind(this));
    me.event.subscribe('pointerdown', this.pointerDown.bind(this));
		ShopStore.listenSelectedFurnitureChanged(this.updateFurniture.bind(this));
		ShopStore.listenOrientationChanged(this.updateFurniture.bind(this));
	},
  pointerMove : function (evt) { // Move the furniture.
		if (!this.sprite) { return; }
	  var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
		if (!tile) { return; }
		var regionName = ShopStore.getSelectedFurniture();
		var region = game.furnitures.getRegion(regionName);
		var nbRows = Math.ceil(region.width / (this.refLayer.tilewidth / 2));
		var nbCols = Math.ceil(region.height / this.refLayer.tileheight);
		var topRightCornerCoordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col - nbCols + 1, tile.row - nbRows + 1);
		var tileTopRight = this.refLayer.getTile(topRightCornerCoordinates.x, topRightCornerCoordinates.y);
		if(!tileTopRight) { return; }
		var coordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
    this.sprite.pos.x = coordinates.x + ((0.5 * region.width) / nbRows);
    this.sprite.pos.y = coordinates.y - ((0.5 * region.height) / nbCols);
  },
	pointerDown: function(evt) { // Add the furniture.
		if (!this.sprite) { return; }
		if (evt.which !== 1) { return; }
		var regionName = ShopStore.getSelectedFurniture();
		var spr = new me.Sprite(this.sprite.pos.x, this.sprite.pos.y , {
			region: regionName,
			image: game.furnitures
		});
		me.game.world.addChild(spr, this.zIndex);
		me.game.world.removeChild(this.sprite);
		this.sprite = null;
	},
	updateFurniture: function() { // Update the selected furniture.
		var regionName = ShopStore.getSelectedFurniture();
		if (this.sprite) {
			me.game.world.removeChild(this.sprite);
		}

		this.sprite = new me.Sprite(0, 0 , {
			region: regionName,
			image: game.furnitures
		});
		this.sprite.alpha = 0.2;
		me.game.world.addChild(this.sprite, this.zIndex);
	}
});
