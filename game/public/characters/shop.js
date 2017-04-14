'use strict';
var Shop = function(game, npc, map, warpGroup, npcsGroup, npcs) {
	var shopTitleWidth = 200,
		shopTitleHeight = 41,
		shopTitleRect = null,
		shopTitleTxt = null,
		shopTitleBorderPadding = 2,
		sprite = null,
		self = this,
		isEnabled = true,
		isInteracting = false,
		modal = null,
		tileSheet = null,
		warpRectangle = null,
		warpHeight = 30,
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
		var panelInfo = new InfoPanel(game, panel, map, r);
		var sp = panelInfo.getSprite();
		npcsGroup.add(sp);
		npcs.push([sp, panelInfo ]);
	};
	
	// Display shop.
	var displayShop = function(r) {
		removeInteraction();
		sprite.loadTexture('house', 0);
		if (!game.cache.checkTilemapKey("shop_" + r.id)) {
			var loader = game.load.tilemap("shop_" + r.id, 'http://localhost:5000/' + r.shop_path, null, Phaser.Tilemap.TILED_JSON);
			loader.start();
		}
		
		if (!game.cache.checkTilemapKey("underground_path" + r.id)) {
			var loader = game.load.tilemap("underground_" + r.id, 'http://localhost:5000/' + r.underground_path, null, Phaser.Tilemap.TILED_JSON);
			loader.start();
		}
		
		addWarp(r.id);	
		displayTile(r.title);
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
		var rect = game.add.sprite(x, y, null);
		game.physics.enable(rect, Phaser.Physics.ARCADE);
		rect.name = 'shopentry_' + mapId;
		rect.body.setSize(warpWidth, warpHeight, 0, 0);
		warpGroup.add(rect);
        warpGroup.set(rect, 'map', "shop_" + mapId, false, false, 0, true);
        warpGroup.set(rect, 'warp_entry', 'warp', false, false, 0, true);
        warpGroup.set(rect, 'entry_dir', 'bottom', false, false, 0, true);
	};
	
	var buildModal = function() {
		modal = $("<div class='modal fade'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'>"+
			"<h5 class='modal-title'>"+npc.name+"</h5>"+
			"<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
			"</div>"+
			"<div class='modal-body'>"+
			"<p>Do you want to take this shop ?</p>"+
			"</div>"+
			"<div class='modal-footer'>"+
			"<button type='button' class='btn btn-success'  data-dismiss='modal'>Yes</button>"+
			"<button type='button' class='btn btn-secondary' data-dismiss='modal'>No</button>"+
			"</div></div></div></div>");
		$(document.body).append(modal);
		$(modal).on('hidden.bs.modal', function() {
			isInteracting = false;
			game.canvas.style.cursor = "default";
		});
		$(modal).find('.btn-success').click(function() {
			$.ajax({
				url: Constants.apiUrl + '/shops',
				method: 'POST',
				contentType: "application/json",
				data: JSON.stringify({ title: 'first-shop', map: map.key, place: npc.name }),
				success: function(r) {
					r.title = 'first-shop';
					displayShop(r);
				},
				error: function() {
					// TODO : Display message error.
				}
			});
		});
	};
	
	// Initialize the shop.
	this.init = function() {		
		buildModal();
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
			url: 'http://localhost:5000/shops/.search',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({map: map.key, place: npc.name}),
			success: function(r) {
				if (r.length != 1) {
					result.resolve();
					return;
				}
				
				displayShop(r[0]);
				result.resolve();
			}, 
			error: function() {
				result.resolve();
			}
		});	
		
		return result.promise();
	};
	
	this.getSprite = function() {
		return sprite;
	};
	
	this.interact = function() {
		if (isInteracting || !isEnabled) {
			return;
		}
		
		isInteracting = true;
		$(modal).modal('toggle');
	};	
	
	this.getIsEnabled = function() {
		return isEnabled;
	};
	
	this.destroy = function() {
		sprite.destroy();
		if (shopTitleRect != null) shopTitleRect.destroy();				
		if (shopTitleTxt != null) shopTitleTxt.destroy();
		if (warpRectangle != null) warpRectangle.destroy();
	};
};