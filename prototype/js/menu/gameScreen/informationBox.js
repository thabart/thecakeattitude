game.Menu = game.Menu || {};
game.Menu.InformationBox = me.Object.extend({
  init: function() {
    var self = this;
    this.information = $("<div class='information-box'>"+
      "<div class='top'><span class='title'></span><div class='black-close'></div></div>"+
      "<div class='body'></div>"+
      "<div class='bottom'></div>"+
    "</div>");
    $("#bottom-right-container").append(this.information);
    $(this.information).find('.black-close').click(function() {
      $(self.information).hide();
      game.Stores.GameStore.hideActions();
      game.Stores.GameStore.setSelectedEntity(null);
    });
    $(this.information).hide();
    game.Stores.GameStore.listenDisplayInformationArrived(this.update.bind(this)); // Display information box.
    game.Stores.GameStore.listenHideInformationArrived(this.hide.bind(this));
  },
  update: function(e, metadata) {
    $(this.information).find('.body').empty();
    $(this.information).find('.top .title').html(metadata.name);
    $(this.information).find('.body').append("<img src='"+metadata.image+"' />'");
    $(this.information).show();
  },
  hide: function() {
    $(this.information).hide();
  },
  destroy: function() {
    if (this.information) $(this.information).remove();
    if (this.update) game.Stores.GameStore.unsubscribeDisplayInformationArrived(this.update.bind(this)); // Display information box.
    if (this.hide) game.Stores.GameStore.unsubscribeHideInformationArrived(this.hide.bind(this));    
  }
});
