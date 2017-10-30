game.MenuScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		me.game.world.addChild(new me.ColorLayer("background", "rgb(255,255,255)"), 0);
		this.menuScreenBox = new game.Menu.MenuScreenBox(); 
	},
	onDestroyEvent: function() {
		this.menuScreenBox.destroy();
	}
});