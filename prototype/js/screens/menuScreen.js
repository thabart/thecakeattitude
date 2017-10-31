game.MenuScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		var self = this;
		console.log('reset');
		me.game.world.addChild(new me.ColorLayer("background", new me.Color(0,0,0,1), 1));
		self.authenticateMethodChooserBox = new game.Menu.AuthenticateMethodChooserBox();
		self.authenticateBox = new game.Menu.AuthenticateBox();
		game.Stores.MenuStore.listenAuthenticateMethodChooserBoxDisplayed(function() {
			self.authenticateMethodChooserBox.display();
			self.authenticateBox.hide();
		});
		game.Stores.MenuStore.listenDisplayAuthentication(function() {
			self.authenticateMethodChooserBox.hide();
			self.authenticateBox.display();
		});
		game.Stores.UserStore.listenCurrentUserChanged(function() {
			me.state.change(me.state.PLAY, "reception");
		});
		game.Stores.MenuStore.displayAuthenticateMethodChooserBox();
	},
	onDestroyEvent: function() {
		this.authenticateBox.destroy();
		this.authenticateMethodChooserBox.destroy();
	}
});