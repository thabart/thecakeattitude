game.Menu = game.Menu || {};
game.Menu.MenuScreenBox = me.Object.extend({
	init: function() {
		this.gameMenu = $("<div class='modal center lg blue'>"+
			"<div class='container'>"+
				"<div class='content'>"+
					"<div class='top'>"+
						"<span data-i18n='menu_screen_box_title'></span>"+
					"</div>"+
					"<div class='body'>"+
						"<ul class='no-style'>"+
							"<li><button class='button button-blue visit-shops' data-i18n='visit_shops'></button></li>"+
							"<li><button class='button button-blue' data-i18n='go_to_my_shop'></button></li>"+
							"<li><button class='button button-blue' data-i18n='disconnect'></button></li>"+
						"</ul>"+
					"</div>"+
					"<div class='bottom'>"+
					"</div>"+
				"</div>"+
			"</div>"+
		"</div>");
		$("#screen").append(this.gameMenu);
		$(this.gameMenu).i18n();
		this.addListeners();
	},
	addListeners: function() {
		$(this.gameMenu).find('.visit-shops').click(function() {
			me.state.change(me.state.PLAY, "reception");
		});
	},
	destroy: function() {
		$(this.gameMenu).remove();
	},
	hide: function() {
		$(this.gameMenu).hide();
	},
	display: function() {
		$(this.gameMenu).show();
	}
});