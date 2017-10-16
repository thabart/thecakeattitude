game.FurnitureEntity = me.Entity.extend({
  init: function (x, y, furnitureName) {
    this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
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

    this.body.removeShapeAt(0);
    this.body.collisionType = me.collision.types.ACTION_OBJECT;
    this.body.setCollisionMask(
        me.collision.types.ACTION_OBJECT |
        me.collision.types.PLAYER_OBJECT
    );

    var collisionShape = $.extend(true, {}, me.loader.getJSON("furnitures_collision"));
    var shapes = me.loader.getJSON("furnitures_shapes");
    this.shapeDef = shapes.furnitures.filter(function(shape) { return shape.name === furnitureName; })[0];
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
    this.body.pos.x = this.shapeDef.relativePosX;
    this.body.pos.y = this.shapeDef.relativePosY;
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
  getCoordinates: function() { // Get the size : number of rows + number of cols + position.
    var tile = this.refLayer.getTile(this.pos.x, this.pos.y);
    var nbRows = this.shapeDef.nbRows;
    var nbCols = this.shapeDef.nbCols;
    return {
      row: tile.row,
      col: tile.col,
      nbRows: nbRows,
      nbCols: nbCols
    };
  },
  getName: function() { // Get the furniture name.
    return this.metadata.name;
  },
  getImage: function() { // Get the image.
    return this.metadata.image;
  }
});
