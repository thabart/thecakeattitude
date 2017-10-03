var Selector = me.Renderable.extend({
      init: function(x, y, w, h) {
        this._super(me.Renderable, 'init', [ 0, 0, me.game.world.width, me.game.world.height ]);
        this.diamondShape = new me.Rect(x, y, w, h).toPolygon().toIso();
      },

      update : function(dt) {
        return false;
      },

      getShape: function() {
        return this.diamondShape.clone();
      },

      draw: function(renderer) {
        renderer.save();
        renderer.setColor("#FF0000");
        renderer.drawShape(this.diamondShape);
        renderer.restore();
      }
});
