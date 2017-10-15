game.PosterSelector = me.Object.extend({
  init: function(zIndex) {
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Wall.Name)[0];
		this.sprite = null;
		this.zIndex = zIndex;
    me.event.subscribe("pointermove", this.pointerMove.bind(this));
    me.event.subscribe("pointerdown", this.pointerDown.bind(this));
		ShopStore.listenActivePosterChanged(this.updateActivePoster.bind(this));
  },
  pointerMove(evt) { // Move the poster.
		if (this.sprite) {
			this.movePoster(evt);
			return;
		}
  },
	pointerDown: function(evt) { // Add the poster.
		if (evt.which !== 1) { return; }
		if (this.sprite) {
			this.addFurniture(evt);
			return;
		}
	},
	addFurniture: function(evt) { // Add a poster into the container.
		// if (this.intersects) { return; }
		evt.handled = true;
		var activePoster = ShopStore.getActivePoster();
		var spr = new game.PosterEntity(this.sprite.pos.x, this.sprite.pos.y, activePoster.name);
		ShopStore.addPoster(spr);
		if (this.sprite.flipped) {
			spr.flip();
		}

		me.game.world.addChild(spr);
		spr.pos.z = Constants.playerZIndex - 1;
		me.game.world.removeChild(this.sprite);
		this.sprite = null;
		ShopStore.setActivePoster(null);
	},
  movePoster(evt) { // Move the selected poster.
		var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
		if (!tile) { return; }
    var isLeftWall = tile.row > Constants.Layers.Wall.Position.Row;
    if ((!this.sprite.flipped && isLeftWall) || (this.sprite.flipped && !isLeftWall)) {
      this.sprite.flip();
    }

    var activePoster = ShopStore.getActivePoster();
		var region = me.loader.getImage(activePoster.name);
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
	updateActivePoster: function() { // Update the active furniture.
		var activePoster = ShopStore.getActivePoster();
		if(!activePoster) { return; }
		if (this.sprite) {
			me.game.world.removeChild(this.sprite);
		}

		this.sprite = new game.PosterEntity(0,0, activePoster.name);
		this.sprite.opacity(0);
		me.game.world.addChild(this.sprite);
		this.sprite.pos.z = Constants.playerZIndex - 1;
	}
});
