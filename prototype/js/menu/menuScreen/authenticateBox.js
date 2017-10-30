game.Menu = game.Menu || {};
game.Menu.AuthenticateBox = me.Object.extend({
	init: function() {
		this.authenticateBox = $("<div class='modal center lg blue'>"+
			"<div class='container'>"+
				"<div class='content'>"+
					"<div class='top'>"+
						"<span data-i18n='authenticate_box_title'></span>"+
					"</div>"+
					"<div class='body'>"+
						"<form class='local-login'>"+
							"<label data-i18n='login'></label>"+
							"<input type='text' name='login' />"+
							"<label data-i18n='password'></label>"+
							"<input type='password' name='password' />"+
							"<button class='button button-blue' data-i18n='login'></button>"+
						"</form>"+
						"<button class='button button-blue external-login' data-i18n='use_external_idproviders'></button>"+
					"</div>"+
					"<div class='body loader' style='display: none;'>"+
						"<span data-i18n='loading'></span>"+
					"</div>"+
					"<div class='bottom'>"+
					"</div>"+
				"</div>"+
			"</div>"+
		"</div>");
		$("#screen").append(this.authenticateBox);
		$(this.authenticateBox).i18n();
		this.addListeners();
	},
	isLoading: function(b) {
		var self = this;
		if (b) {
			$(self.authenticateBox).find('.body').hide();
			$(self.authenticateBox).find('.loader').show();			
		} else {			
			$(self.authenticateBox).find('.body').show();
			$(self.authenticateBox).find('.loader').hide();
		}
	},
	addListeners: function() {
		var self = this;
		var getParameter = function(name, url) { // Get parameter from url.
		    if (!url) url = window.location.href;
		    name = name.replace(/[\[\]]/g, "\\$&");
		    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		    results = regex.exec(url);
		    if (!results) return null;
		    if (!results[2]) return '';
		    return decodeURIComponent(results[2].replace(/\+/g, " "));
		};

		var setAuthenticatedUser = function(accessToken) {
			game.Services.UserService.getClaims(accessToken).then(function(claims) {
				self.isLoading(false);
				game.Stores.UserStore.setCurrentUser(claims);
			});
		};

		$(self.authenticateBox).find('.local-login').submit(function(e) { // Local authentication.
			e.preventDefault();
			var login = $(self.authenticateBox).find("input[name='login']").val();
			var password = $(self.authenticateBox).find("input[name='password']").val();
			self.isLoading(true);
			game.Services.AuthenticateService.authenticate(login, password).then(function(r) {
				sessionStorage.setItem(Constants.sessionName, r.access_token);
				setAuthenticatedUser(r.access_token);
			}).catch(function() {
				self.isLoading(false);
			});
		});
		$(self.authenticateBox).find('.external-login', function() { // External authentication.
			self.isLoading(true);
			var href = Constants.openIdUrl + "/authorization?scope=openid%20profile%20email&state=75BCNvRlEGHpQRCT" +
				"&redirect_uri="+Constants.callbackUrl+"&response_type=id_token%20token&client_id="+Constants.clientId + "&nonce=nonce&response_mode=query";
			var w = window.open(href, 'targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=400');
			var interval = setInterval(function() {
				if (w.closed) {
					self.isLoading(false);
					clearInterval(interval);
					return;
				}

				var href = w.location.href;
				var accessToken = getParameter("access_token", href);
				if (accessToken) {
					clearInterval(interval);
					w.close();
					sessionStorage.setItem(Constants.sessionName, accessToken);
					setAuthenticatedUser(accessToken);
				}
			}, 1000);
		});
	},
	destroy: function() {
		$(this.authenticateBox).remove();
	},
	hide: function() {
		$(this.authenticateBox).hide();
	},
	display: function() {
		$(this.authenticateBox).show();
	}
});