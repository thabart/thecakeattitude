'use strict';
var ShopSection = function() {};
ShopSection.prototype = $.extend({}, BaseCharacter.prototype, {
	init: function(game, npc) {
		var imageName = 'shopSection';
		var shopSectionImage = game.cache.getImage(imageName);
		npc.y = npc.y - shopSectionImage.height;
  	this.create(game, npc, imageName);
		// this.modal = new ShopSectionModal();
		this.modal = new AddProductcategoryModal();
		this.modal.init();
	},
	interact: function() {
		this.modal.toggle();
	},
	destroy: function() {
	  this.sprite.destroy();
		this.modal.remove();
	}
});
