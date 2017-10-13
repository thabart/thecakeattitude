game.PosterEntity = me.Entity.extend({
  init: function (x, y, furnitureName) {
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Wall.Name)[0];
    this.flipped = false;
    this.translateX = 0;
    this.translateY = 0;
    this.initX = x;
    this.initY = y;
    var image = me.loader.getImage(furnitureName);
    this.metadata = {
      name: furnitureName,
      image: image.src
    };
    this._super(me.Entity, "init", [x, y , {
      width: image.width,
      height: image.height
    }]);
    var texture =  new me.video.renderer.Texture(
      { framewidth: image.width, frameheight: image.height },
      me.loader.getImage(furnitureName)
    );

    this.body.pos.y = -40;
    this.renderable = texture.createAnimationFromName([0]);
    this.renderable.addAnimation("stay", [0]);
    this.renderable.setCurrentAnimation("stay");
  },
  opacity: function(val) { // Set the opacity.
    this.renderable.alpha = val;
  },
  translateX: function(x) { // Translate on X.
    this.pos.x = this.initX + x;
    this.translateX = x;
    console.log(x);
  },
  translateY: function(y) { // Translate on Y.
    this.pos.y = this.initY + y;
    this.translateY = y;
    console.log(y);
  },
  getName: function() { // Get the furniture name.
    return this.metadata.name;
  },
  getImage: function() { // Get the image.
    return this.metadata.image;
  }
});
