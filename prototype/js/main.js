/**
 *
 * a basic Tiled loader
 */

var game = {

    /**
     * initlization
     */
    onload: function() {
        if (!me.video.init(800, 480, {wrapper : "jsapp", scale : me.device.getPixelRatio()})) {
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
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,    "up");
        me.input.bindKey(me.input.KEY.DOWN,  "down");
        me.input.bindKey(me.input.KEY.ENTER, "enter");
        me.state.change(me.state.PLAY);
    },



    /**
     *
     * change the current level
     * using the listbox current value in the HTML file
     */
    changelevel: function() {
        me.levelDirector.loadLevel("map");
    }

};


//bootstrap :)
window.onReady(function() {
    game.onload();
});