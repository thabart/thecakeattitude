'use strict';
var Shop = function(game, npc, map, warpGroup, opts = null) {
	var freePlaceState = "freePlace",
		shopTitleWidth = 200,
		shopTitleHeight = 41,
		shopTitleRect = null,
		shopTitleTxt = null,
		shopTitleBorderPadding = 2;
	var self = this;
	var isEnabled = false;
	var isInteracting = false;
	var modal = null;
	// Initialize the sprite.
	var tileSheet = null;
	map.tilesets.forEach(function(t) {
		if (t.firstgid == npc.gid) {
			tileSheet = t;
		}
	});
	
	if (tileSheet.name == freePlaceState) {
		isEnabled = true;
	}
	
	var sprite = game.add.sprite(npc.x, npc.y - tileSheet.tileHeight, tileSheet.name);	
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

	// Remove all the interactions.
	var removeInteraction = function() {
		isEnabled = false;
		sprite.inputEnabled = false;
		sprite.events.onInputOver.removeAll();
		sprite.events.onInputOut.removeAll();
		sprite.events.onInputDown.removeAll();
	};
	
	// Display shop.
	var displayShop = function(r) {
		removeInteraction();
		sprite.loadTexture('house', 0);				
		if (game.cache.checkTilemapKey(r.id)) {
			addWarp(r.id);			
			displayTile(r.title);
			return;
		}
		
		displayTile(r.title);
		var loader = game.load.tilemap(r.id, 'http://localhost:5000/' + r.path, null, Phaser.Tilemap.TILED_JSON);		
		loader.onLoadComplete.add(function() {
			addWarp(r.id);			
		}, warpGroup);
		loader.start();
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
	
	// Load the data.
	var init = function() {
		$.ajax({
			url: 'http://localhost:5000/shops/.search',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({map: map.key, place: npc.name}),
			success: function(r) {
				if (r.length != 1) {
					return;
				}
				
				displayShop(r[0]);
			}
		});
	};
	
	var addWarp = function(mapId) {		
		var rect = new Phaser.Sprite(game, npc.x + (tileSheet.tileWidth / 2) - 15, npc.y, 'name');
		rect.name = 'Warps';
		rect.exists = true;
		rect.autoCull = false;
		rect.width = 30;
		rect.height = 30;
		warpGroup.add(rect);
        warpGroup.set(rect, 'map', mapId, false, false, 0, true);
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
				url: 'http://localhost:5000/shops',
				method: 'POST',
				contentType: "application/json",
				data: JSON.stringify({ title: 'first-shop', map: map.key, place: npc.name }),
				success: function(r) {
					displayShop(r);
				},
				error: function() {
					// TODO : Display message error.
				}
			});
		});
	};
	
	buildModal();
	init();
	
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
		if (shopTitleRect != null)
		{
			shopTitleRect.destroy();		
		}
		
		if (shopTitleTxt != null)
		{
			shopTitleTxt.destroy();		
		}
	};
};