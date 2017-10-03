game.MovableContainer = me.Container.extend({
	init: function() {
		this._super(me.Container, "init");
		this.isDragging = false;
		this.dragInitStartingX = 0;
		this.dragInitStartingY = 0;
      	this.handlePointerDown = me.input.registerPointerEvent('pointerdown', me.game.viewport, this.onMouseDown.bind(this)); // Drag through the map.
      	this.handlePointerMove = me.input.registerPointerEvent('pointermove', me.game.viewport, this.onMouseMove.bind(this));
      	this.handlePointerUp = me.input.registerPointerEvent('pointerup', me.game.viewport, this.onMouseUp.bind(this));
	},
	onMouseDown: function(e) {
		if (e.which !== 3) { return; }
		e.preventDefault();
		this.isDragging = true;
      	this.dragInitStartingX = e.gameScreenX;
     	this.dragInitStartingY = e.gameScreenY;
	},
	onMouseMove: function(e) {
      if (!this.isDragging) {
        return;
      }

      var diffX = e.gameScreenX - this.dragInitStartingX;
      var diffY = e.gameScreenY - this.dragInitStartingY;      
      me.game.viewport.move(-diffX, -diffY);
      me.game.repaint();
      this.dragInitStartingX = e.gameScreenX;
      this.dragInitStartingY = e.gameScreenY;
	},
	onMouseUp: function() {
		this.isDragging = false;
	}
});