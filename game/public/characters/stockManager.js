var StockManager = function() {};
StockManager.prototype = $.extend({}, BaseCharacter.prototype, {
	init: function(game, npc) {
		var name = 'stockManager';
		this.create(game, npc, 'stockManager', $.i18n('stockManagerName'), 1);
		this.modal = new StockManagerModal();
		this.modal.init();
	},
	interact() {
		this.modal.toggle();
	},
	destroy() {
	  this.sprite.destroy();
		this.modal.remove();
	}
});
