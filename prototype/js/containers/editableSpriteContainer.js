game.EditableSpriteContainer = me.Container.extend({
	init: function(position, regionName, texture) {
				this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground)[0];
        var region = game.furnitures.getRegion(regionName);
        var tile = this.refLayer.getTile(position.x, position.y);
				var w = Math.ceil(region.width / (this.refLayer.tilewidth)) * (this.refLayer.tilewidth / 2);
				var h = Math.ceil(region.height / this.refLayer.tileheight) * this.refLayer.tileheight;
        var nbRows = Math.ceil(w / (this.refLayer.tilewidth));
        var nbCols = Math.ceil(h / this.refLayer.tileheight) - 1;
				var redFramePosition = this.refLayer.getRenderer().tileToPixelCoords(tile.col - nbRows, tile.row - nbCols);
        this._super(me.Container, "init", [ 0, 0 ]);
        this.sprite = new me.Sprite(position.x, position.y, {
        	region: regionName,
        	image: texture
        });
        this.addChild(this.sprite, 1);
				this.selector = new Selector(redFramePosition.x, redFramePosition.y, w , h);
        this.name = "EditableSprite";
        this.addChild(this.selector, 2);
	},
  update : function(dt) {
    		return this._super(me.Container, "update", [ dt ]);
  },
	getSelector: function() {
				return this.selector;
	}
});
