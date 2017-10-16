game.FloorSelector = me.Object.extend({
	init: function() {
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
		this.sprite = null;
    me.event.subscribe("pointermove", this.pointerMove.bind(this));
    me.event.subscribe('pointerdown', this.pointerDown.bind(this));
		ShopStore.listenActiveFloorChanged(this.updateActiveFloor.bind(this));
		// ShopStore.listenSelectedFurnitureChanged(this.updateSelectedFurniture.bind(this));
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
			this.addFloor(evt);
			return;
		}
	},
	addFloor: function(evt) { // Add a furniture into the container.
		if (this.intersects) { return; }
		evt.handled = true;
		var activeFloor = ShopStore.getActiveFloor();
		var row = this.sprite.tile.row - this.sprite.nbRows;
		var col = this.sprite.tile.col - this.sprite.nbCols;
		var spr = new game.FloorEntity(this.sprite.pos.x, this.sprite.pos.y, activeFloor.name);
		ShopStore.addFloor(spr);
		me.game.world.addChild(spr);
		spr.pos.z = Constants.playerZIndex - 2;
		me.game.world.removeChild(this.sprite);
		this.sprite = null;
		ShopStore.setActiveFloor(null);
	},
	moveFurniture: function(evt) { // Move the selected floor.
		var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
		if (!tile) { return; }
		var activeFloor = ShopStore.getActiveFloor();
		var region = me.loader.getImage(activeFloor.name);
		var nbRows = Math.ceil(region.width / (this.refLayer.tilewidth / 2));
		var nbCols = Math.ceil(region.height / this.refLayer.tileheight);
		var coordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
		this.intersects = me.collision.check(this.sprite);
		if (this.intersects) {
			this.sprite.opacity(0.1);
		} else {
			this.sprite.opacity(0.5);
		}

		this.sprite.tile = tile;
		this.sprite.nbRows = nbRows;
		this.sprite.nbCols = nbCols;
		this.sprite.pos.x = coordinates.x;
		this.sprite.pos.y = coordinates.y;
	},
	updateActiveFloor: function() { // Update the active furniture.
		var activeFurniture = ShopStore.getActiveFloor();
		if(!activeFurniture || activeFurniture === null) { return; }
		if (this.sprite) {
			me.game.world.removeChild(this.sprite);
		}

		this.sprite = new game.FloorEntity(0,0, activeFurniture.name);
		this.sprite.opacity(0);
		if (activeFurniture.isFlipped) {
			this.sprite.flip();
		}

		me.game.world.addChild(this.sprite);
	}
});
