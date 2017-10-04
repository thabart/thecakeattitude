game.Furniture = me.Object.extend({
  init: function (sprite, rect, imageName) {
    this.sprite = sprite;
    this.rect = rect;
    this.metadata = {
      imageName: imageName
    };
  }
});
