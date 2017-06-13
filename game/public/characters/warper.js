var Warper = function() {};
Warper.prototype = $.extend({}, BaseCharacter.prototype, {
	init: function(game, npc) {
		var name = 'warper';
		this.create(game, npc, 'warper', 1);
		// this.modal = new WarperModal();
		this.modal = new FreePlaceModal();
		this.modal.init(game);
	},
	interact() {
		// this.modal.show();
		this.modal.toggle();
	},
	destroy() {
	  this.sprite.destroy();
		this.modal.remove();
	}
});
