game.Entities = game.Entities || {};
game.Entities.CurrentPlayerEntity = game.Entities.PlayerEntity.extend({
  init: function(col, row, opts) {
    opts.isMoveable = true;
    this._super(game.Entities.PlayerEntity, "init", [ col, row, opts ]);
    this.onMessageArrivedB = this.onMessageArrived.bind(this);
    this.displayPseudoB = this.displayPseudo.bind(this);
    this.hidePseudoB = this.hidePseudo.bind(this);
    game.Stores.GameStore.listenMessageArrived(this.onMessageArrivedB);
    game.Stores.GameStore.listenDisplayPlayerPseudoArrived(this.displayPseudoB);
    game.Stores.GameStore.listenHidePlayerPseudoArrived(this.hidePseudoB);
  },
  onMessageArrived: function(e, msg) {
    this.displayMessage(msg);
  },
  destroyCb: function() {
    game.Stores.GameStore.unsubscribeMessageArrived(this.onMessageArrivedB);
    game.Stores.GameStore.unsubscribeDisplayPlayerPseudoArrived(this.displayPseudoB);
    game.Stores.GameStore.unsubscribeHidePlayerPseudoArrived(this.hidePseudoB);
  }
});
