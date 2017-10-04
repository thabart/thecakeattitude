game.FurnitureContainer = me.Container.extend({
  init: function() {
		this._super(me.Container, "init", [0, 0, me.game.world.width, me.game.world.height]);
  }
});
