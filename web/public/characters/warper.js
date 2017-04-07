var Warper = function(game, npc) {
	var self = this,
		npcTitlePaddingLeft = -10,
		npcTitlePaddingTop = -20,
		isInteracting = false,
		modal = null,
		titleStyle = { font: '20px Arial' };
	// Initialize the sprite.
	var sprite = game.add.sprite(npc.x, npc.y, 'wraper');
	sprite.animations.add('stay');
	sprite.animations.play('stay', 1, true);
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
	var titleX = npc.x + npcTitlePaddingLeft,
		titleY = npc.y + npcTitlePaddingTop;
	var text = game.add.text(titleX, titleY, npc.name, titleStyle);
	
	var buildModal = function() {
		modal = $("<div class='modal fade'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'>"+
			"<h5 class='modal-title'>"+npc.name+"</h5>"+
			"<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
			"</div>"+
			"<div class='modal-body'>"+
			"<p>Modal body text goes here.</p>"+
			"</div>"+
			"<div class='modal-footer'>"+
			"<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>"+
			"</div></div></div></div>");
		$(document.body).append(modal);
		$(modal).on('hidden.bs.modal', function() {
			isInteracting = false;
			game.canvas.style.cursor = "default";
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
	
	this.getIsEnabled = function() {
		return true;
	};
	
	this.destroy = function() {
		sprite.destroy();
		text.destroy();
	};
};