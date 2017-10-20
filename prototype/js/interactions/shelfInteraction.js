game.ShelfInteraction = me.Object.extend({
  init: function() {
    this.key = Constants.Interactions.Shelf;
  },
  execute: function() {
    ShopStore.displayShelfBox();
  }
});
