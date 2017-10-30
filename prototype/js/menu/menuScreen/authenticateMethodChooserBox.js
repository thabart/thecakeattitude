game.Menu = game.Menu || {};
game.Menu.AuthenticateMethodChooserBox = me.Object.extend({
	init: function() {
		this.authenticateMethodChooserBox = $("<div class='modal center lg blue'>"+
			"<div class='container'>"+
				"<div class='content'>"+
					"<div class='top'>"+
						"<span data-i18n='authenticate_box_title'></span>"+
					"</div>"+
					"<div class='body'>"+
						"<form class='anonymous_auth'>"+
							"<label data-i18n='anonymous'></label>"+
							"<label data-i18n='pseudo'></label>"+
							"<input type='text' name='pseudo' />"+
							"<button class='button button-blue' data-i18n='enter'></button>"+
						"</form>"+
						"<button class='button button-blue authenticate' data-i18n='authenticate'></button>"+
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
				figure: 'hd-180-1.ch-255-66.lg-280-110.sh-305-62.ha-1012-110.hr-828-61'
			};
			me.loader.load({ name: player.name, src: 'resources/players/'+player.figure+'/sprite.png', type: 'image' }, function() {
				game.Stores.UserStore.setCurrentUser(player);
				game.Stores.MenuStore.displayMenu();
			});
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