game.Screens = game.Screens || {};
game.Screens.GameScreen = me.ScreenObject.extend({
    onResetEvent: function(key, shopId) {
      var self = this;
      self._players = [];
      var mappingLevelToMap = [
        { name: "reception", level: "reception_map" },
        { name: "coffee-house",  level: "coffee_shop_map" },
        { name: "shop",  level: "shop_map" }
      ];
      var currentPlayer = game.Stores.UserStore.getCurrentUser();
      var map = mappingLevelToMap.filter(function(m) { return m.name === key; })[0];
      self.currentMapName = map.name;
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
      currentPlayer.moveCallback = self.movePlayerCallback.bind(self);
      currentPlayer.moveFinishedCallback = self.updateMoveCallback.bind(self);
      self.currentPlayer = new game.Entities.CurrentPlayerEntity(playerCoordinates.col, playerCoordinates.row, currentPlayer);
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
      me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
        me.event.publish("pointermove", [ event ]);
      }, false);
      me.input.registerPointerEvent("pointerdown", me.game.viewport, function (event) {
        me.event.publish("pointerdown", [ event ]);
      }, false);
      self.updateCurrentUser = function() {
        var currentPlayer = game.Stores.UserStore.getCurrentUser();
        self.currentPlayer.updateSprite(currentPlayer);
        var image = me.loader.getImage(currentPlayer.name);
        self.currentPlayer.metadata.image = "<div style='background: url("+image.src+") -5px  -790px no-repeat; width: 64px; height: 110px;' class='img'></div>";
      };
      game.Stores.UserStore.listenCurrentUserChanged(self.updateCurrentUser);
      me.game.viewport.moveTo(self.currentPlayer.pos.x - (me.game.viewport.width / 2), self.currentPlayer.pos.y - (me.game.viewport.height / 2));
      me.game.world.children.forEach(function(child) {
        if (child instanceof game.SelectableEntity) {
          child.pos.z = child.getZIndex();
          game.Stores.GameStore.addEntity(child);
        }
      });
      game.Stores.GameStore.updateColls();
      self.initialize(shopId).then(function() {
        if (self.currentMapName === 'shop') { self.currentMapName = shopId; }
        self.gameMenu = new game.Menu.GameMenu();
        self.socket = io(Constants.socketServer).connect(); // Listen websockets.
        self.socket.on('connect', function() {
  			   self.socket.emit('new_player', { col : self.currentPlayer.currentTile.col, row : self.currentPlayer.currentTile.row, figure : currentPlayer.figure, map: self.currentMapName, name: self.currentPlayer.metadata.name });
        });
        self.socket.on('new_player', function(data) {
          self.addPlayer(data);
        });
        self.socket.on('remove_player', function(data) {
          self.removePlayer(data);
        });
        self.socket.on('move_player', function(data) {
          self.moveUser(data);
        });
        self.socket.on('message', function(data) {
          self.displayMessage(data);
        });
    		self.socket.on('disconnect', function() {
    			self.socket.emit('remove');
    		});
      });
      this.onMessageArrivedB = this.onMessageArrived.bind(this);
      game.Stores.GameStore.listenMessageArrived(this.onMessageArrivedB);
    },
    initialize : function(shopId) {
      var dfd = jQuery.Deferred();
      if (!shopId) {
        setTimeout(function() {
          dfd.resolve();
        }, 1000);
        return dfd;
      }


      $.when(this.setFurnitures(shopId), this.setEntities()).then(function() {
        dfd.resolve();
      });

      return dfd;
    },
    setFurnitures: function(shopId) {
      var dfd = jQuery.Deferred();
      game.Services.ShopsService.get(shopId).then(function(r) { // Add all the furnitures.
        var shop = r['_embedded'];
        shop['game_entities'].forEach(function(gameEntity) {
          var entity = null;
          var entities = me.loader.getJSON("entities");
          var entObj = entities.filter(function(e) { return e.name === gameEntity.name; })[0];
          var commonProps = {
            col: gameEntity.col,
            row: gameEntity.row,
            resource: gameEntity.name,
            id: gameEntity.id,
            type: entObj.type,
            flipped: gameEntity.is_flipped
          };

          if (gameEntity.product_category_id) {
            var productCategory = shop['product_categories'].filter(function(pc) { return pc.id === gameEntity.product_category_id; })[0];
            if (productCategory) {
              commonProps['product_category'] = productCategory;
            }
          }

          switch (gameEntity.type) {
            case "floor":
              entity = new game.Entities.FloorEntity(0, 0, commonProps);
            break;
            case "furniture":
              entity = new game.Entities.FurnitureEntity(0, 0, commonProps);
            break;
            case "wall":
              entity = new game.Entities.PosterEntity(0, 0, commonProps);
            break;
          }

          me.game.world.addChild(entity);
          entity.pos.z = entity.getZIndex();
          game.Stores.GameStore.addEntity(entity);
        });

        game.Stores.GameStore.updateColls();
        game.Stores.GameStore.setShopInformation(shop);
        dfd.resolve();
      }).catch(function() { console.error("the shop doesn't exist"); dfd.resolve(); });
      return dfd;
    },
    setEntities: function() {
      var dfd = jQuery.Deferred();
      game.Services.GameEntitiesService.getAll().then(function(r) {
        game.Stores.GameStore.setGameEntities(r);
        dfd.resolve();
      }).catch(function() { dfd.resolve(); });
      return dfd;
    },
    movePlayerCallback: function(nextTile) {
      var self = this;
      if (!self.socket) { return; }
      self.socket.emit('move_player', { nextcol: nextTile.col, nextrow: nextTile.row });
    },
    updateMoveCallback: function(currentTile) {
      var self = this;
      if (!self.socket) { return; }
      self.socket.emit('update_player_position', { row: currentTile.row, col: currentTile.col });
    },
    onMessageArrived: function(e, message) { // Send a message.
      if (!this.socket) { return; }
      this.socket.emit('message', { message : message });
    },
    displayMessage: function(data) { // Display a message.
      var self = this;
      var record = self.getPlayer(data.id);
      if (record === null) {
        return;
      }

      record.player.displayMessage(data.message);
    },
    addPlayer: function(data) {
      var self = this;
      if (data.map !== self.currentMapName) { return; }
      me.loader.load({ name: data.name, src: 'resources/players/'+data.figure+'/sprite.png', type: 'image' }, function() {
        var player = new game.Entities.PlayerEntity(data.col, data.row, {
          name: data.name
        });
        me.game.world.addChild(player);
        self._players.push({ id : data.id, player : player });
      });
    },
    moveUser: function(data) { // Move a user.
      var self = this;
      var record = self.getPlayer(data.id);
      if (record === null) {
        return;
      }

      record.player.setCurrentTile({ col: data.col, row: data.row });
      record.player.move({ col: data.nextcol, row: data.nextrow });
    },
    removePlayer: function(data) { // Remove the player.
      var self = this;
      var record = self.getPlayer(data.id);
      if (record === null) {
        return;
      }

      me.game.world.removeChild(record.player);
      var index = self._players.indexOf(record);
      self._players.splice(index, 1);
    },
    getPlayer: function(playerId) { // Get the player.
      var self = this;
      var record = self._players.filter(function(r) { return r.id === playerId; })[0];
      if (!record) {
        return null;
      }

      return record;
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
      game.Stores.GameStore.empty();
      game.Stores.UserStore.unsubscribeCurrentUserChanged(self.updateCurrentUser);
      me.input.releasePointerEvent("pointerdown", me.game.viewport);
      me.input.releasePointerEvent("pointermove", me.game.viewport);
      self.socket.disconnect();
      if (self.onMessageArrivedB) game.Stores.GameStore.unsubscribeMessageArrived(self.onMessageArrivedB)
    }
});
