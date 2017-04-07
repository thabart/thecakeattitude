'use strict';
var StockManager = function(game, npc) {
	var buildModal = function(n) {		
		var result = $("<div class='modal fade'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'>"+
			"<h5 class='modal-title'>Manager your stock</h5>"+
			"<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
			"</div>"+
			"<div class='modal-body'>"+
			"<p>Manage your stock here.</p>"+
			"</div>"+
			"<div class='modal-footer'>"+
			"<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>"+
			"</div></div></div></div>");
		$(document.body).append(result);
		return result;
	};
	
	var self = this,
		modal = buildModal(npc),
		sprite = game.add.sprite(npc.x, npc.y, 'stock_manager'),
		npcTitlePaddingLeft = -10,
		npcTitlePaddingTop = -20,		
		titleStyle = { font: '20px Arial' };
	sprite.animations.add('stay');
	sprite.animations.play('stay', 1, true);
	sprite.inputEnabled = true;
	var titleX = npc.x + npcTitlePaddingLeft,
		titleY = npc.y + npcTitlePaddingTop;
	var text = game.add.text(titleX, titleY, npc.name, titleStyle);
	sprite.events.onInputOver.add(function() {
		game.canvas.style.cursor = "pointer";
	});
	sprite.events.onInputOut.add(function() {
		game.canvas.style.cursor = "default";
	});
	sprite.events.onInputDown.add(function() {
		this.interact();
	}, this);
	
	this.getSprite = function() {
		return sprite;
	};
	
	this.interact = function() {
		console.log('coucou');
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