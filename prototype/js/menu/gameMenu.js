game.GameMenu = me.Object.extend({
  init: function() {
    this.inventoryBox = new game.InventoryBox();
    new game.ManageEntityBox();
    new game.InformationBox();
    new game.ActionsBox();
    new game.ChatForm();
    new game.UpRightOptions();
    this.addMenu();
    $(document.body).i18n();
  },
  addMenu: function() { // Add the menu.
    this.menu = $("<ul class='no-style'>"+
      "<li class='inventory'></li>"+
    "</ul>");
    $("#footer").append(this.menu);
    var self = this;
    $(this.menu).find('.inventory').click(function() {
      self.inventoryBox.display();
    });
  }
});
