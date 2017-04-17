'use strict';
var Shop = function(game, npc, map, category) {
	var shopTitleWidth = 200,
		shopTitleHeight = 41,
		shopTitleRect = null,
		shopTitleTxt = null,
		shopTitleBorderPadding = 2,
		sprite = null,
		interaction = null,
		self = this,
		isEnabled = true,
		isInteracting = false,
		tileSheet = null,
		warpRectangle = null,
		warpSprite = null,
		warpHeight = 30,
		panelInfo = null,
		warpWidth = 30;
	map.tilesets.forEach(function(t) {
		if (t.firstgid == npc.gid) {
			tileSheet = t;
		}
	});
	
	// Remove all the interactions.
	var removeInteraction = function() {
		isEnabled = false;
		sprite.inputEnabled = false;
		sprite.events.onInputOver.removeAll();
		sprite.events.onInputOut.removeAll();
		sprite.events.onInputDown.removeAll();
	};
	
	// Display panel information.
	var displayPanelInfo = function(r) {
		var panel = {
			x : npc.x,
			y : npc.y
		};
		panelInfo = new InfoPanel(game, panel, map, r);
	};
	
	// Display shop.
	var displayShop = function(r) {
		removeInteraction();
		sprite.loadTexture('house', 0);
		if (!game.cache.checkTilemapKey("shop_" + r.id)) {
			var loader = game.load.tilemap("shop_" + r.id, Constants.apiUrl + '/' + r.shop_path, null, Phaser.Tilemap.TILED_JSON);
			loader.start();
		}
		
		if (!game.cache.checkTilemapKey("underground_path" + r.id)) {
			var loader = game.load.tilemap("underground_" + r.id, Constants.apiUrl + '/' + r.underground_path, null, Phaser.Tilemap.TILED_JSON);
			loader.start();
		}
		
		addWarp(r.id);	
		displayTile(r.name);
		displayPanelInfo(r);
	};
	
	var displayTile = function(title) {
		shopTitleRect = game.add.graphics(0,0);
		shopTitleRect.lineStyle(shopTitleBorderPadding, 0xd9d9d9, 1);
		shopTitleRect.beginFill(0xFFFFFF, 1);
		var x = npc.x;
		var y = npc.y - tileSheet.tileHeight / 2;
		shopTitleRect.drawRoundedRect(x, y, shopTitleWidth, 41, 5);
		// TODO : Max title size = 12 characters.
		shopTitleTxt = game.add.text(x + shopTitleBorderPadding, y + shopTitleBorderPadding,  title, { 
			font: 'bold 19pt Arial', fill: 'black', align: 'center', stroke: 'gray',strokeThickness: 2, wordWrapWidth: shopTitleWidth, wordWrap: true
		});
	};
		
	var addWarp = function(mapId) {		
		var x = npc.x + (tileSheet.tileWidth / 2) - warpWidth / 2,
			y = npc.y;
		// 1. Display warp.
		warpRectangle = game.add.graphics(0, 0);
		warpRectangle.lineStyle(shopTitleBorderPadding, 0xd9d9d9, 1);
		warpRectangle.beginFill(0xFFFFFF, 1);
		warpRectangle.drawRect(x, y, warpWidth, warpHeight);
		// 2. Add transparent warp into the group.
		warpSprite = game.add.sprite(x, y, null);
		game.physics.enable(warpSprite, Phaser.Physics.ARCADE);
		warpSprite.name = 'shopentry_' + mapId;
		warpSprite.body.setSize(warpWidth, warpHeight, 0, 0);
	};
		
	// Initialize the shop.
	this.init = function() {		
		// Initialize the sprite.		
		sprite = game.add.sprite(npc.x, npc.y - tileSheet.tileHeight, tileSheet.name);	
		sprite.inputEnabled = true;
		sprite.events.onInputOver.add(function() {
			game.canvas.style.cursor = "pointer";
		});
		sprite.events.onInputOut.add(function() {
			game.canvas.style.cursor = "default";
		});
		sprite.events.onInputDown.add(function() {
			this.interact();
		}, this);
		var result = $.Deferred();
		$.ajax({
			url: Constants.apiUrl + '/shops/.search',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({category_id: category.id, place: npc.name}),
			success: function(r) {
				if (!r['_embedded']) {
					result.resolve({panelInfo : null, warp: null, map_id: null});
					return;
				}
				
				displayShop(r['_embedded']);
				result.resolve({panelInfo : panelInfo, warp: warpSprite, map_id: r['_embedded'].id});
			}, 
			error: function() {
				result.resolve({panelInfo : null, warp: null, map_id: null});
				interaction = new ShopInteraction(npc, category, sprite, true);
			}
		});	
		
		return result.promise();
	};
	
	this.getSprite = function() {
		return sprite;
	};
	
	this.interact = function() {
		if (isInteracting || !isEnabled || interaction == null) {
			return;
		}
		
		isInteracting = true;
		interaction.interact();
	};	
	
	this.getIsEnabled = function() {
		return isEnabled;
	};
	
	this.getPanelInfo = function() {
		return panelInfo;
	};
	
	this.destroy = function() {
		sprite.destroy();
		if (shopTitleRect != null) shopTitleRect.destroy();				
		if (shopTitleTxt != null) shopTitleTxt.destroy();
		if (warpRectangle != null) warpRectangle.destroy();
	};
};