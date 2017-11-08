game.ShelfInteraction = me.Object.extend({
  init: function() {
    this.key = "shelf";
  },
  execute: function(settings) {
    game.Stores.GameStore.displayShelfBox(settings);
  }
});
