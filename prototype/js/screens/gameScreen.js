game.Screens = game.Screens || {};
game.Screens.GameScreen = me.ScreenObject.extend({
    onResetEvent: function(key) {
      var self = this;
      var mappingLevelToMap = [
        { name: "reception",  level: "coffee_shop_map" },
        { name: "shop",  level: "shop_map", sub: 'thabart' }
      ];
      var currentPlayer = game.Stores.UserStore.getCurrentUser();
      var map = mappingLevelToMap.filter(function(m) { return m.name === key; })[0];
      currentPlayer.is_owner = map.sub === map.name;
      game.Stores.UserStore.updateCurrentUser(currentPlayer);
      me.levelDirector.loadLevel(map.level);
      var entry = me.game.world.getChildByName(Constants.Layers.Entry.Name)[0];
      self.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
      var playerCoordinates = self.refLayer.getTile(entry.pos.x, entry.pos.y);
      var collisionLayer = new PF.Grid(self.refLayer.rows, self.refLayer.cols); // Construct the collision layer.
      for (var col = 0; col < self.refLayer.cols; col++) {
        for(var row = 0; row < self.refLayer.rows; row++) {
          var tile = self.refLayer.layerData[col][row];
          if (tile === null) {
            collisionLayer.setWalkableAt(row, col, false);
          }
        }
      }

      game.Stores.GameStore.setCollisionLayer(collisionLayer);
      self.movableContainer = new game.MovableContainer();
      self.gameMenu = new game.Menu.GameMenu();
      self.currentPlayer = new game.PlayerEntity(playerCoordinates.col, playerCoordinates.row, currentPlayer);
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
      self.updateCurrentUser = function() {
        var currentPlayer = game.Stores.UserStore.getCurrentUser();
        self.currentPlayer.updateSprite(currentPlayer);
      };
      game.Stores.UserStore.listenCurrentUserChanged(self.updateCurrentUser);
      me.game.viewport.moveTo(self.currentPlayer.pos.x - (me.game.viewport.width / 2), self.currentPlayer.pos.y - (me.game.viewport.height / 2));
      me.game.world.children.forEach(function(child) {
        if (child instanceof game.SelectableEntity) {
          child.pos.z = Constants.playerZIndex;
          game.Stores.GameStore.addEntity(child);
        }
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
      game.Stores.UserStore.unsubscribeCurrentUserChanged(self.updateCurrentUser);
    }
});
