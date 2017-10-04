game.ShopScreen = me.ScreenObject.extend({
    onResetEvent: function() {
      me.levelDirector.loadLevel("map");
      this.refLayer = me.game.world.getChildByName("Ground")[0];
      var movableContainer = new game.MovableContainer();
      var gameMenu = new game.GameMenu();
      var tileSelector = new game.TileSelector(2);
      var furnitureSelector = new game.FurnitureSelector(5);
      this._buildingLayer = me.game.world.getChildByName('Building', {
        "container": movableContainer
      });
      me.game.world.addChild(movableContainer);
      this.handlePointerMove = me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
        me.event.publish("pointermove", [ event ]);
      }, false);
      this.handlePointerDown = me.input.registerPointerEvent("pointerdown", me.game.viewport, function (event) {
        me.event.publish("pointerdown", [ event ]);
      }, false);
    },

    onDestroyEvent: function() {
      me.event.unsubscribe(this.handlePointerMove);
      me.event.unsubscribe(this.handlePointerDown);
    }
});
