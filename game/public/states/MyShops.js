var MyShops = function() { };
MyShops.prototype = {
	preload: function() {
	},
	init: function(user) {

		/*
		var accessToken = sessionStorage.getItem(Constants.SessionName),
			rectHeight = 150,
			rectWidth = 150,
			paddingLeft = 10,
			addShopWidth = 48,
			addShopHeight = 48,
			shopWidth = 48,
			shopHeight = 48,
			playWidth = 341,
			playHeight = 111,
			backWidth = 108,
			backHeight = 100,
			playPaddingBottom = 0,
			playPaddingRight = 0,
			backPaddingLeft = 10,
			backPaddingBottom = 10,
			pseudoPaddingTop = 10,
			titlePaddingTop = 10,
			titlePaddingLeft = 10,
			maxSquares = 6,
			self = this,
			rectShops = [],
			rectFreePlaces = [],
			selectedShop = null,
			selectedCategory = null,
			getCategory = CategoryClient.getCategory,
			retrieUserInformation = function(successCb, errorCb) {
				$.ajax(Constants.userClaims, {
					type: 'GET',
					headers: {
						'Authorization': 'Bearer '+accessToken
					}
				}).then(function(userInfo) {
					if (successCb) successCb(userInfo);
				}).fail(function(e, m) {
					errorModal.display('User information cannot be retrieved', 3000, 'error');
					if (errorCb) errorCb();
				});
			},
			freePlace = function(spr, g) {
				this.sprite = spr;
				this.graphic = g;

				this.destroy = function() {
					this.sprite.destroy();
					this.graphic.events.onInputDown.removeAll();
				};
			},
			createModal = function() {
				var result = $("<div class='modal fade'>"+
				"<div class='modal-dialog'>"+
					"<div class='modal-content'>"+
						"<div class='modal-header'>"+
							"<h5 class='modal-title'>Add shop</h5>"+
							"<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
						"</div>"+
						"<div style='display: none;' class='content'>"+
							"<div class='modal-body'>"+
								"<div class='form-group'>"+
									"<label class='control-label'>Category</label>"+
									"<select class='category form-control'>"+
									"</select>"+
								"</div>"+
								"<div class='form-group'>"+
									"<label class='control-label'>Sub category</label>"+
									"<select class='sub-category form-control'>"+
									"</select>"+
								"</div>"+
							"</div>"+
							"<div class='modal-footer'>"+
								"<button type='button' class='btn btn-success' id='confirm'>Confirm</button>"+
								"<button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancel</button>"+
							"</div>"+
						"</div>"+
						"<div style='text-align:center;'><i class='fa fa-spinner fa-spin' style='font-size:24px; width: 24px; height:24px;'></i></div>"+
					"</div>"+
				"</div></div>");
				$(document.body).append(result);
				return result;
			},
			modal = createModal(),
			addShop = function(graph, shop) {
				var sprX = graph.x + (graph.width / 2) - shopWidth / 2,
					sprY = graph.y + (graph.height / 2) - shopHeight / 2;
				self.game.add.sprite(sprX, sprY, 'shopper');
				graph.events.onInputDown.add(function(g) {
					var isSelected = false;
					if (!g.isSelected) {
						isSelected = true;
					}

					drawGraphic(g, true);
					rectShops.forEach(function(gr) {
						if (gr == g) {
							return;
						}

						drawGraphic(gr, false);
					});

					selectedShop = shop;
					self.start.visible = true;
				}, this);
				var style = { font: "20px Arial" };
				self.game.add.text(sprX - 30, sprY + pseudoPaddingTop + shopHeight, shop.name, style);
				rectShops.push(graph);
			},
			drawGraphic = function(g, isSelected) {
				g.clear();
				g.beginFill(0xb8bbc1, 0.5);
				if (isSelected) {
					g.lineStyle(2, 0xEC1515, 1);
				} else {
					g.lineStyle(2, 0x92959b, 1);
				}

				g.drawRoundedRect(0, 0, rectWidth, rectHeight, 5);
				g.endFill();
				g.isSelected = isSelected;
			},
			displayLoadingAddShop = function(isLoading) {
				if (isLoading) {
					$(modal).find('.fa-spinner').show();
					$(modal).find('.content').hide();
					return;
				}

				$(modal).find('.fa-spinner').hide();
				$(modal).find('.content').show();
			},
			displayAddShop = function() {
				$(modal).modal('toggle');
				$.get(Constants.apiUrl + '/categories/parents').then(function(result) {
					displayLoadingAddShop(false);
					if (!result['_embedded']) {
						errorModal.display('categories cannot be displayed', 3000, 'error');
						return;
					}

					var elt = $(modal).find('.category');
					$(elt).empty();
					result['_embedded'].forEach(function(record) {
						var selfLink = record['_links'].self;
						$(elt).append("<option value='"+record.id+"' data-href='"+selfLink+"'>"+record.name+"</option>");
					});
					var partialUrl = $(elt).find(':selected').data('href');
					displaySubCategories(partialUrl);

				}).fail(function() {
					displayLoadingAddShop(false);
					errorModal.display('categories cannot be displayed', 3000, 'error');
				});
			},
			displaySubCategories = function(partialUrl) {
				var elt = $(modal).find('.sub-category');
				$(elt).empty();
				$.get(Constants.apiUrl + partialUrl).then(function(result) {
					if (!result['_links'] || !result['_links'].items) {
						errorModal.display('sub categories cannot be displayed', 3000, 'error');
						return;
					}

					var items = result['_links'].items;
					items.forEach(function(record) {
						var parts = record.href.split('/');
						var id = parts[parts.length - 1];
						$(elt).append("<option value='"+id+"' data-href='"+record.href+"'>"+record.name+"</option>");
					});
				}).fail(function() {
					errorModal.display('sub categories cannot be displayed', 3000, 'error');
				});
			};

		$.ajax(Constants.apiUrl + '/shops/me', {
			type: 'GET',
			headers: {
				'Authorization': 'Bearer '+accessToken
			}
		}).then(function(r) {
			var shops = r['_embedded'];
			if (!shops) {
				shops = [];
			}
			else if (!$.isArray(shops)) {
				shops = [shops];
			}

			var nbShops = shops.length;
			// Create shops
			for (var ind = 0; ind < maxSquares; ind++) {
				var rectX = ind * (rectWidth + paddingLeft) + paddingLeft,
					rectY = self.game.height / 2 - rectHeight / 2;
				var graphic = self.game.add.graphics(rectX, rectY);
				drawGraphic(graphic, false);
				graphic.inputEnabled = true;
				graphic.events.onInputOver.add(function() {
					self.game.canvas.style.cursor = "pointer";
				});
				graphic.events.onInputOut.add(function() {
					self.game.canvas.style.cursor = "default";
				});
				if (ind + 1 <= nbShops) {
					addShop(graphic, shops[ind]);
				} else {
					var spr = self.game.add.sprite(rectX + (rectWidth / 2) - addShopWidth / 2, rectY + (rectHeight / 2) - addShopHeight / 2, 'addShop');
					graphic.events.onInputDown.add(function() {
						displayAddShop();
					});
					rectFreePlaces.push(new freePlace(spr, graphic));
				}
			}
		}).fail(function() {

		});

		// Display the title.
		var titleStyle = { font: '32px Arial', fill: '#ffffff' };
		self.game.add.text(titlePaddingTop, titlePaddingLeft, 'Choose your shop', titleStyle);
		// Display shop selector.
		$(modal).find('#confirm').click(function() {
			var partialUrl = $(modal).find('.sub-category').find(':selected').data('href');
			$.get(Constants.apiUrl + partialUrl).then(function(r) {
				selectedCategory = r;
				$(modal).modal('toggle');
			}).fail(function() {
				$(modal).modal('toggle');
				errorModal.display('error while trying to display the map', 3000, 'error');
			});
		});
		$(modal).on('hidden.bs.modal', function(e) {
			if (selectedCategory == null) {
				return;
			}

			var category = selectedCategory['_embedded'];
			self.game.state.start("ShopChooser", true, false, category, 'CharacterChooser');
		});
		$(modal).find('.category').change(function() {
			var partialUrl = $(this).find(':selected').data('href');
			displaySubCategories(partialUrl);
		});
		// Add buttons.
		this.start = this.game.add.button(this.game.width - playPaddingRight - playWidth, this.game.height - playHeight - playPaddingBottom, 'start', function() {
			if (!selectedShop) {
				return;
			}

			// Load the map.
			if (!self.game.cache.checkTilemapKey("shop_" + selectedShop.id)) {
				var loader = self.game.load.tilemap("shop_" + selectedShop.id, Constants.apiUrl + '/' + selectedShop.shop_path, null, Phaser.Tilemap.TILED_JSON);
				loader.start();
			}

			// Load the underground.
			if (!self.game.cache.checkTilemapKey("underground_path" + selectedShop.id)) {
				var loader = self.game.load.tilemap("underground_" + selectedShop.id, Constants.apiUrl + '/' + selectedShop.underground_path, null, Phaser.Tilemap.TILED_JSON);
				loader.start();
			}

			// Retrieve the user information & category name.
			retrieUserInformation(function(userInfo) {
				getCategory(selectedShop.category_id).then(function(category) {
					var options = {
						pseudo : userInfo.name,
						map: "shop_" + selectedShop.id,
						category: {
							id : selectedShop.category_id,
							name: category.name
						}
					};
					self.game.state.start("Game", true, false, options);
				});
			});
			// ;
		}, this, 2, 1, 0);
		this.game.add.button(backPaddingLeft, this.game.height - backHeight - backPaddingLeft, 'back', function() {
			self.game.state.start('Menu');
		});
		this.start.visible = false;
		*/
	},
	create: function() {
		var self = this;
		self.game.add.tileSprite(0, 0, 980, 600, 'bg4');
		self.profileMenuFloating = new ProfileMenuFloating(); // Add floating profile menu.
		self.profileMenuFloating.init();
		self.myShopsSelector = new MyShopsSelectorModal(); // Add my shops modal selector.
		self.myShopsSelector.init();
		self.myShopsSelector.toggle();
		self.backMenuFloating = new BackMenuFloating(); // Add back menu floating.
		self.backMenuFloating.init();
		$(self.backMenuFloating).on('back', function() {
			self.game.state.start('Menu');
		});
	},
	shutdown: function() {
		this.profileMenuFloating.remove();
		this.myShopsSelector.remove();
		this.backMenuFloating.remove();
	}
};
