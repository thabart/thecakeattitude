var ShopChooser = function () {  };
ShopChooser.prototype = {
	init: function() {
	},
	create: function() {
		var self = this,
			overview = 'overview_firstMap',
			map = 'firstMap';
		// Change background color.				
		this.game.stage.backgroundColor = '#787878';	
		var bg = this.game.add.sprite(0, 0, overview);
		bg.width = this.game.world.width;
		bg.height = this.game.world.height;
		var tileMapData = this.game.cache.getTilemapData(map);
		var data = tileMapData.data,
			layers = data.layers,
			totalWidth = data.width * data.tilewidth,
			totalHeight = data.height * data.tileheight,
			scaleX = ((100 * this.game.world.width) / totalWidth) / 100,
			scaleY = ((100 * this.game.world.height) / totalHeight) / 100,
			shops = [];
		// Fetch all the shops.
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
			var house = self.game.add.sprite(newX, newY, 'house');
			house.width = newWidth;
			house.height = newHeight;
		});
	},
	update: function() {
	},
	render: function() {		
	}
};