game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function() {
      this.state = {
        dragInitStartingX : 0,
        dragInitStartingY : 0,
        dragging: false
      };
      me.levelDirector.loadLevel("map");
      this.handlePointerDown = me.input.registerPointerEvent('pointerdown', me.game.viewport, this.onMouseDown.bind(this));
      this.handlePointerMove = me.input.registerPointerEvent('pointermove', me.game.viewport, this.onMouseMove.bind(this));
      this.handlePointerMove = me.input.registerPointerEvent('pointerup', me.game.viewport, this.onMouseUp.bind(this));
  		var currentLevel = me.levelDirector.getCurrentLevel();
  		me.game.viewport.move(currentLevel.width / 2, 0);
  		me.game.viewport.move(0, currentLevel.height / 2);
      me.game.repaint();
    },

    onMouseDown: function(e) {
      this.state.dragging = true;
      this.state.dragInitStartingX = e.gameScreenX;
      this.state.dragInitStartingY = e.gameScreenY;
    },

    onMouseMove: function(e) {
      if (!this.state.dragging) {
        return;
      }

      var diffX = e.gameScreenX - this.state.dragInitStartingX;
      var diffY = e.gameScreenY - this.state.dragInitStartingY;
      me.game.viewport.move(-diffX, -diffY);
      me.game.repaint();
      this.state.dragInitStartingX = e.gameScreenX;
      this.state.dragInitStartingY = e.gameScreenY;
    },

    onMouseUp: function() {
      this.state.dragging = false;
    },

    dragEnd: function() {
      console.log("drag end");
    },
    /*
    keyPressed: function (action) {
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
    */
    onDestroyEvent: function() {
        me.event.unsubscribe(this.handle);
    }
});
