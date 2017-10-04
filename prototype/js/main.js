/**
 *
 * a basic Tiled loader
 */

var game = {

    /**
     * initlization
     */
    onload: function() {
        if (!me.video.init(1200, 600, { wrapper : "screen", scale : me.device.getPixelRatio()})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(g_ressources);
        me.state.change(me.state.LOADING);
    },


    /**
     * callback when everything is loaded
     */
    loaded: function () {
        game.texture = new me.video.renderer.Texture( // Load texture atlas file.
            me.loader.getJSON("UI_Assets"),
            me.loader.getImage("UI_Assets")
        );
        game.furnitures = new me.video.renderer.Texture(
            me.loader.getJSON("Furnitures"),
            me.loader.getImage("Furnitures")
        );
        me.state.set(me.state.PLAY, new game.ShopScreen());
        me.state.transition("fade","#FFFFFF", 250);
        me.state.change(me.state.PLAY);
    }
};


//bootstrap :)
window.onReady(function() {
    game.onload();
    // document.oncontextmenu = document.body.oncontextmenu = function() { return false; }
});
