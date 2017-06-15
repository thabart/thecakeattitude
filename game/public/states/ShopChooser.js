var ShopChooser = function () {  };
ShopChooser.prototype = {
	preload: function() { },
	init: function() { },
	create: function() {
		var self = this;
		self.game.add.tileSprite(0, 0, 980, 600, 'bg2');
		self.backMenuFloating = new BackMenuFloating(); // Add back menu floating.
		self.backMenuFloating.init();
		$(self.backMenuFloating).on('back', function() {
			self.game.state.start('MyShops');
			self.destroy();
		});
		self.shopChooserModal = new ShopChooserModal(); // Add shop chooser modal.
		self.shopChooserModal.init();
		self.shopChooserModal.toggle();
		$(self.shopChooserModal).on('freePlace', function() { // Display free modal window.
			self.freePlaceModal.toggle();
		});
		self.freePlaceModal = new FreePlaceModal();
		self.freePlaceModal.init();
	},
	destroy: function() {
		this.backMenuFloating.remove();
		this.shopChooserModal.remove();
		this.freePlaceModal.remove();
	}
};
