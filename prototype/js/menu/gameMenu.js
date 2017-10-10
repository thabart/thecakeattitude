game.GameMenu = me.Object.extend({
  init: function() {
    this.addMenu();
    this.addInventoryBox();
    this.addInformationBox();
    this.addActionsBox();
    this.addManageFurnitureBox();
    this.addChatForm();
    ShopStore.listenActiveFurnitureChanged(this.updateActiveFurniture.bind(this));
    ShopStore.listenDisplayInformationArrived(this.updateInformationBox.bind(this)); // Display information box.
    ShopStore.listenHideInformationArrived(this.hideInformationBox.bind(this));
    ShopStore.listenDisplayActionsArrived(this.displayActions.bind(this)); // Display furniture actions.
    ShopStore.hideDisplayActionsArrived(this.hideActions.bind(this));
  },
  addMenu: function() { // Add the menu.
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
    var self = this;
    this.inventory = $("<div class='inventory-box'>"+
      "<div class='top'>"+
        "Inventaire <div class='close'></div>"+
      "</div>"+
      "<div class='body'>"+
        "<ul class='tabs'>"+
          "<li class='active'>Mobilié</li>"+
          "<li>Personnages</li>"+
        "</ul>"+
        "<div>"+
          "<ul class='items no-style'>"+
            "<li data-furniture='table'><img src='resources/furnitures/sofatable.png' /></li>"+
            "<li data-furniture='chair'><img src='resources/furnitures/chair.png' /></li>"+
            "<li data-furniture='bar'><img src='resources/furnitures/executive/bar.png' /></li>"+
            // "<li data-furniture='corner'><img src='resources/furnitures/executive/exe_corner.gif' /></li>"+
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
    $(this.inventory).find('.close').click(function() {
      $(self.inventory).hide();
    });
  },
  addInformationBox: function() { // Add the information box.
    var self = this;
    this.information = $("<div class='information-box'>"+
      "<div class='top'><span class='title'></span><div class='black-close'></div></div>"+
      "<div class='body'></div>"+
      "<div class='bottom'></div>"+
    "</div>");
    $("#bottom-right-container").append(this.information);
    $(this.information).find('.black-close').click(function() {
      $(self.information).hide();
      $(self.actions).hide();
      ShopStore.setSelectedFurniture(null);
    });
    $(this.information).hide();
  },
  addActionsBox: function() { // Add the actions box.
    this.actions = $("<div class='actions-box'>"+
      "<button class='button button-blue move'>Déplacer</button>"+
      "<button class='button button-blue remove'>Supprimer</button>"+
      "<button class='button button-blue turn'>Tourner</button>"+
      "<button class='button button-blue translate'>Bouger</button>"+
    "</div>");
    $("#bottom-right-container").append(this.actions);
    var self = this;
    $(this.actions).find('.move').click(function() {
      var selectedFurniture = ShopStore.getSelectedFurniture();
      var name = selectedFurniture.getName();
      ShopStore.setActiveFurniture(name);
      ShopStore.removeFurniture(selectedFurniture);
      $(self.actions).hide();
      $(self.information).hide();
    });
    $(this.actions).find('.remove').click(function() {
      var selectedFurniture = ShopStore.getSelectedFurniture();
      ShopStore.removeFurniture(selectedFurniture);
      $(self.actions).hide();
      $(self.information).hide();
    });
    $(this.actions).find('.turn').click(function() {
      var selectedFurniture = ShopStore.getSelectedFurniture();
      selectedFurniture.flip();
      me.game.repaint();
    });
    $(this.actions).find('.translate').click(function() {
      if ($(self.mgfurniture).is(':visible')) { return; }
      $(self.mgfurniture).show();
    });
    $(this.actions).hide();
  },
  addManageFurnitureBox: function() { // Change x & y coordinate of a tile.
    var self = this;
    this.mgfurniture = $("<div class='furniture-box'>"+
      "<div class='top'>"+
        "Gérer les coordonnées <div class='close'></div>"+
      "</div>"+
      "<div class='body'>"+
        "<div><label>Abscisse (x)</label><input type='range' class='abs' min='-100' max='100'></div>"+
        "<div><label>Ordonnée (y)</label><input type='range' class='ord' min='-100' max='100'></div>"+
      "</div>"+
      "<div class='bottom'>"+
      "</div>"+
    "</div>");
    $(document.body).append(this.mgfurniture);
    $(this.mgfurniture).hide();
    $(this.mgfurniture).draggable({ "handle": ".top" });
    $(this.mgfurniture).find('.abs').on('input', function(e) {
      var selectedFurniture = ShopStore.getSelectedFurniture();
      if (!selectedFurniture) {
        return;
      }

      var val = $(this).val();
      selectedFurniture.sprite.translateX(parseInt(val));
      me.game.repaint();
    });
    $(this.mgfurniture).find('.ord').on('input', function(e) {
      var selectedFurniture = ShopStore.getSelectedFurniture();
      if (!selectedFurniture) {
        return;
      }

      var val = $(this).val();
      selectedFurniture.sprite.translateY(parseInt(val));
      me.game.repaint();
    });
    $(this.mgfurniture).find('.close').click(function() {
      $(self.mgfurniture).hide();
    });
  },
  addChatForm: function() { // Add the chat form.
    var self = this;
    self.chatForm = $("<form id='chat-input-form'>"+
      "<div id='chat-input-form-left'>"+
        "<i class='icon chatbubbles'></i>"+
      "</div>"+
      "<input id='chat-input' placeholder='Type here to chat...' >"+
    "</form>");
    $(document.body).append(self.chatForm);
    $(self.chatForm).submit(function(e) {
      e.preventDefault();
      var message = $(self.chatForm).find('input').val();
      ShopStore.displayMessage(message);
      $(self.chatForm).find('input').val('');
    });
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
  updateInformationBox: function(e, metadata) {
    $(this.information).find('.body').empty();
    $(this.information).find('.top .title').html(metadata.name);
    $(this.information).find('.body').append("<img src='"+metadata.image+"' />'");
    $(this.information).show();
  },
  hideInformationBox: function() {
    $(this.information).hide();
  },
  displayActions: function() {
    $(this.actions).show();
  },
  hideActions: function() {
    $(this.actions).hide();
  }
});
