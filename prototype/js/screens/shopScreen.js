game.ShopScreen = me.ScreenObject.extend({
    onResetEvent: function() {
      me.levelDirector.loadLevel("map");
      this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
      game.collisionLayer = new PF.Grid(this.refLayer.rows - Constants.Layers.Ground.Position.Row, this.refLayer.cols - Constants.Layers.Ground.Position.Col); // Construct the collision layer.
      var movableContainer = new game.MovableContainer();
      var gameMenu = new game.GameMenu();
      var player = new game.PlayerEntity(5, 5);
      game.furnitureContainer = new game.FurnitureContainer();
      var tileSelector = new game.TileSelector(2);
      var furnitureSelector = new game.FurnitureSelector(5);
      this._buildingLayer = me.game.world.getChildByName('Building', {
        "container": movableContainer
      });
      me.game.world.addChild(movableContainer);
      me.game.world.addChild(player, 4);
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
