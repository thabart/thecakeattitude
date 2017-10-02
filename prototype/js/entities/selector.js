var Selector = me.Renderable.extend({
      init: function(x, y, w, h) {
        this._super(me.Renderable, 'init', [ x, y, w, h ]);
        this.diamondShape = this.clone().toPolygon().toIso();
      },

      update : function(dt) {
        return false;
      },

      getShape: function() {
        return this.diamondShape;
      },

      draw: function(renderer) {
        renderer.save();
        renderer.setColor("#FF0000");
        renderer.drawShape(this.diamondShape);
        renderer.restore();
      }
});
