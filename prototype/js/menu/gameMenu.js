game.GameMenu = me.Object.extend({
  init: function() {
    this.addMenu();
    this.addInventoryBox();
    this.addInformationBox();
    this.addActionsBox();
    ShopStore.listenActiveFurnitureChanged(this.updateActiveFurniture.bind(this));
    ShopStore.listenSelectedFurnitureChanged(this.updateSelectedFurniture.bind(this));
  },
  addMenu: function() {
    this.menu = $("<ul class='no-style'>"+
      "<li class='inventory'></li>"+
    "</ul>");
    $("#footer").append(this.menu);
    var self = this;
    $(this.menu).find('.inventory').click(function() {
      self.displayInventoryBox();
    });
  },
  addInventoryBox: function() { // Add the inventory box.
    this.inventory = $("<div class='inventory-box'>"+
      "<div class='top'>"+
        "Inventory"+
      "</div>"+
      "<div class='body'>"+
        "<ul class='tabs'>"+
          "<li class='active'>Mobilié</li>"+
          "<li>Personnages</li>"+
        "</ul>"+
        "<div>"+
          "<ul class='items no-style'>"+
            "<li data-furniture='table'>Table</li>"+
            "<li data-furniture='chair'>Chaise</li>"+
          "</ul>"+
        "</div>"+
      "</div>"+
      "<div class='bottom'>"+
      "</div>"+
    "</div>");
    $(document.body).append(this.inventory);
    $(this.inventory).hide();
    $(this.inventory).draggable({ "handle": ".top" });
    $(this.inventory).find('.items > li').click(function() {
      var furniture = $(this).data('furniture');
      ShopStore.setActiveFurniture(furniture);
      $(this).addClass('active');
    });
  },
  addInformationBox: function() { // Add the information box.
    this.information = $("<div class='information-box'>"+
      "<div class='top'></div>"+
      "<div class='body'></div>"+
      "<div class='bottom'></div>"+
    "</div>");
    $("#bottom-right-container").append(this.information);
    $(this.information).hide();
  },
  addActionsBox: function() { // Add the actions box.
    this.actions = $("<div class='actions-box'>"+
      "<button class='button button-blue move'>Déplacer</button>"+
      "<button class='button button-blue remove'>Supprimer</button>"+
    "</div>");
    $("#bottom-right-container").append(this.actions);
    var self = this;
    $(this.actions).find('.move').click(function() {
      var selectedFurniture = ShopStore.getSelectedFurniture();
      ShopStore.setActiveFurniture(selectedFurniture.metadata.imageName);
      me.game.world.removeChild(selectedFurniture.sprite);
      ShopStore.removeFurniture(selectedFurniture);
      $(self.actions).hide();
      $(self.information).hide();
    });
    $(this.actions).find('.remove').click(function() {
      var selectedFurniture = ShopStore.getSelectedFurniture();
      me.game.world.removeChild(selectedFurniture.sprite);
      ShopStore.removeFurniture(selectedFurniture);
      me.game.repaint();
      $(self.actions).hide();
      $(self.information).hide();
    });
    $(this.actions).hide();
  },
  displayInventoryBox: function() { // Display inventory box.
    if ($(this.inventory).is(':visible')) { return; }
    $(this.inventory).show();
  },
  updateActiveFurniture: function() {
    var regionName = ShopStore.getActiveFurniture();
    if (regionName) { return; }
    if (!this.inventory) { return; }
    $(this.inventory).find('.items > li').removeClass('active');
  },
  updateSelectedFurniture: function() {
    var selectedFurniture = ShopStore.getSelectedFurniture();
    if (!selectedFurniture) {
      $(this.information).hide();
      $(this.actions).hide();
      return;
    }

    var img = selectedFurniture.sprite.image;
    $(this.information).find('.body').empty();
    $(this.information).find('.body').append(img);
    $(this.information).show();
    $(this.actions).show();
  }
});
