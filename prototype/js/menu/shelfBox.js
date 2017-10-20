game.ShelfBox = me.Object.extend({
  init: function() {
    this.shelf = $("<div class='blue-modal shelf-box'>"+
      "<div class='top'><span data-i18n='shelf'></span> <div class='close'></div></div>"+
      "<div class='body'>"+
        "<ul class='tabs'>"+
          "<li data-i18n='description'></li>"+
          "<li data-i18n='products'></li>"+
        "</ul>"+
        "<div class='content'>"+
          "<div class='col-3'>"+
          "</div>"+
          "<div class='col-8'>"+
          "</div>"+
        "</div>"+
      "</div>"+
      "<div class='bottom'></div>"+
    "</div>");
    $(document.body).append(this.shelf);
    $(this.shelf).hide();
    $(this.shelf).draggable({ "handle": ".top" });
    $(this.shelf).i18n();
    this.addListeners();
    ShopStore.listenDisplayShelfBoxArrived(this.display.bind(this));
    ShopStore.listenHideShelfBoxArrived(this.hide.bind(this));
  },
  addListeners: function() {
    var self = this;
    $(this.shelf).find('.close').click(function() {
      self.hide();
    });
  },
  display: function() {
    $(this.shelf).show();
  },
  hide: function() {
    $(this.shelf).hide();
  }
});
