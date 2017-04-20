import ShopService from '../../services/Shops';

class ShopChooser extends window.Phaser.State {
  init(category, component) {
    this.category = category;
    this.component = component;
  }
  create() {
    var self = this,
      overview = self.category.overview_name,
      mapName = self.category.map_name,
      lineWidth = 1,
      houseSprites = [];
    var bg = self.game.add.sprite(0, 0, overview);
    bg.width = self.game.world.width;
    bg.height = self.game.world.height;
    var tileMapData = self.game.cache.getTilemapData(mapName);
    var data = tileMapData.data,
      layers = data.layers,
      totalWidth = data.width * data.tilewidth,
      totalHeight = data.height * data.tileheight,
      scaleX = ((100 * self.game.world.width) / totalWidth) / 100,
      scaleY = ((100 * self.game.world.height) / totalHeight) / 100,
      shops = [];
    layers.forEach(function(layer) {
      if (layer.name === 'Npcs') {
        var objects = layer.objects;
        if (!objects) {
          return;
        }

        objects.forEach(function(obj) {
          if (obj.type === 'shop') {
            shops.push(obj);
          }
        });
      }
    });

    // Display all the shops.
    shops.forEach(function(shop) {
      var newX =  scaleX * shop.x,
        newY = scaleY * shop.y,
        newWidth = scaleX * shop.width,
        newHeight = scaleY * shop.height;
      var house = self.game.add.sprite(newX, newY, 'freePlace');
      house.inputEnabled = true;
			house.width = newWidth;
			house.height = newHeight;
			house.name = shop.name;
      ShopService.search({ category_id: self.category.id, place: shop.name }).then(function() {
        house.loadTexture('house', 0);
      }).catch(function(e) {
        if (e.status != 404) {
          return;
        }

        var rect = self.game.add.graphics(newX - lineWidth, newY - lineWidth);
        rect.lineStyle(lineWidth, 0xFF0000, 1);
        rect.drawRect(0, 0, newWidth + lineWidth, newHeight + lineWidth);
        rect.visible = false;
        house.rect = rect;
        houseSprites.push(house);
        house.events.onInputOver.add(function() {
  				self.game.canvas.style.cursor = "pointer";
  			});
  			house.events.onInputOut.add(function() {
  				self.game.canvas.style.cursor = "default";
  			});
  			house.events.onInputDown.add(function(e) {
          houseSprites.forEach(function(spr) {
            spr.rect.visible = false;
          });
          e.rect.visible = true;
          self.component.props.onHouseSelected(e.name);
  			});
      });
    });
  }
}

export default ShopChooser;
