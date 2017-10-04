game.GameMenu = me.Object.extend({
  init: function() {
    var menu = $("<ul class='no-style'>"+
      "<li class='inventory'></li>"+
    "</ul>");
    $("#footer").append(menu);
    this.inventory = null;
    var self = this;
    $(menu).find('.inventory').click(function() {
      self.displayInventoryBox();
    });
    ShopStore.listenSelectedFurnitureChanged(this.updateFurniture.bind(this));
  },
  displayInventoryBox: function() {
    if (this.inventory) { return; }
    var inventory = $("<div class='inventory-box'>"+
      "<div class='top'>"+
        "Inventory"+
      "</div>"+
      "<div class='body'>"+
        "<ul class='tabs'>"+
          "<li class='active'>Mobilier</li>"+
          "<li>Personnages</li>"+
        "</ul>"+
        "<div>"+
          "<ul class='items no-style'>"+
            "<li data-furniture='table'>Table</li>"+
          "</ul>"+
        "</div>"+
      "</div>"+
      "<div class='bottom'>"+

      "</div>"+
    "</div>");
    $(document.body).append(inventory);
    $(inventory).draggable({ "handle": ".top" });
    $(inventory).find('.items > li').click(function() {
      var furniture = $(this).data('furniture');
      ShopStore.setSelectedFurniture(furniture);
      $(this).addClass('active');
    });

    this.inventory = inventory;
  },
  updateFurniture: function() {
    var regionName = ShopStore.getSelectedFurniture();
    if (regionName) { return; }
    if (!this.inventory) { return; }
    $(this.inventory).find('.items > li').removeClass('active');
  }
});
