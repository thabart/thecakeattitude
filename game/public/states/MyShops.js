var MyShops = function() { };
MyShops.prototype = {
	preload: function() {
	},
	init: function(user) {
		var self = this;
		GameStateStore.onSizeChanged.call(this, function(size) {
			var coordinate = Calculator.getBgCoordinate(size, self.game, 'bg4');
			if (self.bg && self.bg !== null) self.bg.x = coordinate.x;
		});
	},
	create: function() {
		var self = this;
		var coordinate = Calculator.getBgCoordinate(GameStateStore.getSize(), self.game, 'bg4');
		self.bg = self.game.add.tileSprite(coordinate.x, 0, coordinate.w, self.game.world.height, 'bg4');
		self.myShopsSelector = new MyShopsSelectorModal(); // Add my shops modal selector.
		self.myShopsSelector.init();
		self.myShopsSelector.toggle();
		$(self.myShopsSelector).on('createShop', function() {
			self.game.state.start('ShopChooser');
		});
		self.backMenuFloating = new BackMenuFloating(); // Add back menu floating.
		self.backMenuFloating.init();
		$(self.backMenuFloating).on('back', function() {
			self.game.state.start('Menu');
		});
		self.profileMenuFloating = new ProfileMenuFloating(); // Add floating profile menu.
		self.profileMenuFloating.init();
		$(self.profileMenuFloating).on('disconnect', function() {
			self.game.state.start('Connect');
		});
	},
	shutdown: function() {
		this.profileMenuFloating.remove();
		this.myShopsSelector.remove();
		this.backMenuFloating.remove();
		GameStateStore.offSizeChanged.call(this);
	}
};
