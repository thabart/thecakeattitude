var game = {
    onload: function() {
        if (!me.video.init(1200, 600, { wrapper : "screen", scale : me.device.getPixelRatio()})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        if (me.game.HASH.debug === true) {
          window.onReady(function () {
            me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
          });
        }

        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(g_ressources);
        me.state.change(me.state.LOADING);
    },

    loaded: function () {
        game.texture = new me.video.renderer.Texture(
            me.loader.getJSON("UI_Assets"),
            me.loader.getImage("UI_Assets")
        );

        me.game.world.sortOn = "x";
        me.game.sortOn = "x";
        me.state.set(me.state.PLAY, new game.ShopScreen());
        me.state.transition("fade","#FFFFFF", 250);
        me.state.change(me.state.PLAY);
    }
};


//bootstrap :)
window.onReady(function() {
    game.onload();
    document.oncontextmenu = document.body.oncontextmenu = function() { return false; }
});
