var ShopChooser = function () {  };
ShopChooser.prototype = {
	init: function() {
	},
	create: function() {
		var self = this,
			overview = 'overview_firstMap',
			map = 'firstMap';
		var MiniShop = function(shop, spr) {
			function buildAddShopModal() {
				var result = $("<div class='modal fade'><div class='modal-dialog'><div class='modal-content'>"+
					"<div class='modal-header'><h5 class='modal-title'>Add shop</h5><button type='button' class='close' data-dismiss='modal'><span >&times;</span></button></div>"+
					"<form id='update-profile'>"+
						"<div class='modal-body'>"+
							"<ul class='progressbar'>"+
								"<li class='active'>Description</li>"+
								"<li>Tags</li>"+
								"<li>Products</li>"+
							"</ul>"+
							"<div class='tab-content'>"+
								"<section class='tab'>"+
									"<section>"+
										"<div class='form-group'><label class='control-label'>Name</label><input type='text' class='form-control' /></div>"+
										"<div class='form-group'><label class='control-label'>Description</label><textarea class='form-control'></textarea></div>"+
										"<div class='form-group'><label class='control-label'>Banner image</label><div><input type='file' ><div></div>"+
										"<div class='form-group'><label class='control-label'>Picture</label><div><input type='file' ><div></div>"+
									"</section>"+
									"<section>"+
										"<button class='btn btn-primary next' style='margin-right: 10px;'>Next</button>"+
									"</section>"+
								"</section>"+
								"<section class='tab' style='display:none;'>"+
									"<section>"+
									"</section>"+
									"<section>"+
										"<button class='btn btn-primary previous' style='margin-right: 10px;'>Previous</button>"+
										"<button class='btn btn-primary next' style='margin-right: 10px;'>Next</button>"+
									"</section>"+
								"</section>"+
								"<section class='tab' style='display:none;'>"+
									"<section>"+
									"</section>"+
									"<section>"+
										"<button class='btn btn-primary previous' style='margin-right: 10px;'>Previous</button>"+
										"<button class='btn btn-success' style='margin-right: 10px;'>Confirm</button>"+
									"</section>"+
								"</section>"+
							"</div>"+
						"</div>"+
					"</form></div></div></div>");
				$(document.body).append(result);
				return result;
			}
			this.shop = shop;
			this.spr = spr;
			this.modal = buildAddShopModal();
			
			var navigate = function(oldTab, newTab, modal) {
				oldTab.animate({opacity: 0}, {
					duration: 800,
					complete: function() {
						$(oldTab).hide();
						$(newTab).show();		
						$(newTab).css('opacity', '100');
						var lst = $(modal).find(".progressbar li");
						lst.removeClass("active");
						for(var i = 0; i <= $(newTab).index(); i++) {
							$(lst.get(i)).addClass('active');
						}
					}
				});				
			};
			
			$(this.modal).find('.next').click(function(e) {
				e.preventDefault();
				var parent = $(this).closest('.tab');
				var nextTab = $(parent).next();
				navigate(parent, nextTab, $(this).closest('.fade'));
			});
			$(this.modal).find('.previous').click(function(e) {
				e.preventDefault();
				var parent = $(this).closest('.tab');
				var previousTab = $(parent).prev();		
				navigate(parent, previousTab,  $(this).closest('.fade'));
			});
			
			this.interact = function() {				
				$(this.modal).modal('toggle');
				// spr.loadTexture('house', 0);
			}
		};
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
			var house = self.game.add.sprite(newX, newY, 'freePlace');
			house.inputEnabled = true;
			var miniShop = new MiniShop(shop, house);
			house.events.onInputOver.add(function() {
				self.game.canvas.style.cursor = "pointer";
			});
			house.events.onInputOut.add(function() {
				self.game.canvas.style.cursor = "default";
			});
			house.events.onInputDown.add(function() {
				this.interact();
			}, miniShop);
			house.width = newWidth;
			house.height = newHeight;
			$.ajax(Constants.apiUrl, {
				url: 'http://localhost:5000/shops/.search',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({map: map, place: shop.name}),
			}).then(function() {
				house.loadTexture('house', 0);
			}).fail(function() { });
		});
	},
	update: function() {
	},
	render: function() {		
	}
};