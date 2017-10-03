game.EditableSpriteContainer = me.Container.extend({
	init: function(tile, regionName, texture, orientation) {
		this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground)[0];
        var region = game.furnitures.getRegion(regionName);
		var w = Math.ceil(region.width / (this.refLayer.tilewidth)) * (this.refLayer.tilewidth / 2);
		var h = Math.ceil(region.height / this.refLayer.tileheight) * this.refLayer.tileheight;
        var nbCols = w / (this.refLayer.tilewidth / 2);
        var nbRows = h / this.refLayer.tileheight;
        var position = this.refLayer.getRenderer().tileToPixelCoords(tile.col + nbCols - 1, tile.row + nbRows - 1);
        // var position = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
        var redFramePosition = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
        this._super(me.Container, "init", [ position.x, position.y, w, h ]);
        this.sprite = new me.Sprite(0, 0 , {
        	region: regionName,
        	image: texture
        });
        this.addChild(this.sprite, 1);
        this.name = "EditableSprite";
        this.shape2d = new me.Rect(tile.col, tile.row, nbCols, nbRows);        
        if (orientation === 'column') {
          this.sprite.flipX();
        }
        // this.selector = new Selector(redFramePosition.x, redFramePosition.y, w , h);
        // this.addChild(this.selector, 2);
	},
    update : function(dt) {
    	return this._super(me.Container, "update", [ dt ]);
    },
	getSelector: function() {
		return this.selector;
	},
    get2dShape: function() {
        return this.shape2d;
    },
    getSprite: function() {
        return this.sprite;
    }
});
