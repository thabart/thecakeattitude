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
			parseAddress = Helpers.parseAddress,			
			getCurrentLocation = Helpers.getCurrentLocation,
			getFormData = Helpers.getFormData,
			accessToken = sessionStorage.getItem(Constants.SessionName);
		var MiniShop = function(shop, spr) {
			var selfModal = this;
			function buildAddShopModal(cat) {
				var result = $("<div class='modal fade'><div class='modal-dialog modal-lg'><div class='modal-content'>"+
					"<div class='modal-header'><h5 class='modal-title'>Add shop</h5><button type='button' class='close' data-dismiss='modal'><span >&times;</span></button></div>"+
					"<form class='update'>"+
						"<div class='modal-body'>"+
							"<ul class='progressbar'>"+
								"<li class='active'>Description</li>"+
								"<li>Address</li>"+
								"<li>Contact</li>"+
								"<li>Tags</li>"+
								"<li>Products</li>"+
								"<li>Payment</li>"+
							"</ul>"+
							"<div class='tab-content' style='display: none;'>"+
								"<section class='tab'>"+
									"<section class='content'>"+ // General information.
										"<div class='form-group'><label class='control-label'>Name</label><input type='text' class='form-control' name='name'/></div>"+
										"<div class='form-group'><label class='control-label'>Description</label><textarea class='form-control' name='description'></textarea></div>"+
										"<div class='form-group'><label class='control-label'>Category</label><input type='hidden' name='category_id' value='"+cat.id+"' />"+cat.name+"</div>"+
										"<div class='form-group'><label class='control-label'>Banner image</label><div><input type='file' ><div></div>"+
										"<div class='form-group'><label class='control-label'>Picture</label><div><input type='file' ><div></div>"+
									"</section>"+
									"<section class='navigation'>"+
										"<button class='btn btn-primary next' style='margin-right: 10px;'>Next</button>"+
									"</section>"+
								"</section>"+
								"<section class='tab' style='display:none;'>"+
									"<section class='content'>"+ // Address.
										"<div class='form-group'><label class='control-label'>Street address</label><input type='text' class='form-control' name='street_address' /></div>"+
										"<div class='form-group'><label class='control-label'>Postal code</label><input type='text' class='form-control' name='postal_code' /></div>"+
										"<div class='form-group'><label class='control-label'>Locality</label><input type='text' class='form-control' name='locality' /></div>"+
										"<div class='form-group'><label class='control-label'>Country</label><input type='text' class='form-control' name='country' /></div>"+
										"<div class='form-group'><input type='checkbox' /> Use current location</div>"+
									"</section>"+
									"<section class='navigation'>"+
										"<button class='btn btn-primary previous' style='margin-right: 10px;'>Previous</button>"+
										"<button class='btn btn-primary next' style='margin-right: 10px;'>Next</button>"+
									"</section>"+
								"</section>"+
								"<section class='tab' style='display:none;'>"+
									"<section class='content'>"+ // Contact information.
										"<div class='form-group'><label class='control-label'>Email</label><input type='text' class='form-control' name='email' readonly /></div>"+
										"<div class='form-group'><label class='control-label'>Phone</label><input type='text' class='form-control' name='phone_number' readonly /></div>"+
									"</section>"+
									"<section class='navigation'>"+
										"<button class='btn btn-primary previous' style='margin-right: 10px;'>Previous</button>"+
										"<button class='btn btn-primary next' style='margin-right: 10px;'>Next</button>"+
									"</section>"+
								"</section>"+
								"<section class='tab' style='display:none;'>"+
									"<section class='content'>"+ // Tags
										"<iframe {id} style='width:100%;height:125px;'>#document<html><head></head><body></body></html></iframe>"+
									"</section>"+
									"<section class='navigation'>"+
										"<button class='btn btn-primary previous' style='margin-right: 10px;'>Previous</button>"+
										"<button class='btn btn-primary next' style='margin-right: 10px;'>Next</button>"+
									"</section>"+
								"</section>"+
								"<section class='tab' style='display:none;'>"+
									"<section class='content'>"+ // Products
										"<button type='button' class='btn btn-success'><span class='fa fa-plus glyphicon-align-left'></span> Add product</button>"+
									"</section>"+
									"<section class='navigation'>"+
										"<button class='btn btn-primary previous' style='margin-right: 10px;'>Previous</button>"+
										"<button class='btn btn-primary next' style='margin-right: 10px;'>Next</button>"+
									"</section>"+
								"</section>"+
								"<section class='tab' style='display:none;'>"+
									"<section class='content'>"+ // Payment
										"<div class='input-group'><span class='input-group-addon'><input type='radio' /></span><span class='form-control'>Card</span></div>"+
										"<div class='input-group'><span class='input-group-addon'><input type='radio' /></span><span class='form-control'>Cash</span></div>"+
										"<div class='input-group'><span class='input-group-addon'><input type='radio' /></span><span class='form-control'>Bank transfer</span></div>"+
										"<div class='input-group'><span class='input-group-addon'><input type='radio' /></span><span class='form-control'>Paypal</span></div>"+
									"</section>"+
									"<section class='navigation'>"+
										"<button class='btn btn-primary previous' style='margin-right: 10px;'>Previous</button>"+
										"<input type='submit' class='btn btn-success confirm' style='margin-right: 10px;' value='Confirm' />"+
									"</section>"+
								"</section>"+
							"</div><div style='text-align:center;'><i class='fa fa-spinner fa-spin' style='font-size:24px; width: 24px; height:24px;'></i></div>"+
						"</div>"+
					"</form></div></div></div>");
				$(document.body).append(result);
				$(result).find('iframe').editableIFrame();
				return result;
			}
			this.shop = shop;
			this.spr = spr;
			this.modal = buildAddShopModal(self.category);			
			var navigate = function(oldTab, newTab, modal) {
				$(oldTab).hide();
				$(newTab).show();		
				$(newTab).css('opacity', '100');
				var lst = $(modal).find(".progressbar li");
				lst.removeClass("active");
				for(var i = 0; i <= $(newTab).index(); i++) {
					$(lst.get(i)).addClass('active');
				}
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
				this.displayLoading(true);
				$(this.modal).modal('toggle');
			}
			this.displayLoading = function(isLoading) {
				if (isLoading) {
					$(this.modal).find('.tab-content').hide();
					$(this.modal).find('.fa-spinner').show();
					return;
				}
				
				$(this.modal).find('.tab-content').show();
				$(this.modal).find('.fa-spinner').hide();
			};
			this.setUserInformation = function(userInfo) {
				var adr = parseAddress(userInfo.address);
				selfModal.setAddress(adr);
				$(selfModal.modal).find("input[name='email']").val(userInfo.email);
				$(selfModal.modal).find("input[name='phone_number']").val(userInfo.phone_number);
			};
			this.setAddress = function(adr) {
				$(selfModal.modal).find("input[name='street_address']").val(adr.street_address);
				$(selfModal.modal).find("input[name='postal_code']").val(adr.postal_code);
				$(selfModal.modal).find("input[name='locality']").val(adr.locality);
				$(selfModal.modal).find("input[name='country']").val(adr.country);				
			};
			$(this.modal).on('shown.bs.modal', function() {	
				$.ajax(Constants.userClaims, {
					type: 'GET',
					headers: {
						'Authorization': 'Bearer '+accessToken
					}
				}).then(function(userInfo) {	
					selfModal.displayLoading(false);
					selfModal.setUserInformation(userInfo);				
				}).fail(function(e, m) {
					selfModal.displayLoading(false);
					errorModal.display('User information cannot be retrieved', 3000, 'error');
				});	
			});
			$(this.modal).find("input[type='checkbox']").click(function() {
				var isChecked = $(this).is(':checked');			
				if (!isChecked)	{
					return;
				}
				
				selfModal.displayLoading(true);
				getCurrentLocation(function(adr) {
					selfModal.displayLoading(false);
					selfModal.setAddress(adr);
				}, function() {								
					selfModal.displayLoading(false);	
				});				
			});
			$(this.modal).find('.update').submit(function(e) {
				e.preventDefault();
				var j = getFormData(this);
				j['place'] = selfModal.spr.name;
				$.ajax(Constants.apiUrl + '/shops', {		
					method: 'POST',
					contentType: "application/json",
					data: JSON.stringify(j),
					headers: {
						'Authorization': 'Bearer '+accessToken
					}
				}).then(function(r) {
					$(selfModal.modal).modal('hide');
				}).fail(function(e) {
					$(selfModal.modal).modal('hide');				
					if (e.responseJSON && e.responseJSON['error_description']) {
						errorModal.display(e.responseJSON['error_description'], 3000, 'error');			
					} else {
						errorModal.display('An error occured while trying to add the shop', 3000, 'error');						
					}
				});
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
			house.name = shop.name;
			$.ajax(Constants.apiUrl, {
				url: Constants.apiUrl + '/shops/.search',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({map: map, place: shop.name}),
			}).then(function() {
				house.loadTexture('house', 0);
			}).fail(function() { });
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