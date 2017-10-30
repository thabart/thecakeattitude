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
							"<input type='password' />"+
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
	addListeners: function() {
		var self = this;
		$(self.authenticateBox).find('.local-login').submit(function(e) {
			e.preventDefault();
			var login = $(self).find("input[name='login']").val();
			var password = $(self).find("input[name='password']").val();
			$(self.authenticateBox).find('.body').hide();
			$(self.authenticateBox).find('.loader').show();
			
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