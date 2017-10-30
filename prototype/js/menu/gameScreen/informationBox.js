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
      ShopStore.hideActions();
      ShopStore.setSelectedEntity(null);
    });
    $(this.information).hide();
    ShopStore.listenDisplayInformationArrived(this.update.bind(this)); // Display information box.
    ShopStore.listenHideInformationArrived(this.hide.bind(this));
  },
  update: function(e, metadata) {
    $(this.information).find('.body').empty();
    $(this.information).find('.top .title').html(metadata.name);
    $(this.information).find('.body').append("<img src='"+metadata.image+"' />'");
    $(this.information).show();
  },
  hide: function() {
    $(this.information).hide();
  }
});
