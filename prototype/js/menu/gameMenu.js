game.GameMenu = me.Object.extend({
  init: function() {
    this.inventoryBox = new game.InventoryBox();
    new game.ManageEntityBox();
    new game.InformationBox();
    new game.ActionsBox();
    new game.ChatForm();
    new game.UpRightOptions();
    new game.ShelfBox();
    this.changeLook = new game.ChangeLook();
    this.addUserSubMenu();
    this.addMenu();
    $(document.body).i18n();
  },
  addUserSubMenu: function() { // Add sub menu.
    this.userSubMenu = $("<div id='user-sub-menu' class='heavygray-panel' style='display: none;'>"+
      "<div class='top'></div>"+
      "<div class='body'>"+
        "<ul class='no-style'>"+
          "<li style='text-align: center; display: inline-block;'>"+
            "<span class='profile' />"+
            "<span data-i18n='profile' class='title'></span>"+
          "</li>"+
          "<li style='text-align: center; display: inline-block;'>"+
            "<span class='look' />"+
            "<span data-i18n='look' class='title'></span>"+
          "</li>"+
        "</ul>"+
      "</div>"+
      "<div class='bottom'></div>"+
    "</div>");
    $("#footer").append(this.userSubMenu);
    var self = this;
    $(this.userSubMenu).find('.look').click(function() {
      self.changeLook.toggle();
    });
    $(this.userSubMenu).i18n();
  },
  addMenu: function() { // Add the menu.
    this.menu = $("<ul class='no-style'>"+
      "<li class='inventory'></li>"+
      "<li class='user' style='background: url(/resources/players/hd-180-1.ch-255-66.lg-280-110.sh-305-62.ha-1012-110.hr-828-61/sprite.png) -5px  -790px no-repeat;'></li>"+
    "</ul>");
    $("#footer").append(this.menu);
    var self = this;
    $(this.menu).find('.inventory').click(function() {
      self.inventoryBox.display();
    });
    $(this.menu).find('.user').click(function() {
      self.userSubMenu.toggle();
    });
  }
});
