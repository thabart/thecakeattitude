'use strict';
var Connect = function() {};
Connect.prototype = {
	preload: function() { },
	init: function() { },
	create: function() {
		var self = this;
		self.game.add.tileSprite(0, 0, 980, 600, 'bg2');
		var createLoginModal = function() {
			self.loginModal = new LoginModal();
			self.loginModal.init();
			self.loginModal.toggle();
			$(self.loginModal).on('authenticated', function(e, at) {
				UserClient.getClaims(at).then(function(r) {
					sessionStorage.setItem(Constants.sessionName, at);
					GameStateStore.setUser(r);
					self.game.state.start('Menu');
				}).fail(function() {
					self.loginModal.displayError(true, $.i18n('error-cannotAuthenticate'));
				});
			});
		};

		var session = sessionStorage.getItem(Constants.sessionName);
		if (session && session !== null) {
			UserClient.getClaims(session).then(function(r) {
				GameStateStore.setUser(r);
	 			self.game.state.start('Menu');
			}).fail(function() {
				sessionStorage.removeItem(Constants.sessionName);
				createLoginModal();
			});
		} else {
			createLoginModal();
		}
	},
	shutdown() {
		if (this.loginModal) this.loginModal.remove();
	}
};
