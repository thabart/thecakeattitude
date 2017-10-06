var CollisionHelper = {
  getShape: function(name) { // Get the collision shape.
    var collision = me.loader.getJSON(name);
    var shape = new me.Rect(0, 0, collision.width, collision.height);
    return shape;
  }
};
