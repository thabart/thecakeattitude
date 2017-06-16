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
				OpenIdClient.introspect({ // Introsect the access token.
					client_id : Constants.ClientId,
					client_secret : Constants.ClientSecret,
					token : at,
					token_type_hint : 'access_token'
				}).then(function(r) {
					sessionStorage.setItem(Constants.sessionName, at);
					console.log(r);
					GameStateStore.setUser(r);
					self.game.state.start('Menu');
				}).fail(function() {
					self.loginModal.displayError(true, $.i18n('error-cannotAuthenticate'));
				});
			});
		};

		var session = sessionStorage.getItem(Constants.sessionName);
		if (session && session !== null) {
			OpenIdClient.introspect({
				client_id : Constants.ClientId,
				client_secret : Constants.ClientSecret,
				token : session,
				token_type_hint : 'access_token'
			}).then(function(r) {
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
