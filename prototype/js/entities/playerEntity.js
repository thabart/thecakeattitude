game.PlayerEntity = me.Renderable.extend({
    init: function(col, row) {
        this.refLayer = me.game.world.getChildByName(Constants.Layers.Ground.Name)[0];
        var coordinates = this.refLayer.getRenderer().tileToPixelCoords(col, row);
        this.playerWidth = 41;
        this.playerHeight = 83;
        this.speed = 2;
        /*
        this._super(me.Entity, "init", [coordinates.x, coordinates.y, {
          width: this.playerWidth,
          height: this.playerHeight
        }]);
        */
        this._super(me.Renderable, 'init', [ coordinates.x, coordinates.y,
          this.refLayer.tilewidth / 2,
          this.refLayer.tileheight
        ]);
        this.diamondShape = this.clone().toPolygon().toIso();
        this.floating = true;
        this.dirty = true;
        /*
        this.body.gravity = 0;
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.4,0.4);
        */
        var texture =  new me.video.renderer.Texture(
            { framewidth: this.playerWidth, frameheight: this.playerHeight },
            me.loader.getImage("player")
        );
        // this.body.pos.x = -this.playerWidth / 2;
        // this.body.pos.y = -this.playerHeight;
        this.currentTile = { // Movement.
          row: row,
          col: col
        };
        /*
        this.renderable = texture.createAnimationFromName([0]);
        this.renderable.addAnimation("stay", [0]);
        this.renderable.setCurrentAnimation("stay");
        this.currentTile = { // Movement.
          row: row,
          col: col
        };
        */
        this.currentMvt = 0;
        this.movements = [];
        me.event.subscribe('pointerdown', this.pointerDown.bind(this));
    },
    pointerDown: function(evt) { // Calculate the movements.
      if (evt.which !== 1) { return; }
      if (this.movements.length > 0 && this.currentMvt < this.movements.length) { return; }
  		var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
      if (!tile) { return; }
      var self = this;
      var finder = new PF.AStarFinder({
        allowDiagonal: true
      });
      var currentTile = CoordinateCalculator.getRelativePlayerPosition(this.currentTile);
      tile = CoordinateCalculator.getRelativePlayerPosition(tile);
      var path = finder.findPath(currentTile.row, currentTile.col, tile.row, tile.col, game.collisionLayer.clone());
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
      var posY = this.diamondShape.pos.y;
      var posX = this.diamondShape.pos.x;
      if (mvt === 'down') {
        posY += this.speed;
        // this.body.vel.y += this.body.accel.y * me.timer.tick;
      } else if (mvt === 'top') {
        posY -= this.speed;
      }
      else if (mvt === 'left') {
        posX -= this.speed;
        // this.body.vel.x -= this.body.accel.x * me.timer.tick;
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

      var tile = this.refLayer.getTile(posX, posY);
      if (mvt === 'top') {
        tile = this.refLayer.getTile(posX, posY + this.diamondShape.getBounds().height);
      } else if (mvt === 'topright') {
        tile = this.refLayer.getTile(posX - this.diamondShape.getBounds().width / 2, posY + this.diamondShape.getBounds().height / 2);
      } else if (mvt === 'topleft') {
        tile = this.refLayer.getTile(posX + this.diamondShape.getBounds().width / 2, posY + this.diamondShape.getBounds().height / 2);
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
      }

      this.diamondShape.pos.x = posX;
      this.diamondShape.pos.y = posY;
      /*
      me.game.viewport.worldToLocal(
        this.diamondShape.pos.x,
        this.diamondShape.pos.y,
        this.diamondShape.pos
      );
      */
      return true;
      /*
      if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
          this._super(me.Entity, "update", [dt]);
          var tile = this.refLayer.getTile(this.pos.x, this.pos.y);
          if (tile && tile.col && tile.row) {
            if (mvt === 'down' && tile.row === this.currentTile.row + 1 && tile.col === this.currentTile.col + 1) {
              this.currentTile = {
                row: tile.row,
                col: tile.col
              };
              this.currentMvt++;
            }
            else if (mvt === 'left' && tile.row === this.currentTile.row && tile.col === this.currentTile.col - 1) {
              this.currentTile = {
                row: tile.row,
                col: tile.col
              };
              this.currentMvt++;
            }
          }

          return true;
      }*/
    },
    draw: function(renderer) {
                    renderer.save();
                    renderer.setColor("#FF0000");
                    renderer.drawShape(this.diamondShape);

                    renderer.setColor("#FFFFFF");
                    renderer.restore();

    }
});
