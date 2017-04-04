var InfoPanel = function(game, npc, map, shop) {
	var modal = null;
	var self = this;
	var sprite = game.add.sprite(npc.x, npc.y, 'panel-info');		
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
			"<h5 class='modal-title'>Welcome to "+shop.title+"</h5>"+
			"<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
			"</div>"+
			"<div class='modal-body'>"+
			"<p>Some information</p>"+
			"</div>"+
			"<div class='modal-footer'>"+
			"<button type='button' class='btn btn-secondary' data-dismiss='modal'>No</button>"+
			"</div></div></div></div>");
		$(document.body).append(modal);
		$(modal).on('hidden.bs.modal', function() {
			game.canvas.style.cursor = "default";
		});
	};
	
	buildModal();
	
	this.getSprite = function() {
		return sprite;
	};
	
	this.interact = function() {
		console.log(modal);
		$(modal).modal('toggle');
	};	
	
	this.getIsEnabled = function() {
		return true;
	};
};