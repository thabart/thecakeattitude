var Warper = function() {};
Warper.prototype = $.extend({}, BaseCharacter.prototype, {
	init: function(game, npc) {
		var name = 'warper';
		this.create(game, npc, 'warper');
		this.modal = new WarperModal();
		this.modal.init();
	},
	interact() {
		this.modal.show();
	}
});
