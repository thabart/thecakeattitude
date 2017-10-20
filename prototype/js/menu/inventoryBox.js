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
                    { name: 'executive_table', url: 'resources/entities/furnitures/executive/table.gif', description: 'executive_table_description', icon: 'resources/entities_small/furnitures/executive/table.gif', in_stock: '1' },
                    { name: 'executive_desk', url: 'resources/entities/furnitures/executive/desk.gif', description: 'executive_desk_description', icon: 'resources/entities_small/furnitures/executive/desk.gif', in_stock: '1' }
                  ]
                },
                {
                  name: "theme_glass",
                  furnitures: [
                    { name: 'glass_table', url: 'resources/entities/furnitures/glass/table.gif', description: 'glass_table_description', icon: 'resources/entities_small/furnitures/glass/table.gif' }
                  ]
                },
                {
                  name: "theme_grunge",
                  furnitures: [
                    { name: 'grunge_table', url: 'resources/entities/furnitures/grunge/table.gif', description: 'grunge_table_description', icon: 'resources/entities_small/furnitures/grunge/table.gif' }
                  ]
                },
                {
                  name: "theme_mode",
                  furnitures: [
                    { name: 'mode_table', url: 'resources/entities/furnitures/mode/table.gif', description: 'mode_table_description', icon: 'resources/entities_small/furnitures/mode/table.gif' }
                  ]
                }
              ]
            },
            {
              name: "type_chair",
              themes: [
                {
                  name: "theme_executive",
                  furnitures: [
                    { name: 'executive_sofa', url: 'resources/entities/furnitures/executive/sofa.gif', description: 'executive_sofa_description', icon: 'resources/entities_small/furnitures/executive/sofa.gif' },
                    { name: 'executive_chair', url: 'resources/entities/furnitures/executive/chair.gif', description: 'executive_chair_description', icon: 'resources/entities_small/furnitures/executive/chair.gif' }
                  ]
                }
              ]
            },
            {
              name: "type_shelf",
              themes: [
                {
                  name: "theme_glass",
                  furnitures: [
                    { name: 'glass_shelves', url: 'resources/entities/furnitures/glass/shelves.gif',  description: 'glass_shelf_description', icon: 'resources/entities_small/furnitures/glass/shelves.gif'}
                  ]
                }
              ]
            }
          ]
        },
        {
          name: "wall_tab",
          selector: Constants.Selectors.Wall,
          types: [
            {
              name: "type_posters",
              themes: [
                {
                  name: "theme_default",
                  furnitures: [
                    { name: 'gallery_1', url: 'resources/entities/walls/posters/gallery_1.gif', description: 'gallery_1_description', icon: 'resources/entities_small/walls/posters/gallery_1.gif' },
                    { name: 'gallery_2', url: 'resources/entities/walls/posters/gallery_2.gif', description: 'gallery_2_description', icon: 'resources/entities_small/walls/posters/gallery_2.gif' },
                    { name: 'gallery_n1', url: 'resources/entities/walls/posters/gallery_n1.gif', description: 'gallery_n1_description', icon: 'resources/entities_small/walls/posters/gallery_n1.gif' },
                    { name: 'gallery_n2', url: 'resources/entities/walls/posters/gallery_n2.gif', description: 'gallery_n2_description', icon: 'resources/entities_small/walls/posters/gallery_n2.gif' },
                    { name: 'gallery_n3', url: 'resources/entities/walls/posters/gallery_n3.gif', description: 'gallery_n3_description', icon: 'resources/entities_small/walls/posters/gallery_n3.gif' },
                    { name: 'gallery_n4', url: 'resources/entities/walls/posters/gallery_n4.gif', description: 'gallery_n4_description', icon: 'resources/entities_small/walls/posters/gallery_n4.gif' },
                    { name: 'gallery_n5', url: 'resources/entities/walls/posters/gallery_n5.gif', description: 'gallery_n5_description', icon: 'resources/entities_small/walls/posters/gallery_n5.gif' },
                    { name: 'gallery_n6', url: 'resources/entities/walls/posters/gallery_n6.gif', description: 'gallery_n6_description', icon: 'resources/entities_small/walls/posters/gallery_n6.gif' },
                    { name: 'gallery_n7', url: 'resources/entities/walls/posters/gallery_n7.gif', description: 'gallery_n7_description', icon: 'resources/entities_small/walls/posters/gallery_n7.gif' },
                    { name: 'gallery_n8', url: 'resources/entities/walls/posters/gallery_n8.gif', description: 'gallery_n8_description', icon: 'resources/entities_small/walls/posters/gallery_n8.gif' },
                    { name: 'gallery_n9', url: 'resources/entities/walls/posters/gallery_n9.gif', description: 'gallery_n9_description', icon: 'resources/entities_small/walls/posters/gallery_n9.gif' },
                    { name: 'gallery_n10', url: 'resources/entities/walls/posters/gallery_n10.gif', description: 'gallery_n10_description', icon: 'resources/entities_small/walls/posters/gallery_n10.gif' },
                    { name: 'gallery_n11', url: 'resources/entities/walls/posters/gallery_n11.gif', description: 'gallery_n11_description', icon: 'resources/entities_small/walls/posters/gallery_n11.gif' },
                    { name: 'gallery_n12', url: 'resources/entities/walls/posters/gallery_n12.gif', description: 'gallery_n12_description', icon: 'resources/entities_small/walls/posters/gallery_n12.gif' },
                    { name: 'gallery_n13', url: 'resources/entities/walls/posters/gallery_n13.gif', description: 'gallery_n13_description', icon: 'resources/entities_small/walls/posters/gallery_n13.gif' },
                    { name: 'gallery_n14', url: 'resources/entities/walls/posters/gallery_n14.gif', description: 'gallery_n14_description', icon: 'resources/entities_small/walls/posters/gallery_n14.gif' },
                  ]
                }
              ]
            },
            {
              name: "type_flags",
              themes: [
                {
                  name: "theme_default",
                  furnitures: [
                    { name: 'flag_1', url: 'resources/entities/walls/flags/flag_1.gif', description: 'flag_1_description', icon: 'resources/entities_small/walls/flags/flag_1.gif' },
                    { name: 'flag_2', url: 'resources/entities/walls/flags/flag_2.gif', description: 'flag_2_description', icon: 'resources/entities_small/walls/flags/flag_2.gif' },
                    { name: 'flag_3', url: 'resources/entities/walls/flags/flag_3.gif', description: 'flag_3_description', icon: 'resources/entities_small/walls/flags/flag_3.gif' },
                    { name: 'flag_4', url: 'resources/entities/walls/flags/flag_4.gif', description: 'flag_4_description', icon: 'resources/entities_small/walls/flags/flag_4.gif' },
                    { name: 'flag_5', url: 'resources/entities/walls/flags/flag_5.gif', description: 'flag_5_description', icon: 'resources/entities_small/walls/flags/flag_5.gif' }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: "interior_tab",
          selector: Constants.Selectors.Furniture,
          types: [
            {
              name: "type_plants",
              themes: [
                {
                  name: "theme_default",
                  furnitures: [
                    { name: 'plant_1', url: 'resources/entities/decorations/plants/plant_1.gif', description: 'plant_1_description', icon: 'resources/entities_small/decorations/plants/plant_1.gif' },
                    { name: 'plant_2', url: 'resources/entities/decorations/plants/plant_2.gif', description: 'plant_2_description', icon: 'resources/entities_small/decorations/plants/plant_2.gif' },
                    { name: 'plant_3', url: 'resources/entities/decorations/plants/plant_3.gif', description: 'plant_3_description', icon: 'resources/entities_small/decorations/plants/plant_3.gif' },
                    { name: 'plant_4', url: 'resources/entities/decorations/plants/plant_4.gif', description: 'plant_4_description', icon: 'resources/entities_small/decorations/plants/plant_4.gif' },
                    { name: 'plant_5', url: 'resources/entities/decorations/plants/plant_5.gif', description: 'plant_5_description', icon: 'resources/entities_small/decorations/plants/plant_5.gif' },
                    { name: 'plant_6', url: 'resources/entities/decorations/plants/plant_6.gif', description: 'plant_6_description', icon: 'resources/entities_small/decorations/plants/plant_6.gif' },
                    { name: 'plant_7', url: 'resources/entities/decorations/plants/plant_7.gif', description: 'plant_7_description', icon: 'resources/entities_small/decorations/plants/plant_7.gif' },
                    { name: 'plant_8', url: 'resources/entities/decorations/plants/plant_8.gif', description: 'plant_8_description', icon: 'resources/entities_small/decorations/plants/plant_8.gif' },
                    { name: 'plant_9', url: 'resources/entities/decorations/plants/plant_9.gif', description: 'plant_9_description', icon: 'resources/entities_small/decorations/plants/plant_9.gif' },
                    { name: 'plant_10', url: 'resources/entities/decorations/plants/plant_10.gif', description: 'plant_10_description', icon: 'resources/entities_small/decorations/plants/plant_10.gif' }
                  ]
                }
              ]
            }
          ]
        },
        {
          name: "field_tab",
          selector: Constants.Selectors.Floor,
          types: [
            {
              name: "type_field",
              themes: [
                {
                  name: "theme_executive",
                  furnitures: [
                    { name: 'exe_floor', url: 'resources/entities/grounds/floors/executive/exe_floor.gif', 'description': 'executive_floor_description', icon: 'resources/entities_small/grounds/floors/executive/exe_floor.gif', in_stock: '4' },
                  ]
                },
                {
                  name: "theme_star",
                  furnitures: [
                    { name: 'hw_tile_1', url: 'resources/entities/grounds/floors/star/hw_tile_1.gif', description: 'hw_tile_1_description', icon: 'resources/entities_small/grounds/floors/star/hw_tile_1.gif' },
                    { name: 'hw_tile_2', url: 'resources/entities/grounds/floors/star/hw_tile_2.gif', description: 'hw_tile_2_description', icon: 'resources/entities_small/grounds/floors/star/hw_tile_2.gif' },
                    { name: 'hw_tile_3', url: 'resources/entities/grounds/floors/star/hw_tile_3.gif', description: 'hw_tile_3_description', icon: 'resources/entities_small/grounds/floors/star/hw_tile_3.gif' },
                  ]
                }
              ]
            },
            {
              name: "type_rug",
              themes: [
                {
                  name: "theme_japanese",
                  furnitures: [
                    { name: 'jp_tatami_large', url: 'resources/entities/grounds/rugs/japanese/jp_tatami_large.gif', description: 'jp_tatami_large_description', icon: 'resources/entities_small/grounds/rugs/japanese/jp_tatami_large.gif' },
                    { name: 'jp_tatami_small', url: 'resources/entities/grounds/rugs/japanese/jp_tatami_small.gif', description: 'jp_tatami_small_description', icon: 'resources/entities_small/grounds/rugs/japanese/jp_tatami_small.gif' },
                  ]
                },
                {
                  name: "theme_default",
                  furnitures: [
                    { name: 'bear_rug_blue', url: 'resources/entities/grounds/rugs/others/bear_rug_blue.gif', description: 'bear_rug_blue_description', icon: 'resources/entities_small/grounds/rugs/others/bear_rug_blue.gif' },
                    { name: 'bear_rug_mint', url: 'resources/entities/grounds/rugs/others/bear_rug_mint.gif', description: 'bear_rug_mint_description', icon: 'resources/entities_small/grounds/rugs/others/bear_rug_mint.gif' }
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

        return "<li data-name='"+category.name+"' data-i18n='"+category.name+"'></li>";
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
        "<p><span data-i18n='entityInStock'></span> "+$(elt).data('instock')+"</p>"+
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
        $(self.inventory).find('.furnitures').append(
          "<li data-furniture='"+furniture.name+"' data-selector='"+category.selector+"' data-img='"+furniture.url+"' data-description='"+furniture.description+"' data-instock='"+furniture.in_stock+"'>"+
            "<img src='"+furniture.icon+"' />"+
          "</li>");
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
    var self = this;
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
