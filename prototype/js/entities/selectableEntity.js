game.SelectableEntity = me.Entity.extend({
  init: function (opts) { // Initialize the entity.
    this.refLayer = me.game.world.getChildByName(opts.refLayerName)[0];
    this.selector = opts.selector;
    this.flipped = opts.flipped || false;
    this.isCollidable = opts.isCollidable || false;
    this.translateX = 0;
    this.translateY = 0;
    this.initX = opts.x;
    this.initY = opts.y;
    var image = me.loader.getImage(opts.name);
    this.metadata = {
      name: opts.name,
      id: opts.id,
      image: "<img src='"+image.src+"' />'",
      interaction: opts.interaction
    };
    this._super(me.Entity, "init", [opts.x, opts.y , {
      width: image.width,
      height: image.height
    }]);
    var texture =  new me.video.renderer.Texture(
      { framewidth: image.width, frameheight: image.height },
      me.loader.getImage(opts.name)
    );

    this.renderable = texture.createAnimationFromName([0]);
    this.renderable.addAnimation("stay", [0]);
    this.renderable.setCurrentAnimation("stay");
  },
  addCollision: function(name) { // Add collision shape.
    this.body.removeShapeAt(0);
    var collisionShape = $.extend(true, {}, me.loader.getJSON(name));
    var image = me.loader.getImage(this.metadata.name);
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
    this.body.addShapesFromJSON(collisionShape, this.metadata.name);
  },
  addShape: function(name) { // Add shape.
    var shapes = me.loader.getJSON(name);
    var self = this;
    this.shapeDef = shapes.furnitures.filter(function(shape) { return shape.name === self.metadata.name; })[0];
    this.body.pos.x = this.shapeDef.horizontal.relativePosX;
    this.body.pos.y = this.shapeDef.horizontal.relativePosY;
  },
  flip: function() {
    this.flipped = !this.flipped;
    if (!this.flipped) {
      this.body.pos.x = this.shapeDef.horizontal.relativePosX;
      this.body.pos.y = this.shapeDef.horizontal.relativePosY;
    } else {
      this.body.pos.x = this.shapeDef.vertical.relativePosX;
      this.body.pos.y = this.shapeDef.vertical.relativePosY;
    }

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
  getCoordinates: function(tile) { // Get the size : number of rows + number of cols + position.
    if (!tile) {
      var tile = this.refLayer.getTile(this.pos.x, this.pos.y);
    }

    var nbRows = (!this.flipped) ? this.shapeDef.horizontal.nbRows : this.shapeDef.vertical.nbRows;
    var nbCols = (!this.flipped) ? this.shapeDef.horizontal.nbCols : this.shapeDef.vertical.nbCols;
    console.log("===="+this.metadata.name+"====");
    console.log({
      row: tile.row,
      col: tile.col,
      nbRows: nbRows,
      nbCols: nbCols,
      x: this.pos.x,
      y: this.pos.y
    });
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
