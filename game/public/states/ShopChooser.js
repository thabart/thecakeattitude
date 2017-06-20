var ShopChooser = function () {  };
ShopChooser.prototype = {
	preload: function() { },
	init: function() {
		var self = this;
		GameStateStore.onSizeChanged.call(this, function(size) {
			var coordinate = Calculator.getBgCoordinate(size, self.game, 'bg2');
			if (self.bg && self.bg !== null) self.bg.x = coordinate.x;
		});
	},
	create: function() {
		var self = this;
		var coordinate = Calculator.getBgCoordinate(GameStateStore.getSize(), self.game, 'bg2');
		self.bg = self.game.add.tileSprite(coordinate.x, 0, coordinate.w, self.game.world.height, 'bg2');
		self.backMenuFloating = new BackMenuFloating(); // Add back menu floating.
		self.backMenuFloating.init();
		$(self.backMenuFloating).on('back', function() {
			self.game.state.start('MyShops');
		});
		self.shopChooserModal = new ShopChooserModal(); // Add shop chooser modal.
		self.shopChooserModal.init();
		self.shopChooserModal.toggle();
		$(self.shopChooserModal).on('freePlace', function(e, data) { // Display free modal window.
			self.freePlaceModal.show(data);
		});
		$(self.shopChooserModal).on('goToTheShop', function(e, data) {
			self.game.state.start("SplashGame", true, false, data);
		});
		self.freePlaceModal = new FreePlaceModal(); // Add free place modal.
		self.freePlaceModal.init();
		AppDispatcher.register(function(message) {
			if (message.actionName === 'new-shop' && message.data && message.data.common_id === self.freePlaceModal.getCommonId()) {
				self.game.state.start("MyShops");
			}
		});
		$(self.freePlaceModal).on('shopAdded', function() {
		});
		self.profileMenuFloating = new ProfileMenuFloating(); // Add floating profile menu.
		self.profileMenuFloating.init();
		$(self.profileMenuFloating).on('disconnect', function() {
			self.game.state.start('Connect');
		});
	},
	shutdown: function() {
		this.backMenuFloating.remove();
		this.shopChooserModal.remove();
		this.freePlaceModal.remove();
		this.profileMenuFloating.remove();
		GameStateStore.offSizeChanged.call(this);
		AppDispatcher.remove();
	}
};
