game.PosterEntity = me.Entity.extend({
  init: function (x, y, furnitureName) {
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Wall.Name)[0];
    this.flipped = false; // Right wall.
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

    this.body.removeShapeAt(0); // Add collision.
    var collisionShape = $.extend(true, {}, me.loader.getJSON("posters_collision"));
    collisionShape.rigidBodies.forEach(function(rigidBody) {
      rigidBody.polygons.forEach(function(polygon) {
        polygon.forEach(function(coordinate) {
          coordinate.x = image.width * coordinate.x;
          coordinate.y = image.height * coordinate.y;
        });
      });
      rigidBody.shapes.forEach(function(shape) {
        shape.vertices.forEach(function(coordinate) {
          coordinate.x = image.width * coordinate.x;
          coordinate.y = image.height * coordinate.y;
        });
      });
    });

    this.body.addShapesFromJSON(collisionShape, furnitureName);
    this.body.pos.y = -(this.body.getBounds().height / 2);
    this.body.pos.x = -(this.body.getBounds().width / 2);
    this.renderable = texture.createAnimationFromName([0]);
    this.renderable.addAnimation("stay", [0]);
    this.renderable.setCurrentAnimation("stay");
  },
  flip: function() {
    this.flipped = !this.flipped; // Flip the poster.
    this.renderable.flipX(this.flipped);
  },
  opacity: function(val) { // Set the opacity.
    this.renderable.alpha = val;
  },
  translateX: function(x) { // Translate on X.
    this.pos.x = this.initX + x;
    this.translateX = x;
  },
  translateY: function(y) { // Translate on Y.
    this.pos.y = this.initY + y;
    this.translateY = y;
  },
  getName: function() { // Get the furniture name.
    return this.metadata.name;
  },
  getImage: function() { // Get the image.
    return this.metadata.image;
  }
});
