game.Entities = game.Entities || {};
game.Entities.EntryEntity = me.Entity.extend({
  init: function(x, y, settings) {
    this._super(me.Entity, "init", [x, y , settings]);
    var image = me.loader.getImage("entry");
    var texture =  new me.video.renderer.Texture(
      { framewidth: image.width, frameheight: image.height },
      image
    );
    this.renderable = texture.createAnimationFromName([0]);
    this.anchorPoint.set(0.5, 0.5);
  }
});
