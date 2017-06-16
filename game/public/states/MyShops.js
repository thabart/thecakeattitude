var MyShops = function() { };
MyShops.prototype = {
	preload: function() {
	},
	init: function(user) { },
	create: function() {
		var self = this;
		self.game.add.tileSprite(0, 0, 980, 600, 'bg4');
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
	}
};
