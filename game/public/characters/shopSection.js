'use strict';
var ShopSection = function() {};
ShopSection.prototype = $.extend({}, BaseCharacter.prototype, {
	initTaken: function(game, npc) {
		var self = this;
		var imageName =  'takenShopSection';
		var shopSectionImage = game.cache.getImage(imageName);
		npc.y = npc.y - shopSectionImage.height;
  	self.create(game, npc, imageName);
		self.modal = new ShopSectionModal();
		self.modal.init(npc);
	},
	initFree: function(game, npc) {
		var self = this;
		var imageName =  'freeShopSection';
		var shopSectionImage = game.cache.getImage('takenShopSection');
		npc.y = npc.y - shopSectionImage.height / 2;
		npc.x = npc.x + 30;
  	self.create(game, npc, imageName, null, 12);
		self.modal = new AddProductcategoryModal();
		self.modal.init();
	},
	interact: function() {
		var self = this;
		self.modal.show();
	},
	destroy: function() {
		var self = this;
	  self.sprite.destroy();
		self.modal.remove();
	}
});
