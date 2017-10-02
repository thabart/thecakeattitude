var Furniture = me.Sprite.extend(
{
   init:function (x, y, regionName, selectionShape)
   {
    	this.refLayer = me.game.world.getChildByName("Ground")[0];
     	this._super(me.Sprite, "init", [ x, y, {
	        region: regionName,
	        image: game.furnitures
	     }]);
     	me.event.subscribe(me.event.VIEWPORT_ONCHANGE, this.viewportMove.bind(this));
     	this.selectionShape = selectionShape;
   },
   viewportMove: function() {
   		me.game.viewport.worldToLocal(
            this.selectionShape.pos.x,
            this.selectionShape.pos.y,
        	this.selectionShape.pos
       );
   },
   getSelectionShape: function() {
   	return this.selectionShape;
   }
});
