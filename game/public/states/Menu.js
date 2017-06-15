'use strict';
var Menu = function() {};
Menu.prototype = {
	preload: function() { },
	init: function() { },
	create: function() {
		var self = this;
		self.game.add.tileSprite(0, 0, 980, 600, 'bg4');
		self.profileMenuFloating = new ProfileMenuFloating(); // Add floating profile menu.
		self.profileMenuFloating.init();
		self.menuModal = new MenuModal(); // Display modal menu without close button.
		self.menuModal.init();
		self.menuModal.toggle();
		$(self.menuModal).on('shopping', function() {
			var options = {
				isMainMap: true
			};
			self.game.state.start("SplashGame", true, false, options);
		});
	},
	shutdown: function() {
		this.menuModal.remove();
		this.profileMenuFloating.remove();
	}
};
