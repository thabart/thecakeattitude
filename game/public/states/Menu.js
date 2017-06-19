'use strict';
var Menu = function() {};
Menu.prototype = {
	preload: function() { },
	init: function() {
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
		self.menuModal = new MenuModal(); // Display modal menu without close button.
		self.menuModal.init();
		self.menuModal.toggle();
		$(self.menuModal).on('viewYourShops', function() {
			self.game.state.start("MyShops");
		});
		$(self.menuModal).on('shopping', function() {
			var options = {
				isMainMap: true
			};
			self.game.state.start("SplashGame", true, false, options);
		});
		self.profileMenuFloating = new ProfileMenuFloating(); // Add floating profile menu.
		self.profileMenuFloating.init();
		$(self.profileMenuFloating).on('disconnect', function() {
			self.game.state.start('Connect');
		});
	},
	shutdown: function() {
		this.menuModal.remove();
		this.profileMenuFloating.remove();
		GameStateStore.offSizeChanged.call(this);
	}
};
