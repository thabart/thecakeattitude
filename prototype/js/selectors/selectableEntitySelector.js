game.SelectableEntitySelector = me.Object.extend({
	init: function(refLayerName, selectorName) {
		this.selectorName = selectorName;
    this.refLayer = me.game.world.getChildByName(refLayerName)[0];
		this.sprite = null;
    me.event.subscribe("pointermove", this.pointerMove.bind(this));
    me.event.subscribe('pointerdown', this.pointerDown.bind(this));
		ShopStore.listenActiveEntityChanged(this.updateActiveEntity.bind(this));
		ShopStore.listenSelectedEntityChanged(this.updateSelectedEntity.bind(this));
	},
  pointerMove : function (evt) { // Move the entity.
		if (this.sprite) {
			this.moveEntity(evt);
			return;
		}
  },
	pointerDown: function(evt) { // Add the entity.
		if (evt.which !== 1) { return; }
		if (evt.handled) { return; }
		if (this.sprite) {
			this.addEntity(evt);
			return;
		}

		this.selectEntity(evt);
	},
	moveEntity: function(evt) { // Move the selected entity.
		var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
		if (!tile) { return; }
		var activeEntity = ShopStore.getActiveEntity();
		var region = me.loader.getImage(activeEntity.name);
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
	selectEntity: function(evt) { // Select the entity.
		var entities = ShopStore.getEntities();
		if (!entities || entities.length === 0) { return; }
		var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
		if (!tile) { return; }
		var selectedEntity = null;
		entities.forEach(function(entity) {
			if (entity.getBounds().containsPoint(evt.gameWorldX, evt.gameWorldY) && !selectedEntity) {
				selectedEntity = entity;
			}
		});

		if (selectedEntity) {
			evt.handled = true;
			ShopStore.displayInformation(selectedEntity.metadata);
			ShopStore.displayActions();
		} else {
			ShopStore.hideInformation();
			ShopStore.hideActions();
		}

		ShopStore.setSelectedEntity(selectedEntity);
	},
	addEntity: function(evt) { // Add an entity into the container.
		if (this.intersects) { return; }
		evt.handled = true;
		var activeEntity = ShopStore.getActiveEntity();
		var row = this.sprite.tile.row - this.sprite.nbRows;
		var col = this.sprite.tile.col - this.sprite.nbCols;
		var spr = this.create(this.sprite.pos.x, this.sprite.pos.y, activeEntity.name);
		ShopStore.addEntity(spr);
		me.game.world.addChild(spr);
		if (activeEntity.isFlipped) {
			spr.flip();
		}

		spr.pos.z = Constants.playerZIndex;
		me.game.world.removeChild(this.sprite);
		this.sprite = null;
		ShopStore.setActiveEntity(null);
	},
	updateSelectedEntity: function() { // Update the selected entity.
		var selectedEntity = ShopStore.getSelectedEntity();
		var entities = ShopStore.getEntities();
		entities.forEach(function(entity) {
			if (entity === selectedEntity) {
				entity.opacity(0.5);
			} else {
				entity.opacity(1);
			}
		});

		me.game.repaint();
	},
	updateActiveEntity: function() { // Update the active entity.
		var activeEntity = ShopStore.getActiveEntity();
		if(!activeEntity) { return; }
		if (activeEntity.selector !== this.selectorName) { return; }
		if (this.sprite) {
			me.game.world.removeChild(this.sprite);
		}

		this.sprite = this.create(0,0, activeEntity.name);
		this.sprite.opacity(0);
		if (activeEntity.isFlipped) {
			this.sprite.flip();
		}

		me.game.world.addChild(this.sprite);
	}
});
