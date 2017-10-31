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
      var collisionLayer = new PF.Grid(self.refLayer.rows, self.refLayer.cols); // Construct the collision layer.
      for (var col = 0; col < self.refLayer.cols; col++) {
        for(var row = 0; row < self.refLayer.rows; row++) {
          var tile = self.refLayer.layerData[col][row];
          collisionLayer.setWalkableAt(row, col, tile && tile !== null);
        }
      }

      console.log(collisionLayer);
      ShopStore.setCollisionLayer(collisionLayer);
      self.movableContainer = new game.MovableContainer();
      self.gameMenu = new game.Menu.GameMenu();
      self.currentPlayer = new game.PlayerEntity(5, 5, currentPlayer);
      self.tileSelector = new game.TileSelectorEntity(0, 0);
      self.floorSelector = new game.FloorEntitySelector();
      self.wallSelector =  new game.WallEntitySelector();
      self.furnitureSelector = new game.FurnitureEntitySelector();
      me.game.world.getChildByName('Building', {
        "container": self.movableContainer
      });
      me.game.world.addChild(self.movableContainer);
      me.game.world.addChild(self.tileSelector, Constants.playerZIndex - 1);
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
      self.movableContainer.destroy();
      self.tileSelector.destroy();
      self.floorSelector.destroy();
      self.wallSelector.destroy();
      self.furnitureSelector.destroy();
      self.gameMenu.destroy();
      self.currentPlayer.destroy();
    }
});
