var ShopChooser = function () {  };
ShopChooser.prototype = {
	preload: function() { },
	init: function() { },
	create: function() {
		var self = this;
		self.game.add.tileSprite(0, 0, 980, 600, 'bg2');
		self.profileMenuFloating = new ProfileMenuFloating(); // Add floating profile menu.
		self.profileMenuFloating.init();
		$(self.profileMenuFloating).on('disconnect', function() {
			self.game.state.start('Connect');
		});
		self.backMenuFloating = new BackMenuFloating(); // Add back menu floating.
		self.backMenuFloating.init();
		$(self.backMenuFloating).on('back', function() {
			self.game.state.start('MyShops');
		});
		self.shopChooserModal = new ShopChooserModal(); // Add shop chooser modal.
		self.shopChooserModal.init();
		self.shopChooserModal.toggle();
		$(self.shopChooserModal).on('freePlace', function() { // Display free modal window.
			self.freePlaceModal.toggle();
		});
		$(self.shopChooserModal).on('goToTheShop', function(e, data) {
			self.game.state.start("SplashGame", true, false, data);
		});
		self.freePlaceModal = new FreePlaceModal();
		self.freePlaceModal.init();
	},
	shutdown: function() {
		this.profileMenuFloating.remove();
		this.backMenuFloating.remove();
		this.shopChooserModal.remove();
		this.freePlaceModal.remove();
	}
};
