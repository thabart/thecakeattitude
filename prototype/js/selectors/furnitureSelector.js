game.FurnitureSelector = me.Object.extend({
	init: function(zIndex) {
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
		this.sprite = null;
		this.zIndex = zIndex;
    me.event.subscribe("pointermove", this.pointerMove.bind(this));
    me.event.subscribe('pointerdown', this.pointerDown.bind(this));
		ShopStore.listenActiveFurnitureChanged(this.updateActiveFurniture.bind(this));
		ShopStore.listenSelectedFurnitureChanged(this.updateSelectedFurniture.bind(this));
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
		var activeFurniture = ShopStore.getActiveFurniture();
		var region = me.loader.getImage(activeFurniture.name);
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
	selectFurniture: function(evt) {
		var furnitures = ShopStore.getFurnitures();
		if (!furnitures || furnitures.length === 0) { return; }
		var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
		if (!tile) { return; }
		var selectedFurniture = null;
		furnitures.forEach(function(furniture) {
			if (furniture.getBounds().containsPoint(evt.gameWorldX, evt.gameWorldY) && !selectedFurniture) {
				selectedFurniture = furniture;
			}
		});

		if (selectedFurniture) {
			evt.handled = true;
			ShopStore.displayInformation(selectedFurniture.metadata);
			ShopStore.displayActions();
		} else {
			ShopStore.hideInformation();
			ShopStore.hideActions();
		}

		ShopStore.setSelectedFurniture(selectedFurniture);
	},
	addFurniture: function(evt) { // Add a furniture into the container.
		if (this.intersects) { return; }
		evt.handled = true;
		var activeFurniture = ShopStore.getActiveFurniture();
		var row = this.sprite.tile.row - this.sprite.nbRows;
		var col = this.sprite.tile.col - this.sprite.nbCols;
		var spr = new game.FurnitureEntity(this.sprite.pos.x, this.sprite.pos.y, activeFurniture.name);
		ShopStore.addFurniture(spr);
		me.game.world.addChild(spr);
		if (activeFurniture.isFlipped) {
			spr.flip();
		}

		spr.pos.z = Constants.playerZIndex;
		me.game.world.removeChild(this.sprite);
		this.sprite = null;
		ShopStore.setActiveFurniture(null);
	},
	updateSelectedFurniture: function() { // Update the selected furniture.
		var selectedFurniture = ShopStore.getSelectedFurniture();
		var furnitures = ShopStore.getFurnitures();
		furnitures.forEach(function(furniture) {
			if (furniture === selectedFurniture) {
				furniture.opacity(0.5);
			} else {
				furniture.opacity(1);
			}
		});

		me.game.repaint();
	},
	updateActiveFurniture: function() { // Update the active furniture.
		var activeFurniture = ShopStore.getActiveFurniture();
		if(!activeFurniture) { return; }
		if (this.sprite) {
			me.game.world.removeChild(this.sprite);
		}

		this.sprite = new game.FurnitureEntity(0,0, activeFurniture.name);
		this.sprite.opacity(0);
		if (activeFurniture.isFlipped) {
			this.sprite.flip();
		}

		me.game.world.addChild(this.sprite);
	}
});
