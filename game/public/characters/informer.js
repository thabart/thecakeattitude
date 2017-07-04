'use strict';
var Informer = function() {};
Informer.prototype = $.extend({}, BaseCharacter.prototype, {
	init: function(game, npc) {
		this.create(game, npc, 'informer', $.i18n('informerName'), 1);
		this.modal = new InformerModal();
		this.modal.init();
		this.shopId = ShopMapStateStore.getShop().id;
	},
	interact: function() {
		this.modal.show(this.shopId);
	},
	destroy: function() {
	  this.sprite.destroy();
		this.modal.remove();
	}
});
