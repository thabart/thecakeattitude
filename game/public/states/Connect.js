'use strict';
var Connect = function() {};
Connect.prototype = {
	preload: function() {
		this.game.load.image('bg2', 'styles/backgrounds/bg2.jpg');
	},
	init: function() { },
	create: function() {
		var self = this;
		self.game.add.tileSprite(0, 0, 980, 600, 'bg2');
		var loginModal = new LoginModal();
		loginModal.init();
		loginModal.toggle();
		/*
		var titlePaddingTop = 10,
			titlePaddingLeft = 10,
			playWidth = 341,
			playHeight = 111,
			self = this,
			clientId = Constants.ClientId,
			clientSecret = Constants.ClientSecret,
			sessionName = Constants.SessionName,
			loginWindow = buildLoginModal(),
			// getFormData = Helpers.getFormData,
			getParameterByName = function(name, url) {
				if (!url) url = window.location.href;
				name = name.replace(/[\[\]]/g, "\\$&");
				var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
					results = regex.exec(url);
				if (!results) return null;
				if (!results[2]) return '';
				return decodeURIComponent(results[2].replace(/\+/g, " "));
			},
			openIdWellKnownConfiguration = Constants.openIdWellKnownConfiguration,
			displayLoading = function(isLoading) {
				if (isLoading) {
					$(loginWindow).find('.fa-spinner').show();
					$(loginWindow).find('form').hide();
				} else {
					$(loginWindow).find('.fa-spinner').hide();
					$(loginWindow).find('form').show();
				}
			},
			navigateToMenu = function(subject) {
				self.game.state.start("Menu", true, false, subject);
				loginWindow.remove();
			},
			introspectAccessToken = function(accessToken, introspectionUrl, successCallback, errorCallback) {
				var json = {
					client_id : clientId,
					client_secret : clientSecret,
					token : accessToken,
					token_type_hint : 'access_token'
				};
				$.ajax(introspectionUrl, {
					data: json,
					method: 'POST',
					dataType: 'json'
				}).then(function(r) {
					if (r.active) {
						if (successCallback) successCallback(r);
						return;
					}

					if (errorCallback) errorCallback();
				}).fail(function() {
					if (errorCallback) errorCallback();
				});
			};
		*/
		/*
		if (sessionStorage.getItem(sessionName)) {
			var accessToken = sessionStorage.getItem(sessionName);
			$.get(openIdWellKnownConfiguration).then(function(c) {
				var introspectionUrl = c.introspection_endpoint;
				introspectAccessToken(accessToken, introspectionUrl, function(r) {
					navigateToMenu(r.sub);
				}, function() {
					displayLoading(false);
					sessionStorage.removeItem(sessionName);
				});
			}).fail(function() {
				displayLoading(false);
				errorModal.display('Cannot contact the server', 3000, 'error');
			});
		} else {
			displayLoading(false);
		}
		*/
		/*
		loginWindow.find('form').submit(function(e) {
			e.preventDefault();
			var serialize = getFormData(this);
			var json = {
				grant_type: 'password',
				username: serialize.login,
				password: serialize.password,
				scope: 'openid profile',
				client_id: clientId,
				client_secret: clientSecret
			};
			var data = encodeURIComponent(JSON.stringify(json));
			$.get(openIdWellKnownConfiguration).then(function(config) {
				var introspectionUrl = config.introspection_endpoint;
				$.ajax(config.token_endpoint, {
					data: json,
					method: 'POST',
					dataType: 'json'
				}).then(function(r) {
					var accessToken = r.access_token;
					introspectAccessToken(accessToken, introspectionUrl, function(i) {
						sessionStorage.setItem(sessionName, accessToken); // Store the access token into the session.
						navigateToMenu(i.sub);
					});
				}).fail(function(e, p , t) {
					errorModal.display('an error occured while trying to authenticate the user', 3000, 'error');
				});
			}).fail(function() {
				errorModal.display('Cannot contact the server', 3000, 'error');
			});
		});
		loginWindow.find('#use-external-account').click(function(e) {
			e.preventDefault();
			var href = $(this).attr('href');
			var w = window.open(href, 'targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=400');
			var interval = setInterval(function() {
				if (w.closed) {
					clearInterval(interval);
					return;
				}

				var href = w.location.href;
				var accessToken = getParameterByName('access_token', href);
				if (accessToken) {
					$.get(openIdWellKnownConfiguration).then(function(config) {
						var introspectionUrl = config.introspection_endpoint;
						introspectAccessToken(accessToken, introspectionUrl, function(i) {
							clearInterval(interval);
							w.close();
							sessionStorage.setItem(sessionName, accessToken); // Store the access token into the session.
							navigateToMenu(i.sub);
						});
					});
				}
			}, 1000);
		});
		*/
	}
};
