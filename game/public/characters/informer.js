'use strict';
var Informer = function() {};
Informer.prototype = $.extend({}, BaseCharacter.prototype, {
	init: function(game, npc, shopId) {
		this.shopId = shopId;
		this.create(game, npc, 'informer', $.i18n('informerName'), 1);
		this.modal = new InformerModal();
		this.modal.init();
	},
	interact: function() {
		this.modal.show(this.shopId);
	},
	destroy: function() {
	  this.sprite.destroy();
		this.modal.remove();
	}
});
