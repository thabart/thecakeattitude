game.FurnitureEntity = me.Entity.extend({
  init: function (x, y, furnitureName) {
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
    this.flipped = false;
    this.translateX = 0;
    this.translateY = 0;
    this.initX = x;
    this.initY = y;
    this.furnitureName = furnitureName;
    var image = me.loader.getImage(furnitureName);
    this._super(me.Entity, "init", [x, y , {
      width: image.width,
      height: image.height
    }]);
    var texture =  new me.video.renderer.Texture(
      { framewidth: image.width, frameheight: image.height },
      me.loader.getImage(furnitureName)
    );

    var collisionShape = CollisionHelper.getShape(furnitureName + "_collision");
    this.body.removeShapeAt(0);
    this.body.addShape(collisionShape);
    this.body.pos.x = -(collisionShape.width / 2);
    this.body.pos.y = -(collisionShape.height / 2);
    this.renderable = texture.createAnimationFromName([0]);
    this.renderable.addAnimation("stay", [0]);
    this.renderable.setCurrentAnimation("stay");
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
  },
  getSize: function() { // Get the size : number of rows + number of cols + position.

  },
  getName: function() { // Get the furniture name.
    return this.furnitureName;
  }
});
