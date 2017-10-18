game.InventoryBox = me.Object.extend({
  init: function() {
      var self = this;
      this.categories = [
        {
          name: "furnitures_tab",
          selector: Constants.Selectors.Furniture,
          types: [
            {
              name: "type_table",
              themes: [
                {
                  name: "theme_executive",
                  furnitures: [
                    { name: 'executive_table', url: 'resources/entities/furnitures/executive/table.gif', 'description': 'executive_table_description', icon: 'resources/entities_small/furnitures/executive/table.gif' },
                    { name: 'executive_desk', url: 'resources/entities/furnitures/executive/desk.gif', 'description': 'executive_desk_description', icon: 'resources/entities_small/furnitures/executive/desk.gif' }
                  ]
                },
                {
                  name: "theme_glass",
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
            },
            {
              name: "rayon",
              themes: [
                {
                  name: "Verre",
                  furnitures: [
                    { name: 'glass_shelves', url: 'resources/entities/furnitures/glass/shelves.gif' }
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
      var tabs = this.categories.map(function(category) {
        if (indice === 0) {
          indice++;
          return "<li class='active' data-name='"+category.name+"' data-i18n='"+category.name+"'></li>";
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
            "<div class='filter'>"+
              "<label>Type</label>"+
              "<select class='type-selector'>"+
              "</select>"+
              "<label>Thème</label>"+
              "<select class='theme-selector'>"+
              "</select>"+
            "</div>"+
            "<div class='entities'>"+
              "<ul class='items no-style furnitures'>"+
              "</ul>"+
              "<div class='entity-information'>"+
              "</div>"+
            "</div>"+
          "</div>"+
        "</div>"+
        "<div class='bottom'>"+
        "</div>"+
      "</div>");
      $(document.body).append(this.inventory);
      this.addListeners();
      $(this.inventory).find('.tabs li:first-child').click();
      $(this.inventory).hide();
      $(this.inventory).draggable({ "handle": ".top" });
      ShopStore.listenActiveEntityChanged(this.updateActiveEntity.bind(this));
  },
  addListeners: function() {
    this.listenTheme();
    this.listenType();
    this.listenTabClick();
    this.listenClose();
  },
  updateListeners: function() {
    var self = this;
    $(self.inventory).find('.items > li').click(function() {
      $(self.inventory).find('.items > li').removeClass('active');
      $(this).addClass('active');
      self.displayEntityInformation(this);
    });
  },
  displayEntityInformation: function(elt) { // Display the entity information.
    var self = this;
    var entityInformation = $(self.inventory).find('.entity-information');
    entityInformation.empty();
    var n = $("<div>"+
      "<div class='picture'>"+
        "<img src='"+$(elt).data('img')+"' />"+
      "</div>"+
      "<div class='action'>"+
        "<b data-i18n='"+$(elt).data('description')+"'></b>"+
        "<button class='button button-gray' data-i18n='add_into_shop'></button>"+
      "</div>"+
    "</div>");
    $(entityInformation).append(n);
    $(n).find('.button').click(function() {
      ShopStore.setActiveEntity($(elt).data('furniture'), $(elt).data('selector'), false);
    });
    $(entityInformation).i18n();
  },
  listenTheme: function() { // When the user clicks on the theme then display all the items.
    var self = this;
    $(this.inventory).find('.theme-selector').change(function() {
      var categoryName = $(self.inventory).find('.tabs li.active').data('name');
      var typeName = $(self.inventory).find('.type-selector option:selected').data('name');
      var themeName = $(this).find('option:selected').data('name');
      var category = self.categories.filter(function(category) { return category.name === categoryName; })[0];
      if (!category) { return; }
      var type = category.types.filter(function(type) { return type.name === typeName; })[0];
      if (!type) { return; }
      var theme = type.themes.filter(function(t) { return t.name === themeName; })[0];
      if (!theme) { return; }
      $(self.inventory).find('.furnitures').empty();
      theme.furnitures.forEach(function(furniture) {
        $(self.inventory).find('.furnitures').append("<li data-furniture='"+furniture.name+"' data-selector='"+category.selector+"' data-img='"+furniture.url+"' data-description='"+furniture.description+"'><img src='"+furniture.icon+"'</li>")
      });

      self.updateListeners();
      $(self.inventory).find('.furnitures').i18n();
    });
  },
  listenType: function() {
    var self = this;
    $(this.inventory).find('.type-selector').change(function() {
      var categoryName = $(self.inventory).find('.tabs li.active').data('name');
      var typeName = $(this).find('option:selected').data('name');
      var category = self.categories.filter(function(category) { return category.name === categoryName; })[0];
      if (!category) { return; }
      var type = category.types.find(function(type) { return type.name === typeName; });
      if (!type) { return; }
      var themeSelector = $(self.inventory).find('.theme-selector');
      $(themeSelector).empty();
      type.themes.forEach(function(theme) {
        $(themeSelector).append("<option data-name='"+theme.name+"' data-i18n='"+theme.name+"'></option>");
      });
      $(themeSelector).i18n();
      $(themeSelector).change();
    });
  },
  listenTabClick: function() {
    var self = this;
    $(this.inventory).find(".tabs li").click(function() {
      var name = $(this).data('name');
      $(self.inventory).find('.tabs li').removeClass('active');
      $(this).addClass('active');
      var typeSelector = $(self.inventory).find('.type-selector');
      var themeSelector = $(self.inventory).find('.theme-selector');
      $(self.inventory).find('.furnitures').empty();
      $(typeSelector).empty();
      $(themeSelector).empty();
      var category = self.categories.filter(function(cat) { return cat.name === name; })[0];
      if (!category) { return; }
      if (category.types && category.types.length > 0) {
        category.types.forEach(function(type) {
          $(typeSelector).append("<option data-name='"+type.name+"' data-i18n='"+type.name+"'></option>");
        });

        $(typeSelector).i18n();
        $(typeSelector).change();
      }
    });
  },
  listenClose: function() {
    $(this.inventory).find('.close').click(function() {
      $(self.inventory).hide();
    });
  },
  display: function() {
    if ($(this.inventory).is(':visible')) { return; }
    $(this.inventory).show();
  },
  updateActiveEntity: function() {
    var regionName = ShopStore.getActiveEntity();
    if (regionName) { return; }
    if (!this.inventory) { return; }
    $(this.inventory).find('.items > li').removeClass('active');
  }
});
