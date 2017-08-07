class Chooser extends window.Phaser.State {
    init(opts) {
      this.opts = opts;
    }

    create() {
        var self = this;
        self.shelfSprites = [];
        var tileMapData = self.game.cache.getTilemapData('tileMap');
        var data = tileMapData.data;
        var totalWidth = data.width * data.tilewidth,
          totalHeight = data.height * data.tileheight,
          scaleX = ((100 * self.game.world.width) / totalWidth) / 100,
          scaleY = ((100 * self.game.world.height) / totalHeight) / 100;
        var bg = self.game.add.sprite(0, 0, 'overview');
        bg.width = self.game.world.width;
        bg.height = self.game.world.height;
        var layers = data.layers.filter(function(f) { return f.name === "Npcs" });
        if (layers.length !== 1) {
          return;
        }

        var shelves = layers[0].objects.filter(function(o) { return o.type === "shop-section"});
        if (shelves.length === 0) {
          return;
        }

        shelves.forEach(function(obj) {
          var  newWidth = scaleX * obj.width,
            newHeight = scaleY * obj.height,
            newX = scaleX * obj.x,
            newY = (scaleY * obj.y) - newHeight;
          var spr = self.game.add.sprite(newX, newY);
          spr.inputEnabled = true;
          spr.input.useHandCursor = true;
          spr.width = newWidth;
          spr.height = newHeight;
          var rect = self.game.add.graphics(newX, newY);
          rect.beginFill(0xe7272d);
          rect.alpha = 0.2;
          rect.drawRect(0, 0, newWidth, newHeight);
          rect.endFill();
          spr.rect = rect;
          // spr.rect.visible = false;
          spr.events.onInputDown.add(function () {
            self.shelfSprites.map(function(shelf) { return shelf.sprite; }).forEach(function(s) { s.rect.alpha = 0.2 });
            rect.alpha = 0.5;
            if (self.opts.onShelfClick) {
              self.opts.onShelfClick(obj.id);
            }
          });

          self.shelfSprites.push({id: obj.id, sprite: spr});
        });

        if (self.opts.loadedCallback) {
          self.opts.loadedCallback(shelves.map(function(shelf) { return { name: shelf.name, id: shelf.id }; }));
        }
    }

    setCurrentShelf(shelfId) { // Select the shelf.
      var self = this;
      console.log(shelfId);
      self.shelfSprites.map(function(shelf) { return shelf.sprite; }).forEach(function(s) { s.rect.alpha = 0.2 });
      var filtered = self.shelfSprites.filter(function(shelf) { return shelf.id === shelfId; }).map(function(shelf) { return shelf.sprite; });
      if (filtered && filtered.length > 0) {
        filtered[0].rect.alpha = 0.5;
      }
    }
}

export default Chooser;
