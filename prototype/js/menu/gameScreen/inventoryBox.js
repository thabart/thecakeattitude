game.Menu = game.Menu || {};
game.Menu.InventoryBox = me.Object.extend({
  init: function() {
      var self = this;
      var gameEntities = game.Stores.GameStore.getGameEntities();
      var shop = game.Stores.GameStore.getShopInformation();
      this.entities = me.loader.getJSON("entities");
      this.categories = me.loader.getJSON("categories");
      this.entities.forEach(function(entity) {
        var gameEntity = gameEntities.filter(function(ge) { return ge.name === entity.name; })[0];
        var shopGameEntities = shop['game_entities'].filter(function(ge) { return ge.name === entity.name; });
        var inStock = 0;
        if (gameEntity && !gameEntity.is_shelf) {
          inStock = gameEntity['max_available_in_stock'] - shopGameEntities.length;
        }
        else if (gameEntity && gameEntity.is_shelf) {
          inStock = shop['product_categories'].length - shopGameEntities.length;
        }

        entity.is_shelf = gameEntity.is_shelf;
        entity.in_stock = inStock;
      });
      var indice = 0;
      var tabs = this.categories.map(function(category) {
        if (indice === 0) {
          indice++;
          return "<li class='active' data-name='"+category.name+"' data-i18n='"+category.name+"'></li>";
        }

        return "<li data-name='"+category.name+"' data-i18n='"+category.name+"'></li>";
      }).join('');
      this.inventory = $("<div class='modal blue lg inventory-box'>"+
        "<div class='container'>"+
          "<div class='content'>"+
            "<div class='top'>"+
              "<span data-i18n='inventory_title'></span> <div class='close'></div>"+
            "</div>"+
            "<div class='body'>"+
              "<ul class='tabs'>"+
                tabs +
              "</ul>"+
              "<div class='content'>"+
                "<div class='filter'>"+
                  "<label>Type</label>"+
                  "<div class='input'>"+
                    "<div class='top'></div>"+
                    "<div class='body'>"+
                      "<select class='type-selector'>"+
                      "</select>"+
                    "</div>"+
                    "<div class='bottom'></div>"+
                  "</div>"+
                  "<label data-i18n='theme'></label>"+
                  "<div class='input'>"+
                    "<div class='top'></div>"+
                    "<div class='body'>"+
                      "<select class='theme-selector'>"+
                      "</select>"+
                    "</div>"+
                    "<div class='bottom'></div>"+
                  "</div>"+
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
          "</div>"+
        "</div>"+
      "</div>");
      $(document.body).append(this.inventory);
      this.addListeners();
      $(this.inventory).find('.tabs li:first-child').click();
      $(this.inventory).hide();
      $(this.inventory).draggable({ "handle": ".container > .content > .top" });
      $(this.inventory).i18n();
      this.updateActiveEntityB = this.updateActiveEntity.bind(this);
      this.addEntityB = this.addEntity.bind(this);
      this.removeEntityB = this.removeEntity.bind(this);
      game.Stores.GameStore.listenActiveEntityChanged(this.updateActiveEntityB);
      game.Stores.GameStore.listenEntityAdded(this.addEntityB);
      game.Stores.GameStore.listenEntityRemoved(this.removeEntityB);
  },
  addEntity: function(e, obj) {
    var entity = this.entities.filter(function(e) { return e.name === obj.metadata.name; })[0];
    if (!entity) { return; }
    entity.in_stock--;
    $(this.inventory).find('.entity-information .in_stock').html(entity.in_stock);
    if (entity.in_stock === 0) {
      $(this.inventory).find('.entity-information .button').hide();
    }
  },
  removeEntity: function(e, obj) {
    var entity = this.entities.filter(function(e) { return e.name === obj.metadata.name; })[0];
    if (!entity) { return; }
    entity.in_stock++;
    $(this.inventory).find('.entity-information .in_stock').html(entity.in_stock);
    $(this.inventory).find('.entity-information .button').show();
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
    var entity = self.entities.filter(function(e) { return e.name === $(elt).data('name'); })[0];
    var entityInformation = $(self.inventory).find('.entity-information');
    entityInformation.empty();
    var n = $("<div>"+
      "<div class='picture'>"+
        "<img src='"+entity.url+"' />"+
      "</div>"+
      "<div class='action'>"+
        "<b data-i18n='"+entity.description+"'></b>"+
        "<p><span data-i18n='entityInStock'></span> <span class='in_stock'>"+entity.in_stock+"</span></p>"+
        "<p class='product-categories'></p>"+
        "<button class='button button-gray' data-i18n='add_into_shop'></button>"+
      "</div>"+
    "</div>");
    if (entity.is_shelf) {
      var shop = game.Stores.GameStore.getShopInformation();
      var selector = $("<div class='input'>"+
        "<div class='top'></div>"+
        "<div class='body'>"+
          "<select class='product-category-chooser'></select>"+
        "</div>"+
        "<div class='bottom'></div>"+
      "</div>");
      shop['product_categories'].forEach(function(productCategory) {
        $(selector).find('.product-category-chooser').append("<option data-id='"+productCategory.id+"' data-i18n='"+productCategory.name+"'></option>");
      });
      $(n).find('.product-categories').append(selector);
    }

    $(entityInformation).append(n);
    $(n).i18n();
    $(n).find('.button').click(function() {
      var name = $(elt).data('name'),
        selector = $(elt).data('selector');
      var entity = self.entities.filter(function(e) { return e.name === name; })[0];
      if (entity.in_stock === 0) { return; }
      var productCategoryId = $(n).find('.product-category-chooser option:selected').data("id");
      var productCategory = null;
      if (productCategoryId) {
        productCategory = shop['product_categories'].filter(function(pc) { return pc.id === productCategoryId; })[0];
      }

      game.Stores.GameStore.setActiveEntity(name, selector, entity.type, false, productCategory);
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
      theme.furnitures.forEach(function(furnitureName) {
        var entity = self.entities.filter(function(e) { return e.name === furnitureName; })[0];
        $(self.inventory).find('.furnitures').append(
          "<li data-name='"+entity.name+"' data-selector='"+category.selector+"'>"+
            "<img src='"+entity.icon+"' />"+
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
    var regionName = game.Stores.GameStore.getActiveEntity();
    if (regionName) { return; }
    if (!this.inventory) { return; }
    $(this.inventory).find('.items > li').removeClass('active');
  },
  destroy: function() {
    if (this.inventory) $(this.inventory).remove();
    if (this.updateActiveEntityB) game.Stores.GameStore.unsubscribeActiveEntityChanged(this.updateActiveEntityB);
    if (this.addEntityB) game.Stores.GameStore.unsubscribeEntityAdded(this.addEntityB);
    if (this.removeEntityB) game.Stores.GameStore.unsubscribeEntityRemoved(this.removeEntityB);
  }
});
