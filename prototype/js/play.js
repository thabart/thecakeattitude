game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function() {
      this.state = {
        dragInitStartingX : 0, // Drag.
        dragInitStartingY : 0,
        dragging: false,
        scale: 0.04,
        nbMaxZoom: 5, // Zoom
        currentZoom: 0,
        isInEditMode: false, // Add block.
        blocks: []
      };

      me.levelDirector.loadLevel("map");
      this._buildingLayer = me.game.world.getChildByName('Building');
      var zoomOutBtn = new Button(10, 10, "Zoom out", this.onZoomOut.bind(this));
      var zoomIntBtn = new Button(200, 10, "Zoom in", this.onZoomIn.bind(this));
      var addBlockBtn = new CheckBox(390, 10, "Edit mode enabled", "Edit mode disabled", this.editMode.bind(this));
      me.game.world.addChild(zoomOutBtn); // Add buttons.
      me.game.world.addChild(zoomIntBtn);
      me.game.world.addChild(addBlockBtn);
      this._tileSelector = me.game.world.addChild(new TileSelector());
      this.handlePointerDown = me.input.registerPointerEvent('pointerdown', me.game.viewport, this.onMouseDown.bind(this)); // Drag through the map.
      this.handlePointerMove = me.input.registerPointerEvent('pointermove', me.game.viewport, this.onMouseMove.bind(this));
      this.handlePointerUp = me.input.registerPointerEvent('pointerup', me.game.viewport, this.onMouseUp.bind(this));
      me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
        me.event.publish("pointermove", [ event ]);
      }, false);
  		var currentLevel = me.levelDirector.getCurrentLevel(); // Center the camera.
  		me.game.viewport.move(currentLevel.width / 2, 0);
  		me.game.viewport.move(0, currentLevel.height / 2);
      me.game.repaint();
    },

    editMode: function(isInEditMode) {
      this.state.isInEditMode = isInEditMode;
    },

    onMouseDown: function(e) {
      this.state.dragging = true;
      this.state.dragInitStartingX = e.gameScreenX;
      this.state.dragInitStartingY = e.gameScreenY;
      if (this.state.isInEditMode) {
        var refLayer = me.game.world.getChildByName("Ground")[0];
        var tile = refLayer.getTile(e.gameWorldX, e.gameWorldY);
        if (tile) {
            var position = refLayer.getRenderer().tileToPixelCoords(tile.col, tile.row);
            var buildingBlockWidth = me.loader.getImage('buildingBlock').width;
            var MySprite = new BuildingBlock(position.x, position.y);
            var alreadyExists = false;
            this.state.blocks.forEach(function(block) {
              if (MySprite.overlaps(block)) {
                alreadyExists = true;
                return;
              }
            });

            if (alreadyExists) {
              return;
            }

            me.game.world.addChild(MySprite, 2);
            this.state.blocks.push(MySprite);
        }
      }
    },

    onMouseMove: function(e) {
      if (!this.state.dragging) {
        return;
      }

      var diffX = e.gameScreenX - this.state.dragInitStartingX;
      var diffY = e.gameScreenY - this.state.dragInitStartingY;
      me.game.viewport.move(-diffX, -diffY);
      me.game.repaint();
      this.state.dragInitStartingX = e.gameScreenX;
      this.state.dragInitStartingY = e.gameScreenY;
    },

    onMouseUp: function() {
      this.state.dragging = false;
    },

    onZoomOut: function() {
      if (this.state.currentZoom >= this.state.nbMaxZoom) {
        return;
      }

      this.state.currentZoom++;
      var viewport = me.game.viewport;
      var prevWidth = viewport.width;
      var prevHeight = viewport.height;
      viewport.currentTransform.val = [
        1 - (this.state.scale * this.state.currentZoom),
        0,
        0,
        0,
        1 - (this.state.scale * this.state.currentZoom),
        0,
        0,
        0,
        1
      ];

      var scale = this.state.scale;
      var newWidth = prevWidth + prevWidth * scale;
      var newHeight = prevHeight + prevHeight * scale;
      viewport.resize(newWidth, newHeight);
    },

    onZoomIn() {
      if (this.state.currentZoom <= 0) {
        return;
      }

      this.state.currentZoom--;
      var viewport = me.game.viewport;
      var prevWidth = viewport.width;
      var prevHeight = viewport.height;
      if (this.state.currentZoom === 0) {
        viewport.currentTransform.val = [
          1,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          1
        ];
      } else {
        viewport.currentTransform.val = [
          1 - (this.state.scale * this.state.currentZoom),
          0,
          0,
          0,
          1 - (this.state.scale * this.state.currentZoom),
          0,
          0,
          0,
          1
        ];
      }

      var scale = this.state.scale;
      var newWidth = prevWidth / ( 1 + scale );
      var newHeight = prevHeight / ( 1 + scale );
      if (this.state.currentZoom === 0) {
        newWidth = Math.round(newWidth);
        newHeight = Math.round(newHeight);
      }

      viewport.resize(newWidth, newHeight);
      console.log(newWidth);
    },

    onDestroyEvent: function() {
        me.event.unsubscribe(this.handlePointerDown);
        me.event.unsubscribe(this.handlePointerMove);
        me.event.unsubscribe(this.handlePointerUp);
    }
});
