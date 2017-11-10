game.Menu = game.Menu || {};
game.Menu.GameMenu = me.Object.extend({
  init: function() {
    var self = this;
    var user = game.Stores.UserStore.getCurrentUser();
    var shop = game.Stores.GameStore.getShopInformation();
    if (user.sub === shop.subject && !user.is_visitor) {
      self.inventoryBox = new game.Menu.InventoryBox();
      self.manageEntityBox = new game.Menu.ManageEntityBox();
    }

    if (!user.is_visitor) {
      self.changeLook = new game.Menu.ChangeLookBox();
    }

    self.informationBox = new game.Menu.InformationBox();
    self.actionsBox = new game.Menu.ActionsBox();
    self.chatForm = new game.Menu.ChatForm();
    self.upRightOptions = new game.Menu.UpRightOptions();
    self.shelfBox = new game.Menu.ShelfBox();
    self.productBox = new game.Menu.ProductBox();
    self.footer = $("<div id='footer'></div>");
    self.navigatorBox = new game.Menu.NavigatorBox();
    $(document.body).append(self.footer);
    self.addUserSubMenu();
    self.addMenu();
    $(this.footer).i18n();
    if (!user.is_visitor) {
      this.updateCurrentUserB = this.updateCurrentUser.bind(this);
      game.Stores.UserStore.listenCurrentUserChanged(this.updateCurrentUserB);
    }
  },
  updateCurrentUser: function() {
    var currentUser = game.Stores.UserStore.getCurrentUser();
    $(this.menu).find('.user').css('background', 'url(/resources/players/'+currentUser.figure+'/sprite.png) -5px  -790px no-repeat');
  },
  updateShopInformation: function() {
    if (user.sub === shop.subject) {
      $(this.menu).find('.inventory').show();
    }
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
    var user = game.Stores.UserStore.getCurrentUser();
    var shop = game.Stores.GameStore.getShopInformation();
    this.menu = $("<div id='footer'>"+
        "<ul class='no-style'>"+
          ( !user.is_visitor && user.sub === shop.subject ? "<li class='inventory'></li>" : "" ) +
          "<li class='navigator'></li>"+
          (!user.is_visitor ? ("<li class='user' style='background: url(/resources/players/"+user.figure+"/sprite.png) -5px  -790px no-repeat;'></li>") : "")+
        "</ul>"+
      "</div>");
    $(this.footer).append(this.menu);
    var self = this;
    if (user.sub === shop.subject) {
      $(this.menu).find('.inventory').click(function() {
        self.inventoryBox.display();
      });
    }

    if (!user.is_visitor) {
      $(this.menu).find('.user').click(function() {
        self.userSubMenu.toggle();
      });
    }

    $(this.menu).find('.navigator').click(function() {
      self.navigatorBox.toggle();
    });
  },
  destroy: function() { // Destroy the menu.
    if (this.inventoryBox) this.inventoryBox.destroy();
    if (this.manageEntityBox) this.manageEntityBox.destroy();
    if (this.informationBox) this.informationBox.destroy();
    if (this.actionsBox) this.actionsBox.destroy();
    if (this.chatForm) this.chatForm.destroy();
    if (this.upRightOptions) this.upRightOptions.destroy();
    if (this.shelfBox) this.shelfBox.destroy();
    if (this.changeLook) this.changeLook.destroy();
    if (this.navigatorBox) this.navigatorBox.destroy();
    if (this.productBox) this.productBox.destroy();
    if (this.footer) $(this.footer).remove();
    if (this.menu) $(this.menu).remove();
    if (this.userSubMenu) $(this.userSubMenu).remove();
		if (this.updateCurrentUserB) game.Stores.UserStore.unsubscribeCurrentUserChanged(this.updateCurrentUserB);
  }
});
