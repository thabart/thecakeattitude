'use strict';
var Menu = function() {};
Menu.prototype = {
	preload: function() { },
	init: function() {		
		var buildModal = function() {
			var result = $("<div class='modal fade'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'>"+
			"<h5 class='modal-title'>Client</h5>"+
			"<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
			"</div>"+
			"<div class='modal-body'>"+
			"<div class='form-group'><label>Pseudo</label><input type='text' class='form-control' id='pseudo'/></div>"+
			"</div>"+
			"<div class='modal-footer'>"+
			"<button type='button' class='btn btn-success' id='confirm'>Confirm</button>"+
			"<button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancel</button>"+
			"</div></div></div></div>");			
			$(document.body).append(result);
			return result;
		};		
		var buildSettingsModal = function() {
			var result = $("<div class='modal fade'><div class='modal-dialog'><div class='modal-content'>"+
				"<div class='modal-header'><h5 class='modal-title'>Settings</h5><button type='button' class='close' data-dismiss='modal'><span >&times;</span></button></div>"+
				"<form id='update-profile'><div id='content' style='display: none;'><div class='modal-body'><ul class='nav nav-tabs'>"+
					"<li class='nav-item'><a href='#general' data-toggle='tab' class='nav-link active'>General</a></li>"+
					"<li class='nav-item'><a href='#address' data-toggle='tab' class='nav-link'>Contact information</a></li>"+
					"<li class='nav-item'><a href='#contactinformation' data-toggle='tab' class='nav-link'>Address</a></li>"+
				"</ul>"+
				"<div class='tab-content'>"+
					"<div class='tab-pane active' id='general'>"+
						"<div class='form-group'><label class='control-label'>Pseudo</label><input type='text' class='form-control' name='name' /></div>"+
					"</div>"+
					"<div class='tab-pane' id='address'>"+
						"<div class='form-group'><label class='control-label'>Email</label><input type='text' class='form-control' name='email'/></div>"+
						"<div class='form-group'><label class='control-label'>Phone number</label><input type='text' class='form-control' name='phone_number' /></div>"+
					"</div>"+
					"<div class='tab-pane' id='contactinformation'>"+
						"<div class='form-group'><label class='control-label'>Street Address</label><input type='text' class='form-control' name='street_address' /></div>"+
						"<div class='form-group'><label class='control-label'>Postal code</label><input type='text' class='form-control' name='postal_code' /></div>"+	
						"<div class='form-group'><label class='control-label'>City</label><input type='text' class='form-control' name='country' /></div>"+
						"<div class='form-group'><input type='checkbox' /> Use current location</div>"+
					"</div>"+
				"</div></div></div><div style='width:100%; text-align: center;' id='loading'><i class='fa fa-spinner fa-spin' style='font-size:24px; width: 24px; height:24px;'></i></div>"+
				"<div class='modal-footer'><input type='submit' class='btn btn-primary' value='Save'></input><button class='btn btn-default' data-dismiss='modal'>Close</button></div></form>"+
				"</div></div></div>");
			$(document.body).append(result);
			return result;
		};
		
		var titlePaddingTop = 10,
			titlePaddingLeft = 10,
			rectWidth = 150,
			rectHeight = 150,
			rectPaddingLeft = 10,
			shopperHeight = 48,
			shopperWidth = 48,
			sellerHeight = 48,
			sellerWidth = 48,
			settingsWidth = 48,
			settingsHeight = 48,
			optPaddingLeft = -20,
			optPaddingTop = 10,
			self = this,
			sessionName = Constants.SessionName,
			modal = buildModal(),
			accessToken = sessionStorage.getItem(sessionName),
			getFormData = Helpers.getFormData,
			settingsModal = buildSettingsModal(),
			displaySettingsLoading = function(isLoading) {
				if (isLoading) {				
					$(settingsModal).find('#loading').show();
					$(settingsModal).find('#content').hide();
					return;
				}
				
				$(settingsModal).find('#loading').hide();
				$(settingsModal).find('#content').show();		
			},
			displaySettings = function() {
				displaySettingsLoading(true);
				$.ajax(Constants.userClaims, {
					type: 'GET',
					headers: {
						'Authorization': 'Bearer '+accessToken
					}
				}).then(function(userInfo) {	
					$(settingsModal).find("input[name='name']").val(userInfo.name);
					$(settingsModal).find("input[name='phone_number']").val(userInfo.phone_number);
					$(settingsModal).find("input[name='email']").val(userInfo.email);
					if (userInfo.address) {
						var adr = JSON.parse(userInfo.address);						
						$(settingsModal).find("input[name='street_address']").val(adr.street_address);
						$(settingsModal).find("input[name='postal_code']").val(adr.postal_code);
						$(settingsModal).find("input[name='country']").val(adr.country);
					}
					
					displaySettingsLoading(false);
				}).fail(function() {						
					displaySettingsLoading(false);
					errorModal.display('User information cannot be retrieved', 3000, 'error');		
				});
			},
			optStyle = { font: '20px Arial', fill: '#ffffff' },
			titleStyle = { font: '32px Arial', fill: '#ffffff' };	
			
		if (!accessToken) {			
			errorModal.display('You must be connected', 3000, 'error');			
			return;
		}
		
		$(modal).find('#confirm').click(function() {
			var newPlayer = {
				pseudo : $(modal).find('#pseudo').val(),
				map: 'firstMap'
			};

			$(modal).modal('hide');			
			$(settingsModal).remove();
			$(modal).remove();
			self.game.state.start("Game", true, false, newPlayer);
		});
		$(settingsModal).find('#update-profile').submit(function(e) {
			e.preventDefault();
			displaySettingsLoading(true);
			var json = getFormData(this);
			$.ajax('http://localhost:5001/users/claims', {
				type: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify(json),
				headers: {
					'Authorization': 'Bearer '+accessToken
				}				
			}).then(function() {
				displaySettings();
			}).fail(function(e, m) {
				errorModal.display('Error while trying to update the user information', 3000, 'error');		
				displaySettingsLoading(false);				
			});
		});
		self.game.add.text(titlePaddingTop, titlePaddingLeft, '<title>', titleStyle);
		var menu = [
			{
				title: 'Seller',
				spriteName: 'shopper',
				width: shopperWidth,
				height: shopperHeight,
				callback: function() {
					$(settingsModal).remove();
					$(modal).remove();
					self.game.state.start("CharacterChooser");
				}
			}, {
				title: 'Shopper',
				spriteName: 'seller',
				width: sellerWidth,
				height: sellerHeight,
				callback: function() {
					$(modal).modal('toggle');
				}
			}, {
				title: 'Settings',
				spriteName: 'settings',
				width: settingsWidth,
				height: settingsHeight,
				callback: function() {
					$(settingsModal).modal('toggle');
					displaySettings();
				}
			}
		];
		
		var maxWidth = menu.length * (rectWidth + rectPaddingLeft);
		var minX = self.game.width / 2 - maxWidth / 2;
		for (var i = 0; i < menu.length; i++) {
			var rectX = minX + i * (rectWidth + rectPaddingLeft) + rectPaddingLeft,
				rectY = self.game.height / 2 - rectHeight / 2,
				record = menu[i],
				sprX = rectX + (rectWidth / 2) - record.width / 2,
				sprY = rectY + (rectHeight / 2) - record.height / 2,
				titleX = sprX + optPaddingLeft,
				titleY = sprY + optPaddingTop + record.height;
			var graphic = self.game.add.graphics(rectX, rectY);
			graphic.beginFill(0xb8bbc1, 0.5);
			graphic.lineStyle(2, 0x92959b, 1);			
			graphic.drawRoundedRect(0, 0, rectWidth, rectHeight, 5);
			graphic.endFill();
			graphic.inputEnabled = true;
			graphic.events.onInputOver.add(function() {
				self.game.canvas.style.cursor = "pointer";
			});
			graphic.events.onInputOut.add(function() {
				self.game.canvas.style.cursor = "default";
			});
			graphic.events.onInputDown.add(record.callback);
			self.game.add.sprite(sprX, sprY, record.spriteName);
			self.game.add.text(titleX, titleY, record.title, optStyle);
		}
	}
};