game.Menu = game.Menu || {};
game.Menu.GameMenu = me.Object.extend({
  init: function() {
    this.inventoryBox = new game.Menu.InventoryBox();
    new game.Menu.ManageEntityBox();
    new game.Menu.InformationBox();
    new game.Menu.ActionsBox();
    new game.Menu.ChatForm();
    new game.Menu.UpRightOptions();
    new game.Menu.ShelfBox();
    this.changeLook = new game.Menu.ChangeLookBox();
    this.footer = $("<div id='footer'></div>");
    $(document.body).append(this.footer);
    this.addUserSubMenu();
    this.addMenu();
    $(this.footer).i18n();
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
    $(this.footer).append(this.userSubMenu);
    var self = this;
    $(this.userSubMenu).find('.look').click(function() {
      self.changeLook.toggle();
    });
    $(this.userSubMenu).i18n();
  },
  addMenu: function() { // Add the menu.
    this.menu = $("<div id='footer'>"+
        "<ul class='no-style'>"+
          "<li class='inventory'></li>"+
          "<li class='user' style='background: url(/resources/players/hd-180-1.ch-255-66.lg-280-110.sh-305-62.ha-1012-110.hr-828-61/sprite.png) -5px  -790px no-repeat;'></li>"+
        "</ul>"+
      "</div>");
    $(this.footer).append(this.menu);
    var self = this;
    $(this.menu).find('.inventory').click(function() {
      self.inventoryBox.display();
    });
    $(this.menu).find('.user').click(function() {
      self.userSubMenu.toggle();
    });
  }
});
