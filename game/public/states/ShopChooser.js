var ShopChooser = function () {  };
ShopChooser.prototype = {
	init: function(category, previousState) {
		this.category = category;
		this.previousState = previousState;
	},
	create: function() {
		var self = this,
			overview = self.category.overview_name,
			map = self.category.map_name,
			name = self.category.name,
			titlePaddingLeft = 10,
			titlePaddingTop = 10,
			backPaddingLeft = 10,
			backPaddingBottom = 10,
			backWidth = 108,
			backHeight = 100,					
			getCurrentLocation = Helpers.getCurrentLocation,
			accessToken = Helpers.getAccessToken(),
			addClickHandler = function(house, callback) {
				house.events.onInputOver.add(function() {
					self.game.canvas.style.cursor = "pointer";
				});
				house.events.onInputOut.add(function() {			
					self.game.canvas.style.cursor = "default";
				});
				house.events.onInputDown.add(function() {
					if (callback) callback();
				});				
			};
		
		// Change background color.	
		// self.game.stage.backgroundColor = '#787878';	
		var bg = self.game.add.sprite(0, 0, overview);
		bg.width = self.game.world.width;
		bg.height = self.game.world.height;
		var tileMapData = self.game.cache.getTilemapData(map);
		var data = tileMapData.data,
			layers = data.layers,
			totalWidth = data.width * data.tilewidth,
			totalHeight = data.height * data.tileheight,
			scaleX = ((100 * self.game.world.width) / totalWidth) / 100,
			scaleY = ((100 * self.game.world.height) / totalHeight) / 100,
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
			var house = self.game.add.sprite(newX, newY, 'freePlace');
			house.inputEnabled = true;
			house.width = newWidth;
			house.height = newHeight;
			house.name = shop.name;
			$.ajax(Constants.apiUrl + '/shops/.search', {
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({category_id: self.category.id, place: shop.name}),
			}).then(function(j) {
				house.loadTexture('house', 0);
				$.ajax(Constants.userPublicClaims.replace('{id}', j['_embedded'].subject), {					
					type: 'GET',
					headers: {
						'Authorization': 'Bearer '+accessToken
					}
				}).then(function(r) {
					var result = $.extend({}, j['_embedded'], r);
					var interaction = new ShopInteraction(shop, self.category, house, false, result);
					addClickHandler(house, function() {
						interaction.interact();
					});
					
				}).fail(function() { });
			}).fail(function(e) {
				if (e.status != 404) {
					return;
				}
				
				var interaction = new ShopInteraction(shop,self.category, house, true);
				addClickHandler(house, function() {
					interaction.interact();
				});
			});
		});
		var style = { font: "20px Arial" };
		self.game.add.text(titlePaddingLeft, titlePaddingTop, 'Choose a placement in the sub-category ' + name, style);
		self.game.add.button(backPaddingLeft, self.game.height - backHeight - backPaddingBottom, 'back', function() {
			self.game.state.start(self.previousState);
		});
	},
	update: function() {
	},
	render: function() {		
	}
};