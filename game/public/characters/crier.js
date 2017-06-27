'use strict';
var Crier = function() {};
Crier.prototype = $.extend({}, BaseCharacter.prototype, {
	init: function(game, npc) {
		this.create(game, npc, 'crier', $.i18n('crierName'), 1);
		this.modal = new CrierModal();
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
