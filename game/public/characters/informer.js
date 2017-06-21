'use strict';
var Informer = function() {};
Informer.prototype = $.extend({}, BaseCharacter.prototype, {
	init: function(game, npc) {
		this.create(game, npc, 'informer', 1);
	},
	interact: function() {
		// this.modal.toggle();
	},
	destroy: function() {
	  this.sprite.destroy();
		// this.modal.remove();
	}
});
