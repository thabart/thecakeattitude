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
		var imageName = ShopStore.getActiveFurniture();
		var region = me.loader.getImage(imageName);
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

		if (selectedFurniture) { evt.handled = true; }
		ShopStore.setSelectedFurniture(selectedFurniture);
	},
	addFurniture: function(evt) { // Add a furniture into the container.
		if (this.intersects) { return; }
		evt.handled = true;
		var furnitureName = ShopStore.getActiveFurniture();
		var row = this.sprite.tile.row - this.sprite.nbRows;
		var col = this.sprite.tile.col - this.sprite.nbCols;
		var spr = new game.FurnitureEntity(this.sprite.pos.x, this.sprite.pos.y, furnitureName);
		ShopStore.addFurniture(spr);

		var sprCoordinates = spr.getCoordinates(); // Update the collision layer.
		var collisionCoordinate = {
			col: sprCoordinates.col - Constants.Layers.Ground.Position.Col,
			row: sprCoordinates.row - Constants.Layers.Ground.Position.Row
		};
		for (var col = collisionCoordinate.col; col > collisionCoordinate.col - sprCoordinates.nbCols; col--) {
			for (var row = collisionCoordinate.row; row > collisionCoordinate.row - sprCoordinates.nbRows; row--) {
				game.collisionLayer.setWalkableAt(row, col, false);
			}
		}

		me.game.world.addChild(spr);
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
		var furnitureName = ShopStore.getActiveFurniture();
		if(!furnitureName) { return; }
		if (this.sprite) {
			me.game.world.removeChild(this.sprite);
		}

		this.sprite = new game.FurnitureEntity(0,0, furnitureName);
		this.sprite.opacity(0);
		me.game.world.addChild(this.sprite);
	}
});
