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
		
		var titlePaddingTop = 10,
			titlePaddingLeft = 10,
			rectWidth = 150,
			rectHeight = 150,
			rectPaddingLeft = 10,
			shopperHeight = 48,
			shopperWidth = 48,
			sellerHeight = 48,
			sellerWidth = 48,
			optPaddingLeft = -20,
			optPaddingTop = 10,
			self = this,
			modal = buildModal(),
			optStyle = { font: '20px Arial', fill: '#ffffff' },
			titleStyle = { font: '32px Arial', fill: '#ffffff' };
		$(modal).find('#confirm').click(function() {
			var newPlayer = {
				pseudo : $(modal).find('#pseudo').val(),
				map: 'firstMap'
			};

			$(modal).modal('hide');			
			self.game.state.start("Game", true, false, newPlayer);
		});
		self.game.add.text(titlePaddingTop, titlePaddingLeft, '<title>', titleStyle);
		var menu = [
			{
				title: 'Shopper',
				spriteName: 'shopper',
				width: shopperWidth,
				height: shopperHeight,
				callback: function() {
					self.game.state.start("CharacterChooser");
				}
			}, {
				title: 'Seller',
				spriteName: 'seller',
				width: sellerWidth,
				height: sellerHeight,
				callback: function() {
					$(modal).modal('toggle');
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
		// TODO : Display : Connect as a client
		// TODO : Display : Connect as a shopper.
	}
};