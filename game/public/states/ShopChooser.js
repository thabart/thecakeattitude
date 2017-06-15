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
		self.shopChooserModal = new ShopChooserModal();
		self.shopChooserModal.init();
		self.shopChooserModal.toggle();
	},
	destroy: function() {
		this.backMenuFloating.remove();
		this.shopChooserModal.remove();
	}
};
