game.SelectableEntitySelector = me.Object.extend({
	init: function(refLayerName, selectorName) {
		this.selectorName = selectorName;
    this.refLayer = me.game.world.getChildByName(refLayerName)[0];
		this.sprite = null;
	  this.pointerMoveSub = me.event.subscribe("pointermove", this.pointerMove.bind(this));
	  this.pointerDownSub = me.event.subscribe('pointerdown', this.pointerDown.bind(this));
		this.updateActiveEntityB = this.updateActiveEntity.bind(this);
		game.Stores.GameStore.listenActiveEntityChanged(this.updateActiveEntityB);
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
		var activeEntity = game.Stores.GameStore.getActiveEntity();
		var region = me.loader.getImage(activeEntity.name);
		var nbRows = Math.ceil(region.width / (this.refLayer.tilewidth / 2));
		var nbCols = Math.ceil(region.height / this.refLayer.tileheight);
		var coordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
		this.intersects = me.collision.check(this.sprite);
		if (!this.intersects) {
			if (this.isAtLimit) {
				this.intersects = this.isAtLimit(this.sprite.getCoordinates(tile), this.sprite.flipped);
			}
		}

		if (this.intersects) {
			this.sprite.opacity(0.1);
		} else {
			this.sprite.opacity(0.5);
		}

		// Check entity is at the limit of the world.
		this.sprite.tile = tile;
		this.sprite.nbRows = nbRows;
		this.sprite.nbCols = nbCols;
		this.sprite.pos.x = coordinates.x;
		this.sprite.pos.y = coordinates.y;
		if (this.moveCallback) {
			this.moveCallback();
		}
	},
	selectEntity: function(evt) { // Select the entity.
		var entities = game.Stores.GameStore.getEntities();
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
			game.Stores.GameStore.displayInformation(selectedEntity.metadata);
			game.Stores.GameStore.displayActions(selectedEntity.metadata);
		} else {
			game.Stores.GameStore.hideInformation();
			game.Stores.GameStore.hideActions();
		}

		game.Stores.GameStore.setSelectedEntity(selectedEntity);
	},
	addEntity: function(evt) { // Add an entity into the container.
		if (this.intersects) { return; }
		evt.handled = true;
		var activeEntity = game.Stores.GameStore.getActiveEntity();
		var row = this.sprite.tile.row - this.sprite.nbRows;
		var col = this.sprite.tile.col - this.sprite.nbCols;
		var spr = this.create(this.sprite.pos.x, this.sprite.pos.y, { resource: activeEntity.name, interaction: activeEntity.interaction });
		me.game.world.addChild(spr);
		if (activeEntity.isFlipped) {
			spr.flip();
		}

		game.Stores.GameStore.addEntity(spr);
		spr.pos.z = spr.getZIndex();
		me.game.world.removeChild(this.sprite);
		this.sprite = null;
		game.Stores.GameStore.setActiveEntity(null);
	},
	updateActiveEntity: function() { // Update the active entity.
		var activeEntity = game.Stores.GameStore.getActiveEntity();
		if(!activeEntity) { return; }
		if (activeEntity.selector !== this.selectorName) {
			if (this.sprite) {
				me.game.world.removeChild(this.sprite);
				this.sprite = null;
			}

			return;
		}

		if (this.sprite) {
			me.game.world.removeChild(this.sprite);
		}

		this.sprite = this.create(0,0, { resource: activeEntity.name });
		this.sprite.opacity(0);
		if (activeEntity.isFlipped) {
			this.sprite.flip();
		}

		me.game.world.addChild(this.sprite);
	},
	destroy: function() { // Unsubscribe the events.
    me.event.unsubscribe(this.pointerMoveSub);
    me.event.unsubscribe(this.pointerDownSub);
    game.Stores.GameStore.unsubscribeActiveEntityChanged(this.updateActiveEntityB);
	}
});
