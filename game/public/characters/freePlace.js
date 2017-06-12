var FreePlace = function() {};
FreePlace.prototype = $.extend({}, BaseCharacter.prototype, {
	init: function(game, npc) {
  	this.create(game, npc, 'freePlace');
    this.modal = new FreePlaceModal();
    this.modal.init(game);
	},
	interact() {
		this.modal.toggle();
	},
	destroy() {
	  this.sprite.destroy();
		this.modal.remove();
	}
});
