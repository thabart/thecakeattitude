'use strict';
var Shop = function(game, npc, map) {
	var self = this;
	var isInteracting = false;
	var modal = null;
	// Initialize the sprite.
	var tileSheet = null;
	map.tilesets.forEach(function(t) {
		if (t.firstgid == npc.gid) {
			tileSheet = t;
		}
	});
	
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
	
	var buildModal = function() {
		modal = $("<div class='modal fade'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'>"+
			"<h5 class='modal-title'>"+npc.name+"</h5>"+
			"<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
			"</div>"+
			"<div class='modal-body'>"+
			"<p>Do you want to take this shop ?</p>"+
			"</div>"+
			"<div class='modal-footer'>"+
			"<button type='button' class='btn btn-success' data-dismiss='modal'>Yes</button>"+
			"<button type='button' class='btn btn-secondary' data-dismiss='modal'>No</button>"+
			"</div></div></div></div>");
		$(document.body).append(modal);
		$(modal).on('hidden.bs.modal', function() {
			isInteracting = false;
			game.canvas.style.cursor = "default";
		});
		$(modal).find('.btn-success').click(function() {
		});
	};
	
	buildModal();
	
	this.getSprite = function() {
		return sprite;
	};
	
	this.interact = function() {
		if (isInteracting) {
			return;
		}
		
		isInteracting = true;
		$(modal).modal('toggle');
	};	
};