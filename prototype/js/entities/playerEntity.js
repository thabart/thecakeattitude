game.PlayerEntity = me.Entity.extend({
    init: function(col, row) {
        this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
        var coordinates = this.refLayer.getRenderer().tileToPixelCoords(col, row);
        var image = me.loader.getImage("player");
        this.speed = 2;
        var playerWidth = 41;
        var playerHeight = 83;
        this._super(me.Entity, "init", [coordinates.x, coordinates.y, {
          width: playerWidth,
          height: playerHeight
        }]);
        this.body.gravity = 0;
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);
        var texture =  new me.video.renderer.Texture(
            { framewidth: playerWidth, frameheight: playerHeight },
            image
        );
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
          20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);
        this.renderable.addAnimation("standing_down", [0]);
        this.renderable.addAnimation("down", [0, 1, 2, 3]);
        this.renderable.addAnimation("standing_downleft", [4]);
        this.renderable.addAnimation("downleft", [4, 5, 6, 7]);
        this.renderable.addAnimation("standing_left", [11]);
        this.renderable.addAnimation("left", [11, 10, 9, 8]);
        this.renderable.addAnimation("standing_topleft", [15]);
        this.renderable.addAnimation("topleft", [15, 14, 13, 12]);
        this.renderable.addAnimation("standing_top", [16]);
        this.renderable.addAnimation("top", [16, 17, 18, 19]);
        this.renderable.addAnimation("standing_downright", [23]);
        this.renderable.addAnimation("downright", [23, 22, 21, 20]);
        this.renderable.addAnimation("standing_right", [24]);
        this.renderable.addAnimation("right", [24, 25, 26, 27]);
        this.renderable.addAnimation("standing_topright", [28]);
        this.renderable.addAnimation("topright", [28, 29, 30, 31]);
        this.renderable.setCurrentAnimation("standing_down");
        this.currentMvt = 0;
        this.movements = [];
        me.event.subscribe('pointerdown', this.pointerDown.bind(this));
    },
    pointerDown: function(evt) { // Calculate the movements.
      if (evt.which !== 1) { return; }
      if (evt.handled) { return; }
      if (this.movements.length > 0 && this.currentMvt < this.movements.length) { return; }
  		var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
      if (!tile) { return; }
      var self = this;
      var finder = new PF.AStarFinder({
        allowDiagonal: true
      });
      var currentTile = CoordinateCalculator.getRelativePlayerPosition(this.currentTile);
      tile = CoordinateCalculator.getRelativePlayerPosition(tile);
      var collisionLayer = ShopStore.getCollisionLayer();
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
        tile = {};
        if (this.currentTile.col === Constants.Layers.Ground.Position.col) {
          tile.col = Constants.Layers.Ground.Position.col;
        }

        if (this.currentTile.row === Constants.Layers.Ground.Position.row) {
          tile.row = Constants.Layers.Ground.Position.row;
        }
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
      this.pos.z = 5;
      this._super(me.Entity, "update", [dt]);
      me.game.world.sort();
      return true;
    }
});
