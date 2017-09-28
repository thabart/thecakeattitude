game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function() {
      this.state = {
        dragInitStartingX : 0, // Drag.
        dragInitStartingY : 0,
        dragging: false,
        scale: 0.04,
        nbMaxZoom: 5, // Zoom
        currentZoom: 0,
        initBounds: null,
        initViewPortSize: null,
        newBounds: null,
        isInEditMode: false // Add block.
      };

      me.levelDirector.loadLevel("map");
      this._buildingLayer = me.game.world.getChildByName('Building');
      var zoomOutBtn = new Button(10, 10, "Zoom out", this.onZoomOut.bind(this));
      var zoomIntBtn = new Button(200, 10, "Zoom in", this.onZoomIn.bind(this));
      var addBlockBtn = new Button(390, 10, "Edit", this.editMode.bind(this));
      me.game.world.addChild(zoomOutBtn); // Add buttons.
      me.game.world.addChild(zoomIntBtn);
      me.game.world.addChild(addBlockBtn);
      this.handlePointerDown = me.input.registerPointerEvent('pointerdown', me.game.viewport, this.onMouseDown.bind(this)); // Drag through the map.
      this.handlePointerMove = me.input.registerPointerEvent('pointermove', me.game.viewport, this.onMouseMove.bind(this));
      this.handlePointerUp = me.input.registerPointerEvent('pointerup', me.game.viewport, this.onMouseUp.bind(this));
  		var currentLevel = me.levelDirector.getCurrentLevel(); // Center the camera.
  		me.game.viewport.move(currentLevel.width / 2, 0);
  		me.game.viewport.move(0, currentLevel.height / 2);
      this.state.initBounds = Object.assign({}, { w: me.game.viewport.bounds.width, h: me.game.viewport.bounds.height });
      this.state.newBounds =  Object.assign({}, { w: me.game.viewport.bounds.width, h: me.game.viewport.bounds.height });
      this.state.initViewPortSize = Object.assign({}, { w: me.game.viewport.width, h: me.game.viewport.height });
      me.game.repaint();
    },

    editMode: function() {
      this.state.isInEditMode = true;
    },

    onMouseDown: function(e) {
      this.state.dragging = true;
      this.state.dragInitStartingX = e.gameScreenX;
      this.state.dragInitStartingY = e.gameScreenY;
      if (this.state.isInEditMode) {
        var MySprite = new me.Sprite(e.gameWorldX, e.gameWorldY, {
            image : "obj"
        });
        me.game.world.addChild(MySprite, 2);
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
      var multi = this.state.currentZoom < 0 ? -this.state.currentZoom : this.state.currentZoom;
      viewport.currentTransform.scale(1 - this.state.scale);
      if (this.state.currentZoom <= 0) {
        if (this.state.initBounds.w !== this.state.newBounds.w && this.state.initBounds.h !== this.state.newBounds.h) {
          viewport.setBounds(0, 0, (this.state.initViewPortSize.w * this.state.scale) * multi + this.state.initBounds.w, (this.state.initViewPortSize.h * this.state.scale) * multi + this.state.initBounds.h);
          this.state.newBounds.w = (this.state.initViewPortSize.w * this.state.scale) * multi + this.state.initBounds.w;
          this.state.newBounds.h =  (this.state.initViewPortSize.h * this.state.scale) * multi + this.state.initBounds.h;
        }
      } else {
        var newPos = Object.assign({}, { x: viewport.pos.x, y: viewport.pos.y });
        viewport.resize((this.state.initViewPortSize.w * this.state.scale) * multi + this.state.initViewPortSize.w, (this.state.initViewPortSize.h * this.state.scale) * multi  + this.state.initViewPortSize.h);
        viewport.move(newPos.x, newPos.y);
      }
    },

    onZoomIn() {
      if (this.state.currentZoom <= -this.state.nbMaxZoom) {
        return;
      }

      this.state.currentZoom--;
      var viewport = me.game.viewport;
      var multi = this.state.currentZoom < 0 ? -this.state.currentZoom : this.state.currentZoom;
      viewport.currentTransform.scale(1 + this.state.scale);
      if (this.state.currentZoom >= 0) {
        var newPos = Object.assign({}, { x: viewport.pos.x, y: viewport.pos.y });
        if (viewport.width !== this.state.initViewPortSize.w && viewport.height !== this.state.initViewPortSize.h) {
          viewport.resize((this.state.initViewPortSize.w * this.state.scale) * multi + this.state.initViewPortSize.w, (this.state.initViewPortSize.h * this.state.scale) * multi  + this.state.initViewPortSize.h);
          viewport.move(newPos.x, newPos.y);
        }
      } else {
        viewport.setBounds(0, 0, (this.state.initViewPortSize.w * this.state.scale) * multi + this.state.initBounds.w, (this.state.initViewPortSize.h * this.state.scale) * multi + this.state.initBounds.h);
        this.state.newBounds.w = (this.state.initViewPortSize.w * this.state.scale) * multi + this.state.initBounds.w;
        this.state.newBounds.h =  (this.state.initViewPortSize.h * this.state.scale) * multi + this.state.initBounds.h;
      }
    },

    onDestroyEvent: function() {
        me.event.unsubscribe(this.handlePointerDown);
        me.event.unsubscribe(this.handlePointerMove);
        me.event.unsubscribe(this.handlePointerUp);
    }
});
