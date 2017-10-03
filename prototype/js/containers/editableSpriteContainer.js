game.EditableSpriteContainer = me.Container.extend({
	init: function(tile, regionName, texture) {
		this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground)[0];
        var region = game.furnitures.getRegion(regionName);
		var w = Math.ceil(region.width / (this.refLayer.tilewidth)) * (this.refLayer.tilewidth / 2);
		var h = Math.ceil(region.height / this.refLayer.tileheight) * this.refLayer.tileheight;
        var nbCols = w / (this.refLayer.tilewidth / 2);
        var nbRows = h / this.refLayer.tileheight;
        console.log(this.refLayer.tileheight);
        console.log(h);
        console.log(nbCols);
        var position = this.refLayer.getRenderer().tileToPixelCoords(tile.col + nbCols - 1, tile.row + nbRows - 1);
        var redFramePosition = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
        this._super(me.Container, "init", [ 0, 0 ]);
        this.sprite = new me.Sprite(position.x, position.y, {
        	region: regionName,
        	image: texture
        });
        this.addChild(this.sprite, 1);
		this.selector = new Selector(redFramePosition.x, redFramePosition.y, w , h);
        this.name = "EditableSprite";
        this.shape2d = new me.Rect(tile.col, tile.row, nbCols, nbRows);
        this.addChild(this.selector, 2);
	},
    update : function(dt) {
    	return this._super(me.Container, "update", [ dt ]);
    },
	getSelector: function() {
		return this.selector;
	},
    get2dShape: function() {
        return this.shape2d;
    }
});
