game.InteractionLauncher = me.Object.extend({
  init: function() {
    var shelfInteraction = new game.ShelfInteraction();
    this.interactions = [
      shelfInteraction
    ];
  },
  launch: function(key) {
    var interaction = this.interactions.filter(function(interaction) { return interaction.key === key})[0];
    if (!interaction) { return; }
    interaction.execute();
  }
});
