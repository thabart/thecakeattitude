game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y , settings]);
        this.refLayer = me.game.world.getChildByName("Ground")[0];
        this.body.gravity = 0;
        this.iteration = 0;
        this.maxiteration = 50;
        var texture =  new me.video.renderer.Texture(
            { framewidth: settings.width, frameheight: settings.height },
            me.loader.getImage("player")
        );

        this.renderable = texture.createAnimationFromName([0]);
        this.renderable.addAnimation("stay", [0]);
        this.renderable.setCurrentAnimation("stay");
        this.path = null;
        this.currentPathIndex = 0;
        this.currentTile = {
          row: 6,
          col: 6
        };
        me.event.subscribe('pointerdown', this.pointerDown.bind(this));
    },
    pointerDown: function(evt) {
  		var tile = this.refLayer.getTile(evt.gameWorldX, evt.gameWorldY);
      if (!tile) { return; }
      var finder = new PF.AStarFinder({
        allowDiagonal: true
      });
      this.path = finder.findPath(this.currentTile.row, this.currentTile.col, tile.row, tile.col, game.collisionLayer.clone());
    },
    update: function() {
      if (!this.path || this.path.length < this.currentPathIndex + 1) {
        this.path = null;
        this.currentPathIndex = 0;
        return;
      }

      this.iteration++;
      if (this.iteration < this.maxiteration) { return; }
      var currentCell = this.path[this.currentPathIndex];
      this.currentPathIndex++;
      this.currentTile = {
        row: currentCell[0],
        col: currentCell[1]
      };
      var coordinates = this.refLayer.getRenderer().tileToPixelCoords(currentCell[1], currentCell[0]);
      this.pos.x = coordinates.x - (this.width / 2);
      this.pos.y = coordinates.y - (this.height);
      this.iteration = 0;
      me.game.repaint();
    }
});
