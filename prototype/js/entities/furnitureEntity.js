game.FurnitureEntity = me.Entity.extend({
  init: function (x, y, imageName, settings) {
    this.flipped = false;
    this._super(me.Entity, "init", [x, y , settings]);
    var texture =  new me.video.renderer.Texture(
      { framewidth: settings.width, frameheight: settings.height },
      me.loader.getImage(imageName)
    );
    this.renderable = texture.createAnimationFromName([0]);
    this.renderable.addAnimation("stay", [0]);
    this.renderable.setCurrentAnimation("stay");
  },
  flip: function() {
    this.flipped = !this.flipped;
    this.renderable.flipX(this.flipped);
  }
});
