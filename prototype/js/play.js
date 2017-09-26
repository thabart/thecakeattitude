game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        me.levelDirector.loadLevel("map");
        this.handle = me.event.subscribe(me.event.KEYDOWN, this.keyPressed.bind(this));
		var currentLevel = me.levelDirector.getCurrentLevel();
		me.game.viewport.move(currentLevel.width / 2, 0);
		me.game.viewport.move(0, currentLevel.height / 2);
        me.game.repaint();
    },

    keyPressed: function (action /*, keyCode, edge */) {
        if (action === "left") {
            me.game.viewport.move(-(me.levelDirector.getCurrentLevel().tilewidth / 2), 0);

        } else if (action === "right") {
            me.game.viewport.move(me.levelDirector.getCurrentLevel().tilewidth / 2, 0);
        }

        if (action === "up") {
            me.game.viewport.move(0, -(me.levelDirector.getCurrentLevel().tileheight / 2));

        } else if (action === "down") {
            me.game.viewport.move(0, me.levelDirector.getCurrentLevel().tileheight / 2);
        }

        if (action === "enter") {
            me.game.viewport.shake(16, 500);
        }

        me.game.repaint();
    },

    onDestroyEvent: function() {
        me.event.unsubscribe(this.handle);
    }
});