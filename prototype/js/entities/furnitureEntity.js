game.FurnitureEntity = me.Entity.extend({
  init: function (x, y, imageName, settings) {
    this.flipped = false;
    this.translateX = 0;
    this.translateY = 0;
    this.initX = x;
    this.initY = y;
    this._super(me.Entity, "init", [x, y , settings]);
    var texture =  new me.video.renderer.Texture(
      { framewidth: settings.width, frameheight: settings.height },
      me.loader.getImage(imageName)
    );

    var collisionShape = new me.Rect(0, 0, 33, 33); // TODO : Manage collision shape.
    this.body.removeShapeAt(0);
    this.body.addShape(collisionShape);

    this.renderable = texture.createAnimationFromName([0]);
    this.renderable.addAnimation("stay", [0]);
    this.renderable.setCurrentAnimation("stay");
    // this.alwaysUpdate = true;
  },
  flip: function() {
    this.flipped = !this.flipped;
    this.renderable.flipX(this.flipped);
  },
  opacity: function(val) { // Set the opacity.
    this.renderable.alpha = val;
  },
  getImage: function() { // Get the image.
    return this.renderable.image;
  },
  translateX: function(x) { // Translate on X.
    this.pos.x = this.initX + x;
    this.translateX = x;
  },
  translateY: function(y) { // Translate on Y.
    this.pos.y = this.initY + y;
    this.translateY = y;
  }
});
