'use strict';
var Connect = function() {};
Connect.prototype = {
	preload: function() {
		
	},
	init: function() {
		var buildLoginModal = function() {
			var result = $("<div class='card' style='position: absolute; top: 50%; left: 50%;transform: translate(-50%, -50%);'>"+
				"<div class='card-header'>Authenticate</div>"+
				"<div class='card-block'><form>"+
					"<div class='form-group'><label>Login</label><input type='text' class='form-control' name='login' /></div>"+
					"<div class='form-group'><label>Password</label><input type='password' class='form-control' name='password' /></div>"+
					"<div class='form-group'><input type='submit' class='btn btn-default' value='login' /></div>"+
					"<div class='form-group'><a href='#'>Create an account</a></div>"+
					"<div class='form-group'><a href='http://localhost:5001/authorization?scope=openid%20profile&state=75BCNvRlEGHpQRCT&redirect_uri=http://localhost:3000/callback&response_type=id_token%20token&client_id=game&nonce=nonce&response_mode=query' id='use-external-account'>Use external account</a></div>"+
				"</div></form>"+
				"</div>");
			$(game).append(result);
			return result;
		};
		var titlePaddingTop = 10,
			titlePaddingLeft = 10,
			playWidth = 341,
			playHeight = 111,
			self = this,
			clientId = "game",
			clientSecret = "game",
			loginWindow = buildLoginModal(),
			getFormData = function getFormData(form){
				var unindexed_array = $(form).serializeArray();
				var indexed_array = {};
				$.map(unindexed_array, function(n, i){
					indexed_array[n['name']] = n['value'];
				});

				return indexed_array;
			},
			getParameterByName = function(name, url) {
				if (!url) url = window.location.href;
				name = name.replace(/[\[\]]/g, "\\$&");
				var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
					results = regex.exec(url);
				if (!results) return null;
				if (!results[2]) return '';
				return decodeURIComponent(results[2].replace(/\+/g, " "));
			};
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
			$.get('http://localhost:5001/.well-known/openid-configuration').then(function(r) {
				$.ajax(r.token_endpoint, {
					data: json,
					method: 'POST',
					dataType: 'json',
					contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				}).then(function(r) {
					var accessToken = r.access_token;
					loginWindow.remove();
					self.game.state.start("Menu");
				}).fail(function(e, p , t) {
					errorModal.display('an error occured while trying to authenticate the user', 3000, 'error');
				});
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
					clearInterval(interval);
					w.close();
					loginWindow.remove();
					self.game.state.start("Menu");
				}
			}, 1000);
		});
	}	
};