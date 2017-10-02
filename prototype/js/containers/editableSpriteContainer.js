game.EditableSpriteContainer = me.Container.extend({
	init: function(position, size, selector, regionName, texture) {
        this._super(me.Container, "init", [0, 0, me.game.world.width, me.game.world.height]);
        this.sprite = new me.Sprite(position.x, position.y, {
        	region: regionName,
        	image: texture
        });	
        this.selector = new Selector(selector);
        this.name = "EditableSprite";
        this.addChild(this.sprite, 12);
        this.addChild(this.selector, 11);
	},
    update : function(dt) {
        return this._super(me.Container, "update", [ dt ]);
    }
});