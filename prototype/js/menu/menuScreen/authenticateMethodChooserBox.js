game.Menu = game.Menu || {};
game.Menu.AuthenticateMethodChooserBox = me.Object.extend({
	init: function() {
		this.authenticateMethodChooserBox = $("<div class='modal center lg blue'>"+
			"<div class='container'>"+
				"<div class='content'>"+
					"<div class='top'>"+
						"<span data-i18n='authenticate_box_title'></span>"+
					"</div>"+
					"<div class='body' style='padding: 5px;'>"+
						"<div class='col-6'>"+
							"<div class='gray-panel'>"+
								"<div class='top'></div>"+
								"<div class='body'>"+
									"<form class='anonymous_auth'>"+
										"<label data-i18n='pseudo'></label>"+
										"<div class='input edit'>"+
               								"<div class='top'></div>"+
               								"<div class='body'>"+
												"<input type='text' name='pseudo' />"+
											"</div>"+
											"<div class='bottom'></div>"+
										"</div>"+
										"<button class='button button-blue' data-i18n='enter'></button>"+
									"</form>"+
								"</div>"+
								"<div class='bottom'></div>"+
							"</div>"+
						"</div>"+
						"<div class='col-4 offset-2'>"+
							"<div class='gray-panel'>"+
								"<div class='top'></div>"+
								"<div class='body'>"+
									"<button class='button button-blue authenticate' data-i18n='authenticate'></button>"+
								"</div>"+
								"<div class='bottom'></div>"+
							"</div>"+
						"</div>"+
					"</div>"+
					"<div class='bottom'>"+
					"</div>"+
				"</div>"+
			"</div>"+
		"</div>");
		$("#screen").append(this.authenticateMethodChooserBox);
		$(this.authenticateMethodChooserBox).i18n();
		this.addListeners();
	},
	addListeners: function() {
		var self = this;
		$(self.authenticateMethodChooserBox).find('.anonymous_auth').submit(function(e) {
			e.preventDefault();
			var pseudo = $(self.authenticateMethodChooserBox).find('input[name="pseudo"]').val();
			var player = {
				name : pseudo,
				figure: 'hd-209-31.ch-215-63.lg-270-63.sh-305-62',
				is_visitor : true
			};
			game.Stores.UserStore.setCurrentUser(player);
		});
		$(self.authenticateMethodChooserBox).find('.authenticate').click(function() {
			game.Stores.MenuStore.displayAuthentication();
		});
	},
	destroy: function() {
		$(this.authenticateMethodChooserBox).remove();
	},
	hide: function() {
		$(this.authenticateMethodChooserBox).hide();
	},
	display: function() {
		$(this.authenticateMethodChooserBox).show();
	}
});