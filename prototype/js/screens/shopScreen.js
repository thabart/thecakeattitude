game.ShopScreen = me.ScreenObject.extend({
    onResetEvent: function() {
      me.levelDirector.loadLevel("map");
      this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground)[0];
      game.collisionLayer = new PF.Grid(this.refLayer.rows, this.refLayer.cols); // Construct the collision layer.
      var movableContainer = new game.MovableContainer();
      var gameMenu = new game.GameMenu();
      var coordinates = this.refLayer.getRenderer().tileToPixelCoords(6, 6); // Draw the player at cell (6, 6).
      var playerWidth = 41;
      var playerHeight = 83;
      var player = new game.PlayerEntity(coordinates.x - (playerWidth / 2), coordinates.y - (playerHeight), {
        width: playerWidth,
        height: playerHeight
      });
      game.furnitureContainer = new game.FurnitureContainer();
      var tileSelector = new game.TileSelector(2);
      var furnitureSelector = new game.FurnitureSelector(5);
      this._buildingLayer = me.game.world.getChildByName('Building', {
        "container": movableContainer
      });
      me.game.world.addChild(movableContainer);
    //   me.game.world.addChild(player, 4);
      me.game.world.addChild(game.furnitureContainer, 5);
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
