var Selector = me.Renderable.extend({
      init: function(selector) {
        this.oneTime = false;
        this.refLayer = me.game.world.getChildByName("Ground")[0];
        this._super(me.Renderable, 'init', [ 0, 0,
          selector.getBounds().width,
          selector.getBounds().height
        ]);
        this.diamondShape = selector;
        this.floating = true;
        this.dirty = false;
        console.log('coucou');
      },

      update : function(dt) {
        return false;
      },

      draw: function(renderer) {
        renderer.save();
        renderer.setColor("#FF0000");
        renderer.drawShape(this.diamondShape);
        renderer.restore();      
      }
});
