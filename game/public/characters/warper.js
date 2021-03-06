var Warper = function() {};
Warper.prototype = $.extend({}, BaseCharacter.prototype, {
	init: function(game, npc) {
		var name = 'warper';
		this.create(game, npc, 'warper', $.i18n('warperName'), 1);
		this.modal = new WarperModal();
		this.modal.init(game);
	},
	interact() {
		this.modal.show();
	},
	destroy() {
	  this.sprite.destroy();
		this.modal.remove();
	}
});
