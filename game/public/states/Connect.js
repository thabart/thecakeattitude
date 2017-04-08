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
					"<div class='form-group'><a href='#'>Use external account</a></div>"+
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
			$.ajax({
				type: 'POST',
				
			});
		});
	}	
};