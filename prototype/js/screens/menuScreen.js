game.MenuScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		var self = this;
		me.game.world.addChild(new me.ColorLayer("background", "rgb(255,255,255)"), 0);
		self.authenticateMethodChooserBox = new game.Menu.AuthenticateMethodChooserBox();
		self.menuScreenBox = new game.Menu.MenuScreenBox(); 
		self.authenticateBox = new game.Menu.AuthenticateBox();
		game.Stores.MenuStore.listenAuthenticateMethodChooserBoxDisplayed(function() {
			self.authenticateMethodChooserBox.display();
			self.menuScreenBox.hide();
			self.authenticateBox.hide();
		});
		game.Stores.MenuStore.listenDisplayMenu(function() {
			self.authenticateMethodChooserBox.hide();
			self.menuScreenBox.display();
			self.authenticateBox.hide();
		});
		game.Stores.MenuStore.listenDisplayAuthentication(function() {
			self.authenticateMethodChooserBox.hide();
			self.menuScreenBox.hide();
			self.authenticateBox.display();
		});
		game.Stores.MenuStore.displayAuthenticateMethodChooserBox();
	},
	onDestroyEvent: function() {
		this.menuScreenBox.destroy();
		this.authenticateBox.destroy();
		this.authenticateMethodChooserBox.destroy();
	}
});