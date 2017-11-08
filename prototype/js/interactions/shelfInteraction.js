game.ShelfInteraction = me.Object.extend({
  init: function() {
    this.key = "shelf";
  },
  execute: function() {
    game.Stores.GameStore.displayShelfBox();
  }
});
