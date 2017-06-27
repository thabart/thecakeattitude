'use strict';
var Stylist = function() {};
Stylist.prototype = $.extend({}, BaseCharacter.prototype, {
	init: function(game, npc) {
		this.create(game, npc, 'stylist', $.i18n('stylistName'));
		this.modal = new StylistModal();
		this.modal.init();
	},
	interact: function() {
		this.modal.show();
	},
	destroy: function() {
	  this.sprite.destroy();
		this.modal.remove();
	}
});
