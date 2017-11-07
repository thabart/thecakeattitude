game.Menu = game.Menu || {};
game.Menu.InventoryBox = me.Object.extend({
  init: function() {
      var self = this;
      this.categories = me.loader.getJSON("furnitures");
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
      $(this.inventory).draggable({ "handle": ".top" });
      $(this.inventory).i18n();
      game.Stores.GameStore.listenActiveEntityChanged(this.updateActiveEntity.bind(this));
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
      game.Stores.GameStore.setActiveEntity($(elt).data('furniture'), $(elt).data('selector'), $(elt).data('interaction'), false);
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
          "<li data-furniture='"+furniture.name+"'"+
              "data-selector='"+category.selector+"' data-img='"+furniture.url+"' data-description='"+furniture.description+"'"+
              "data-instock='"+furniture.in_stock+"' data-interaction='"+(type.interaction || '')+"'>"+
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
    var regionName = game.Stores.GameStore.getActiveEntity();
    if (regionName) { return; }
    if (!this.inventory) { return; }
    $(this.inventory).find('.items > li').removeClass('active');
  },
  destroy: function() {
    if (this.inventory) $(this.inventory).remove();
    if (this.update) game.Stores.GameStore.unsubscribeActiveEntityChanged(this.update.bind(this));   
  }
});
