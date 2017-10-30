game.Screens = game.Screens || {};
game.Screens.GameScreen = me.ScreenObject.extend({
    onResetEvent: function(key) {
      var self = this;
      var mappingLevelToMap = [
        { name: "reception",  level: "coffee_shop_map", isEditable: false },
        { name: "shop",  level: "shop_map", isEditable: false }
      ];
      var currentPlayer = game.Stores.UserStore.getCurrentUser();
      var map = mappingLevelToMap.filter(function(m) { return m.name === key; })[0];
       me.levelDirector.loadLevel(map.level);
      self.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
      var collisionLayer = new PF.Grid(self.refLayer.rows - Constants.Layers.Ground.Position.Row, self.refLayer.cols - Constants.Layers.Ground.Position.Col); // Construct the collision layer.
      ShopStore.setCollisionLayer(collisionLayer);
      var movableContainer = new game.MovableContainer();
      var gameMenu = new game.Menu.GameMenu();
      self.currentPlayer = new game.PlayerEntity(1, 1, currentPlayer);
      var tileSelector = new game.TileSelectorEntity(0, 0);
      var floorSelector = new game.FloorEntitySelector();
      var wallSelector =  new game.WallEntitySelector();
      var furnitureSelector = new game.FurnitureEntitySelector();
      me.game.world.getChildByName('Building', {
        "container": movableContainer
      });
      me.game.world.addChild(movableContainer);
      me.game.world.addChild(tileSelector, Constants.playerZIndex - 1);
      me.game.world.addChild(self.currentPlayer);
      self.handlePointerMove = me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
        me.event.publish("pointermove", [ event ]);
      }, false);
      self.handlePointerDown = me.input.registerPointerEvent("pointerdown", me.game.viewport, function (event) {
        me.event.publish("pointerdown", [ event ]);
      }, false);
      game.Stores.UserStore.listenCurrentUserChanged(function() {
        var currentPlayer = game.Stores.UserStore.getCurrentUser();
        self.currentPlayer.updateSprite(currentPlayer);
      });
    },

    onDestroyEvent: function() {
      var self = this;
      me.event.unsubscribe(self.handlePointerMove);
      me.event.unsubscribe(self.handlePointerDown);
    }
});
