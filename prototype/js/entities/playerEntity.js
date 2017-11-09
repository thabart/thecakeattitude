game.PlayerEntity = me.Entity.extend({
    init: function(col, row, opts) {
        this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
        var coordinates = this.refLayer.getRenderer().tileToPixelCoords(col, row);
        var image = me.loader.getImage(opts.name);
        this.speed = 2;
        var playerWidth = 64;
        var playerHeight = 110;
        this.metadata = {
          name:  opts.name,
          image: "<div style='background: url("+image.src+") -5px  -790px no-repeat; width: 64px; height: 110px;' class='img'></div>"
        };
        this.messageBubble = null; // Display the messages.
        this.messageTimeout = null;
        this.informationBox = null; // Display the information box.
        this._super(me.Entity, "init", [coordinates.x, coordinates.y, {
          width: playerWidth,
          height: playerHeight
        }]);
        this.body.gravity = 0;
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);
        var texture =  new me.video.renderer.Texture(
            { framewidth: playerWidth, frameheight: playerHeight },
            image
        );
        this.shapeDef = me.loader.getJSON("player_shape");
        var collisionShape = CollisionHelper.getShape("player_collision");
        this.body.removeShapeAt(0);
        this.body.addShape(collisionShape);
        this.body.pos.x = -(collisionShape.width / 2);
        this.body.pos.y = -(collisionShape.height / 2) - (this.refLayer.tileheight / 2);
        this.currentTile = { // Movement.
          row: row,
          col: col
        };
        this.renderable = texture.createAnimationFromName([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38 ,39 ]);
        this.renderable.addAnimation("standing_down", [0]);
        this.renderable.addAnimation("down", [1, 2, 3, 4]);
        this.renderable.addAnimation("standing_downleft", [5]);
        this.renderable.addAnimation("downleft", [6, 7, 8, 9]);
        this.renderable.addAnimation("standing_left", [10]);
        this.renderable.addAnimation("left", [11, 12, 13, 14]);
        this.renderable.addAnimation("standing_topleft", [15]);
        this.renderable.addAnimation("topleft", [16, 17, 18, 19]);
        this.renderable.addAnimation("standing_top", [20]);
        this.renderable.addAnimation("top", [21, 22, 23, 24]);
        this.renderable.addAnimation("standing_topright", [25]);
        this.renderable.addAnimation("topright", [26, 27, 28, 29]);
        this.renderable.addAnimation("standing_right", [30]);
        this.renderable.addAnimation("right", [31, 32, 33, 34]);
        this.renderable.addAnimation("standing_downright", [35]);
        this.renderable.addAnimation("downright", [36, 37, 38, 39]);
        this.renderable.setCurrentAnimation("standing_down");
        this.currentMvt = 0;
        this.movements = [];
        var self = this;
        me.event.subscribe('pointerdown', this.pointerDown.bind(this));
        me.event.subscribe(me.event.VIEWPORT_ONCHANGE, function() {
          self.updateMessagePosition.bind(self);
          self.updatePlayerInformationPosition.bind(self);
        });
        this.onMessageArrivedB = this.onMessageArrived.bind(this);
        this.displayPseudoB = this.displayPseudo.bind(this);
        this.hidePseudoB = this.hidePseudo.bind(this);
        game.Stores.GameStore.listenMessageArrived(this.onMessageArrivedB);
        game.Stores.GameStore.listenDisplayPlayerPseudoArrived(this.displayPseudoB);
        game.Stores.GameStore.listenHidePlayerPseudoArrived(this.hidePseudoB);
    },
    displayPseudo: function() { // Display the pseudo.
      $('html,body').css( 'cursor', 'pointer' );
      if (this.informationBox && this.informationBox !== null) {
         return;
      }

      this.informationBox = $("<div class='player-information-box-container'><div class='player-information-box'>"+this.metadata.name+"</div></div>");
      $(document.body).append(this.informationBox);
      this.updatePlayerInformationPosition();
    },
    hidePseudo: function() { // Hide the pseudo.
      $('html,body').css( 'cursor', 'default');
      if (!this.informationBox || this.informationBox === null) { return; }
      $(this.informationBox).remove();
      this.informationBox = null;
    },
    updateSprite: function(opts) { // Update the sprite.
      var image = me.loader.getImage(opts.name);
      var playerWidth = 64;
      var playerHeight = 110;
      var texture =  new me.video.renderer.Texture(
            { framewidth: playerWidth, frameheight: playerHeight },
            image
        );
      this.renderable = texture.createAnimationFromName([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38 ,39 ]);
      this.renderable.addAnimation("standing_down", [0]);
      this.renderable.addAnimation("down", [1, 2, 3, 4]);
      this.renderable.addAnimation("standing_downleft", [5]);
      this.renderable.addAnimation("downleft", [6, 7, 8, 9]);
      this.renderable.addAnimation("standing_left", [10]);
      this.renderable.addAnimation("left", [11, 12, 13, 14]);
      this.renderable.addAnimation("standing_topleft", [15]);
      this.renderable.addAnimation("topleft", [16, 17, 18, 19]);
      this.renderable.addAnimation("standing_top", [20]);
      this.renderable.addAnimation("top", [21, 22, 23, 24]);
      this.renderable.addAnimation("standing_topright", [25]);
      this.renderable.addAnimation("topright", [26, 27, 28, 29]);
      this.renderable.addAnimation("standing_right", [30]);
      this.renderable.addAnimation("right", [31, 32, 33, 34]);
      this.renderable.addAnimation("standing_downright", [35]);
      this.renderable.addAnimation("downright", [36, 37, 38, 39]);
      this.renderable.setCurrentAnimation("standing_down");
    },
    pointerDown: function(evt) { // Calculate the movements OR display the player informations.
      if (evt.which !== 1) { return; }
      // if (evt.handled) { return; }
      if (this.informationBox && this.informationBox !== null) {
        game.Stores.GameStore.displayInformation(this.metadata);
        return;
      }

      if (this.movements.length > 0 && this.currentMvt < this.movements.length) { return; }
  		var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
      if (!tile) { return; }
      var self = this;
      var finder = new PF.AStarFinder({
        allowDiagonal: true
      });
      var currentTile = CoordinateCalculator.getRelativePlayerPosition(this.currentTile);
      tile = CoordinateCalculator.getRelativePlayerPosition(tile);
      var collisionLayer = game.Stores.GameStore.getCollisionLayer();
      var path = finder.findPath(currentTile.row, currentTile.col, tile.row, tile.col, collisionLayer.clone());
      var mvts = [];
      for (var i = 1; i <= path.length; i++) {
        if (i > 1) {
          var prevPos = path[i - 2];
          var nextPos = path[i - 1];
          if (nextPos[0] > prevPos[0] && nextPos[1] > prevPos[1]) {
            mvts.push("down");
          } else if (nextPos[0] > prevPos[0] && nextPos[1] < prevPos[1]) {
            mvts.push("left");
          } else if(nextPos[0] > prevPos[0] && nextPos[1] === prevPos[1]) {
            mvts.push("downleft");
          } else if(nextPos[0] === prevPos[0] && nextPos[1] < prevPos[1]) {
            mvts.push("topleft");
          } else if(nextPos[0] < prevPos[0] && nextPos[1] < prevPos[1]) {
            mvts.push("top");
          } else if(nextPos[0] < prevPos[0] && nextPos[1] > prevPos[1]) {
            mvts.push("right");
          } else if(nextPos[0] === prevPos[0] && nextPos[1] > prevPos[1]) {
            mvts.push("downright");
          } else if (nextPos[0] < prevPos[0] && nextPos[1] === prevPos[1]) {
            mvts.push("topright");
          }
        }
      }

      this.movements = mvts;
      this.currentMvt = 0;
    },
    onMessageArrived: function(e, msg) { // This method is called when a message arrived.
      if (this.messageBubble) { // Remove the message bubble.
        $(this.messageBubble).remove();
        clearTimeout(this.messageTimeout);
      }

      var self = this;
      this.messageBubble = $("<div class='chat-bubble '><b>"+this.metadata.name+" : </b>"+msg+"</div>");
      $(document.body).append(this.messageBubble);
      this.updateMessagePosition();
      this.messageTimeout = setTimeout(function() {
        $(self.messageBubble).remove();
        clearTimeout(self.messageTimeout);
      }, 5000);
    },
    updatePlayerInformationPosition: function() { // Update the player information position.
      if (!this.informationBox || this.informationBox === null) { return; }
      var coordinates = me.game.viewport.worldToLocal(
                        this.pos.x,
                        this.pos.y
                    );
      var gamePosition = $("#screen").position();
      $(this.informationBox).css('left', coordinates.x + gamePosition.left - $(this.informationBox).outerWidth() / 2);
      $(this.informationBox).css('top', coordinates.y + gamePosition.top - $(this.informationBox).outerHeight() - this.height);
    },
    updateMessagePosition: function() { // Update the message position.
      if (!this.messageBubble || this.messageBubble === null) { return; }
      var coordinates = me.game.viewport.worldToLocal(
                        this.pos.x,
                        this.pos.y
                    );
      var gamePosition = $("#screen").position();
      $(this.messageBubble).css('left', coordinates.x + gamePosition.left - $(this.messageBubble).outerWidth() / 2);
      $(this.messageBubble).css('top', coordinates.y + gamePosition.top - $(this.messageBubble).outerHeight() - this.height);
    },
    update: function(dt) {
      if (this.currentMvt >= this.movements.length) { return false; }
      var mvt = this.movements[this.currentMvt];
      var posY = this.pos.y;
      var posX = this.pos.x;
      if (mvt === 'down') {
        posY += this.speed;
      } else if (mvt === 'top') {
        posY -= this.speed;
      }
      else if (mvt === 'left') {
        posX -= this.speed;
      }
      else if (mvt === 'right') {
        posX += this.speed;
      }
      else if (mvt === 'downleft') {
        posX -= this.speed;
        posY += this.speed / 2;

      }
      else if (mvt === 'downright') {
        posX += this.speed;
        posY += this.speed / 2;
      }
      else if (mvt === 'topright') {
        posX += this.speed;
        posY -= this.speed / 2;
      } else if (mvt === 'topleft') {
        posX -= this.speed;
        posY -= this.speed / 2;
      }

      if (!this.renderable.isCurrentAnimation(mvt)) {
        this.renderable.setCurrentAnimation(mvt);
      }

      var tile = this.refLayer.getTile(posX, posY);
      if (mvt === 'top') {
        tile = this.refLayer.getTile(posX, posY + this.refLayer.tileheight);
      } else if (mvt === 'topright') {
        tile = this.refLayer.getTile(posX - this.refLayer.tilewidth / 2, posY + this.refLayer.tileheight / 2);
      } else if (mvt === 'topleft') {
        tile = this.refLayer.getTile(posX + this.refLayer.tilewidth / 2, posY + this.refLayer.tileheight / 2);
      } else if (mvt === 'downleft') {
        // tile = this.refLayer.getTile(posX + this.diamondShape.getBounds().width / 2, posY - this.diamondShape.getBounds().height / 2);
      }

      if (!tile) {
        this.currentMvt = this.movements.length;
        this.renderable.setCurrentAnimation("standing_" + mvt);
        return;
      }

      if ((mvt === 'down' && tile.row === this.currentTile.row + 1 && tile.col === this.currentTile.col + 1) ||
        (mvt === 'left' && tile.row === this.currentTile.row + 1 && tile.col === this.currentTile.col - 1) ||
        (mvt === 'right' && tile.row === this.currentTile.row - 1 && tile.col === this.currentTile.col + 1) ||
        (mvt === 'top' && tile.row === this.currentTile.row - 1 && tile.col === this.currentTile.col - 1) ||
        (mvt === 'downleft' && tile.row === this.currentTile.row + 1 && tile.col === this.currentTile.col) ||
        (mvt === 'downright' && tile.row === this.currentTile.row && tile.col === this.currentTile.col + 1) ||
        (mvt === 'topright' && tile.row === this.currentTile.row - 1 && tile.col === this.currentTile.col) ||
        (mvt === 'topleft' && tile.row === this.currentTile.row && tile.col === this.currentTile.col - 1)) {
        this.currentTile = {
          row: tile.row,
          col: tile.col
        };
        this.currentMvt++;
        var coordinates = this.refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
        posX = coordinates.x;
        posY = coordinates.y;
        if (this.currentMvt >= this.movements.length) {
          this.renderable.setCurrentAnimation("standing_" + mvt);
        }
      }

      this.pos.x = posX;
      this.pos.y = posY;
      this.pos.z = Constants.playerZIndex;
      this.updateMessagePosition();
      this.updatePlayerInformationPosition();
      this._super(me.Entity, "update", [dt]);
      me.game.world.sort();
      return true;
    },
    destroy: function() {
      if (this.informationBox) $(this.informationBox).remove();
      game.Stores.GameStore.unsubscribeMessageArrived(this.onMessageArrivedB);
      game.Stores.GameStore.unsubscribeDisplayPlayerPseudoArrived(this.displayPseudoB);
      game.Stores.GameStore.unsubscribeHidePlayerPseudoArrived(this.hidePseudoB);
    }
});
