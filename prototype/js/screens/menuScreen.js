game.MenuScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		var self = this;
		me.game.world.addChild(new me.ColorLayer("background", new me.Color(0,0,0,1), 1));
		self.authenticateMethodChooserBox = new game.Menu.AuthenticateMethodChooserBox();
		self.authenticateBox = new game.Menu.AuthenticateBox();
		self.displayAuthenticateMethodChooserBox = function() {
			self.authenticateMethodChooserBox.display();
			self.authenticateBox.hide();
		};
		self.displayAuthentication = function() {
			self.authenticateMethodChooserBox.hide();
			self.authenticateBox.display();
		};
		game.Stores.MenuStore.listenAuthenticateMethodChooserBoxDisplayed(this.displayAuthenticateMethodChooserBox);
		game.Stores.MenuStore.listenDisplayAuthentication(this.displayAuthentication);
		game.Stores.UserStore.listenCurrentUserChanged(this.currentUserChanged);
		game.Stores.MenuStore.displayAuthenticateMethodChooserBox();
	},

	currentUserChanged: function() {
		var player = game.Stores.UserStore.getCurrentUser();
		me.loader.load({ name: player.name, src: 'resources/players/'+player.figure+'/sprite.png', type: 'image' }, function() {
			me.state.change(me.state.PLAY, "reception");
		});
	},

	onDestroyEvent: function() {
		this.authenticateBox.destroy();
		this.authenticateMethodChooserBox.destroy();
		game.Stores.UserStore.unsubscribeCurrentUserChanged(this.currentUserChanged);
		game.Stores.MenuStore.unsubscribeDisplayAuthentication(this.displayAuthentication);
		game.Stores.MenuStore.unsubscribeAuthenticateMethodChooserBoxDisplayed(this.displayAuthenticateMethodChooserBox);
	}
});
