import {ShopsService, CategoryService} from "../../services/index";

class ShopChooser extends window.Phaser.State {
    init(category, component) {
        this.category = category;
        this.component = component;
    }

    create() {
        var self = this,
            overview = self.category.overview_name,
            mapName = self.category.map_name,
            categoryId = self.category.category_id,
            lineWidth = 1,
            heightTitle = 22,
            titleRectWidth = 1,
            titlePaddingLeft = 10,
            titlePaddingTop = 10,
            textStyle = {align: 'center', font: '12px Arial'},
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
            shops = [],
            warps = [];
        layers.forEach(function (layer) {
            var objects = layer.objects;
            if (!objects) {
                return;
            }

            if (layer.name === 'Houses') {
              objects.forEach(function (obj) {
                shops.push(obj);
              });
            }

            if (layer.name === 'Warps') {
                objects.forEach(function (obj) {
                    if (!obj.properties || !obj.properties.map || warps.indexOf(obj.properties.map) !== -1) {
                        return;
                    }

                    warps.push(obj.properties.map);
                });
            }
        });

        var i = 0;
        warps.forEach(function (warp) {  // Retrieve all the links.
            var text = self.game.add.text(titlePaddingLeft + titleRectWidth, (i * heightTitle) + titleRectWidth + titlePaddingTop, warp, textStyle);
            var gr = self.game.add.graphics(titlePaddingLeft, (i * heightTitle) + titlePaddingTop);
            gr.lineStyle(titleRectWidth, 0xaea8a8, 1);
            gr.drawRect(0, 0, text.width + titleRectWidth, text.height + titleRectWidth);
            gr.endFill();
            text.inputEnabled = true;
            text.events.onInputOver.add(function () {
                self.game.canvas.style.cursor = "pointer";
            });
            text.events.onInputOut.add(function () {
                self.game.canvas.style.cursor = "default";
            });
            text.events.onInputDown.add(function () {
                CategoryService.getMap(categoryId, warp).then(function (m) {
                    var json = m['_embedded'];
                    json['category_id'] = categoryId;
                    self.component.loadMap(json);
                });
            });
            i++;
        });

        shops.forEach(function (shop) { // Display all the shops.
            var  newWidth = scaleX * shop.width,
                newHeight = scaleY * shop.height,
                newX = scaleX * shop.x,
                newY = (scaleY * shop.y) - newHeight;
            var house = self.game.add.sprite(newX, newY, 'freePlace');
            house.inputEnabled = true;
            house.width = newWidth;
            house.height = newHeight;
            house.name = shop.name;
            ShopsService.search({category_id: self.category.id, place: shop.name}).then(function () {
                house.loadTexture('house', 0);
            }).catch(function (e) {
                if (e.status != 404) {
                    return;
                }

                var rect = self.game.add.graphics(newX - lineWidth, newY - lineWidth);
                rect.lineStyle(lineWidth, 0xFF0000, 1);
                rect.drawRect(0, 0, newWidth + lineWidth, newHeight + lineWidth);
                rect.visible = false;
                house.rect = rect;
                houseSprites.push(house);
                house.events.onInputOver.add(function () {
                    self.game.canvas.style.cursor = "pointer";
                });
                house.events.onInputOut.add(function () {
                    self.game.canvas.style.cursor = "default";
                });
                house.events.onInputDown.add(function (e) {
                    houseSprites.forEach(function (spr) {
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
