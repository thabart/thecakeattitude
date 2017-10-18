game.GameMenu = me.Object.extend({
  init: function() {
    this.addMenu();
    this.addInventoryBox();
    this.addInformationBox();
    this.addActionsBox();
    this.addManageEntityBox();
    this.addChatForm();
    ShopStore.listenActiveEntityChanged(this.updateActiveEntity.bind(this));
    ShopStore.listenDisplayInformationArrived(this.updateInformationBox.bind(this)); // Display information box.
    ShopStore.listenHideInformationArrived(this.hideInformationBox.bind(this));
    ShopStore.listenDisplayActionsArrived(this.displayActions.bind(this)); // Display entity actions.
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
    var categories = [
      {
        name: "Mobiliés",
        selector: Constants.Selectors.Furniture,
        types: [
          {
            name: "table",
            themes: [
              {
                name: "Affaire",
                furnitures: [
                  { name: 'executive_table', url: 'resources/entities/furnitures/executive/table.gif' },
                  { name: 'executive_desk', url: 'resources/entities/furnitures/executive/desk.gif' }
                ]
              },
              {
                name: "Verre",
                furnitures: [
                  { name: 'glass_table', url: 'resources/entities/furnitures/glass/table.gif' }
                ]
              },
              {
                name: "Grenier",
                furnitures: [
                  { name: 'grunge_table', url: 'resources/entities/furnitures/grunge/table.gif' }
                ]
              },
              {
                name: "Mode",
                furnitures: [
                  { name: 'mode_table', url: 'resources/entities/furnitures/mode/table.gif' }
                ]
              }
            ]
          },
          {
            name: "chaise",
            themes: [
              {
                name: "Affaire",
                furnitures: [
                  { name: 'executive_sofa', url: 'resources/entities/furnitures/executive/sofa.gif' },
                  { name: 'executive_chair', url: 'resources/entities/furnitures/executive/chair.gif' }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Mur",
        selector: Constants.Selectors.Wall,
        types: [
          {
            name: "Posters",
            themes: [
              {
                name: "Défault",
                furnitures: [
                  { name: 'gallery_1', url: 'resources/entities/walls/posters/gallery_1.gif' },
                  { name: 'gallery_2', url: 'resources/entities/walls/posters/gallery_2.gif' },
                  { name: 'gallery_n1', url: 'resources/entities/walls/posters/gallery_n1.gif' },
                  { name: 'gallery_n2', url: 'resources/entities/walls/posters/gallery_n2.gif' },
                  { name: 'gallery_n3', url: 'resources/entities/walls/posters/gallery_n3.gif' },
                  { name: 'gallery_n4', url: 'resources/entities/walls/posters/gallery_n4.gif' },
                  { name: 'gallery_n5', url: 'resources/entities/walls/posters/gallery_n5.gif' },
                  { name: 'gallery_n6', url: 'resources/entities/walls/posters/gallery_n6.gif' },
                  { name: 'gallery_n7', url: 'resources/entities/walls/posters/gallery_n7.gif' },
                  { name: 'gallery_n8', url: 'resources/entities/walls/posters/gallery_n8.gif' },
                  { name: 'gallery_n9', url: 'resources/entities/walls/posters/gallery_n9.gif' },
                  { name: 'gallery_n10', url: 'resources/entities/walls/posters/gallery_n10.gif' },
                  { name: 'gallery_n11', url: 'resources/entities/walls/posters/gallery_n11.gif' },
                  { name: 'gallery_n12', url: 'resources/entities/walls/posters/gallery_n12.gif' },
                  { name: 'gallery_n13', url: 'resources/entities/walls/posters/gallery_n13.gif' },
                  { name: 'gallery_n14', url: 'resources/entities/walls/posters/gallery_n14.gif' }
                ]
              }
            ]
          },
          {
            name: "Drapeaux",
            themes: [
              {
                name: "Défault",
                furnitures: [
                  { name: 'flag_1', url: 'resources/entities/walls/flags/flag_1.gif' },
                  { name: 'flag_2', url: 'resources/entities/walls/flags/flag_2.gif' },
                  { name: 'flag_3', url: 'resources/entities/walls/flags/flag_3.gif' },
                  { name: 'flag_4', url: 'resources/entities/walls/flags/flag_4.gif' },
                  { name: 'flag_5', url: 'resources/entities/walls/flags/flag_5.gif' }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Intérieur",
        selector: Constants.Selectors.Furniture,
        types: [
          {
            name: "Plantes",
            themes: [
              {
                name: "Défault",
                furnitures: [
                  { name: 'plant_1', url: 'resources/entities/decorations/plants/plant_1.gif' },
                  { name: 'plant_2', url: 'resources/entities/decorations/plants/plant_2.gif' },
                  { name: 'plant_3', url: 'resources/entities/decorations/plants/plant_3.gif' },
                  { name: 'plant_4', url: 'resources/entities/decorations/plants/plant_4.gif' },
                  { name: 'plant_5', url: 'resources/entities/decorations/plants/plant_5.gif' },
                  { name: 'plant_6', url: 'resources/entities/decorations/plants/plant_6.gif' },
                  { name: 'plant_7', url: 'resources/entities/decorations/plants/plant_7.gif' },
                  { name: 'plant_8', url: 'resources/entities/decorations/plants/plant_8.gif' },
                  { name: 'plant_9', url: 'resources/entities/decorations/plants/plant_9.gif' },
                  { name: 'plant_10', url: 'resources/entities/decorations/plants/plant_10.gif' }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Sol",
        selector: Constants.Selectors.Floor,
        types: [
          {
            name: "Terrain",
            themes: [
              {
                name: "Affaire",
                furnitures: [
                  { name: 'exe_floor', url: 'resources/entities/grounds/floors/executive/exe_floor.gif' },
                ]
              },
              {
                name: "Star",
                furnitures: [
                  { name: 'hw_tile_1', url: 'resources/entities/grounds/floors/star/hw_tile_1.gif' },
                  { name: 'hw_tile_2', url: 'resources/entities/grounds/floors/star/hw_tile_2.gif' },
                  { name: 'hw_tile_3', url: 'resources/entities/grounds/floors/star/hw_tile_3.gif' },
                ]
              }
            ]
          },
          {
            name: "Tapis",
            themes: [
              {
                name: "Japonais",
                furnitures: [
                  { name: 'jp_tatami_large', url: 'resources/entities/grounds/rugs/japanese/jp_tatami_large.gif' },
                  { name: 'jp_tatami_small', url: 'resources/entities/grounds/rugs/japanese/jp_tatami_small.gif' },
                ]
              },
              {
                name: "Défault",
                furnitures: [
                  { name: 'bear_rug_blue', url: 'resources/entities/grounds/rugs/others/bear_rug_blue.gif' },
                  { name: 'bear_rug_mint', url: 'resources/entities/grounds/rugs/others/bear_rug_mint.gif' },
                ]
              }
            ]
          }
        ]
      },
      {
        name: "Personnages"
      }
    ];
    var indice = 0;
    var tabs = categories.map(function(category) {
      if (indice === 0) {
        indice++;
        return "<li class='active' data-name='"+category.name+"'>"+category.name+"</li>";
      }

      return "<li data-name='"+category.name+"'>"+category.name+"</li>";
    }).join('');
    this.inventory = $("<div class='inventory-box'>"+
      "<div class='top'>"+
        "Inventaire <div class='close'></div>"+
      "</div>"+
      "<div class='body'>"+
        "<ul class='tabs'>"+
          tabs +
        "</ul>"+
        "<div class='content'>"+
          "<div>"+
            "<label>Type</label>"+
            "<select class='type-selector'>"+
            "</select>"+
            "<label>Thème</label>"+
            "<select class='theme-selector'>"+
            "</select>"+
          "</div>"+
          "<ul class='items no-style furnitures'>"+
          "</ul>"+
        "</div>"+
      "</div>"+
      "<div class='bottom'>"+
      "</div>"+
    "</div>");
    $(document.body).append(this.inventory);
    var updateListeners = function() {
      $(self.inventory).find('.items > li').click(function() {
        var furniture = $(this).data('furniture');
        var selector = $(this).data('selector');
        ShopStore.setActiveEntity(furniture, selector, false);
        $(this).addClass('active');
      });
    };
    $(this.inventory).find('.theme-selector').change(function() {
      var categoryName = $(self.inventory).find('.tabs li.active').data('name');
      var typeName = $(self.inventory).find('.type-selector option:selected').data('name');
      var themeName = $(this).find('option:selected').data('name');
      var category = categories.filter(function(category) { return category.name === categoryName; })[0];
      if (!category) { return; }
      var type = category.types.filter(function(type) { return type.name === typeName; })[0];
      if (!type) { return; }
      var theme = type.themes.filter(function(t) { return t.name === themeName; })[0];
      if (!theme) { return; }
      $(self.inventory).find('.furnitures').empty();
      theme.furnitures.forEach(function(furniture) {
        $(self.inventory).find('.furnitures').append("<li data-furniture='"+furniture.name+"' data-selector='"+category.selector+"'><img src='"+furniture.url+"'</li>")
      });

      updateListeners();
    });
    $(this.inventory).find('.type-selector').change(function() {
      var categoryName = $(self.inventory).find('.tabs li.active').data('name');
      var typeName = $(this).find('option:selected').data('name');
      var category = categories.filter(function(category) { return category.name === categoryName; })[0];
      if (!category) { return; }
      var type = category.types.find(function(type) { return type.name === typeName; });
      if (!type) { return; }
      var themeSelector = $(self.inventory).find('.theme-selector');
      $(themeSelector).empty();
      type.themes.forEach(function(theme) {
        $(themeSelector).append("<option data-name='"+theme.name+"'>"+theme.name+"</option>");
      });
      $(themeSelector).change();
    });
    $(this.inventory).find(".tabs li").click(function() {
      var name = $(this).data('name');
      $(self.inventory).find('.tabs li').removeClass('active');
      $(this).addClass('active');
      var typeSelector = $(self.inventory).find('.type-selector');
      var themeSelector = $(self.inventory).find('.theme-selector');
      $(self.inventory).find('.furnitures').empty();
      $(typeSelector).empty();
      $(themeSelector).empty();
      var category = categories.filter(function(cat) { return cat.name === name; })[0];
      if (!category) { return; }
      if (category.types && category.types.length > 0) {
        category.types.forEach(function(type) {
          $(typeSelector).append("<option data-name='"+type.name+"'>"+type.name+"</option>");
        });

        $(typeSelector).change();
      }
    });
    $(this.inventory).find('.tabs li:first-child').click();
    $(this.inventory).find('.close').click(function() {
      $(self.inventory).hide();
    });
    $(this.inventory).hide();
    $(this.inventory).draggable({ "handle": ".top" });
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
      ShopStore.setSelectedEntity(null);
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
      var selectedEntity = ShopStore.getSelectedEntity();
      var name = selectedEntity.getName();
      var flipped = selectedEntity.flipped;
      var selector = selectedEntity.selector;
      ShopStore.setActiveEntity(name, selector, flipped);
      ShopStore.removeEntity(selectedEntity);
      $(self.actions).hide();
      $(self.information).hide();
    });
    $(this.actions).find('.remove').click(function() {
      var selectedEntity = ShopStore.getSelectedEntity();
      ShopStore.removeEntity(selectedEntity);
      $(self.actions).hide();
      $(self.information).hide();
    });
    $(this.actions).find('.turn').click(function() {
      var selectedEntity = ShopStore.getSelectedEntity();
      selectedEntity.flip();
      ShopStore.updateColls();
      me.game.repaint();
    });
    $(this.actions).find('.translate').click(function() {
      if ($(self.mgfurniture).is(':visible')) { return; }
      $(self.mgfurniture).show();
    });
    $(this.actions).hide();
  },
  addManageEntityBox: function() { // Change x & y coordinate of a tile.
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
      var selectedEntity = ShopStore.getSelectedEntity();
      if (!selectedEntity) {
        return;
      }

      var val = $(this).val();
      selectedEntity.translateX(parseInt(val));
      me.game.repaint();
    });
    $(this.mgfurniture).find('.ord').on('input', function(e) {
      var selectedEntity = ShopStore.getSelectedEntity();
      if (!selectedEntity) {
        return;
      }

      var val = $(this).val();
      selectedEntity.translateY(parseInt(val));
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
  updateActiveEntity: function() {
    var regionName = ShopStore.getActiveEntity();
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
