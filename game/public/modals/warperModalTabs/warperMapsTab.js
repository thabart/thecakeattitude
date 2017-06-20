var WarperMapsTab = function() {};
WarperMapsTab.prototype = {
  render: function(game) {
    var self = this,
      selectCategory = $.i18n('selectCategory'),
      selectSubCategory = $.i18n('selectSubCategory'),
      selectMap = $.i18n('selectMap'),
      ok = $.i18n('ok');
    self.game = game;
    self.tab = $("<section>"+
      "<div class='container'>"+
        "<div class='sk-cube-grid category-loader'>"+
          "<div class='sk-cube sk-cube1'></div>"+
          "<div class='sk-cube sk-cube2'></div>"+
          "<div class='sk-cube sk-cube3'></div>"+
          "<div class='sk-cube sk-cube4'></div>"+
          "<div class='sk-cube sk-cube5'></div>"+
          "<div class='sk-cube sk-cube6'></div>"+
          "<div class='sk-cube sk-cube7'></div>"+
          "<div class='sk-cube sk-cube8'></div>"+
          "<div class='sk-cube sk-cube9'></div>"+
        "</div>"+
        "<div class='content'>"+
          "<form class='first-column'>"+
            "<label>"+selectCategory+"</label>"+
            "<select size='4' class='selector category-selector'>"+
            "</select>"+
          "</form>"+
          "<div class='second-column'>"+
            "<div class='sk-cube-grid sub-category-loader'>"+
              "<div class='sk-cube sk-cube1'></div>"+
              "<div class='sk-cube sk-cube2'></div>"+
              "<div class='sk-cube sk-cube3'></div>"+
              "<div class='sk-cube sk-cube4'></div>"+
              "<div class='sk-cube sk-cube5'></div>"+
              "<div class='sk-cube sk-cube6'></div>"+
              "<div class='sk-cube sk-cube7'></div>"+
              "<div class='sk-cube sk-cube8'></div>"+
              "<div class='sk-cube sk-cube9'></div>"+
            "</div>"+
            "<div class='sub-categories-content'>"+
              "<label>"+selectSubCategory+"</label>"+
              "<select size='10' class='sub-category-selector selector selector-lg'>"+
              "</select>"+
            "</div>"+
          "</div>"+
          "<div class='map-row'>"+
            "<div class='sk-cube-grid maps-loader'>"+
              "<div class='sk-cube sk-cube1'></div>"+
              "<div class='sk-cube sk-cube2'></div>"+
              "<div class='sk-cube sk-cube3'></div>"+
              "<div class='sk-cube sk-cube4'></div>"+
              "<div class='sk-cube sk-cube5'></div>"+
              "<div class='sk-cube sk-cube6'></div>"+
              "<div class='sk-cube sk-cube7'></div>"+
              "<div class='sk-cube sk-cube8'></div>"+
              "<div class='sk-cube sk-cube9'></div>"+
            "</div>"+
            "<div class='map-content'>"+
              "<label>"+selectMap+"</label>"+
              "<ul class='list-selector map-selector'>"+
              "</ul>"+
            "</div>"+
          "</div>"+
        "</div>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn confirm'>"+ok+"</button>"+
      "</div>"+
    "</section>");
    var subCategorySelector = $(self.tab).find('.sub-category-selector'),
      categorySelector = $(self.tab).find('.category-selector'),
      mapSelector = $(self.tab).find('.map-selector'),
      okBtn = $(self.tab).find('.confirm'),
      confirmButton = $(self.tab).find('.confirm');
    // Display sub categories when the category changed.
    categorySelector.change(function() {
      var categoryId = $(this).find(':selected').val();
      $(confirmButton).prop('disabled', true);
      $(subCategorySelector).empty();
      $(mapSelector).empty();
      if (!categoryId) {
        return;
      }

      self.isSubCategoryLoading(true);
      CategoryClient.getCategory(categoryId).then(function(cat) {
        var subCategories = cat._embedded.children.map(function(c) { return "<option value='"+c.id+"'>"+c.name+"</option>"; });
        subCategories.forEach(function(category) { subCategorySelector.append(category); });
        self.isSubCategoryLoading(false);
      });
    });
    // Display maps when the sub-category changed.
    subCategorySelector.change(function() {
      var categoryId = $(this).find(':selected').val();
      self.isMapLoading(true);
      CategoryClient.getCategory(categoryId).then(function(cat) {
        mapSelector.empty();
        var maps = cat._embedded.maps.map(function(map) { return "<li data-mapname='"+map.map_name+"' data-map='"+Constants.apiUrl + map.map_link+"' data-categoryid='"+cat._embedded.id+"' data-overview='"+Constants.apiUrl + map.overview_link+"'><span>"+map.map_name+"</span><img src='"+ Constants.apiUrl + map.overview_link+"' /></li>"; });
        maps.forEach(function(map) { mapSelector.append(map); });
        self.isMapLoading(false);
        // Enable the OK button + add ".selected" class to li.
        mapSelector.find('li').click(function() {
          mapSelector.find('li').removeClass('selected');
          $(this).addClass('selected');
          $(confirmButton).prop('disabled', false);
        });
      });
    });
    // Raise an event when the user clicks on OK.
    okBtn.click(function() {
      var selectedMap = $(mapSelector).find('.selected');
      var json = {
        map_link: selectedMap.data('map'),
        overview_link: selectedMap.data('overview'),
        isMainMap: false,
        categoryId: selectedMap.data('categoryid'),
        typeMap: 'category',
        mapName: selectedMap.data('mapname')
      };
  		self.game.state.start("SplashGame", true, false, json);
    });
    return self.tab;
  },
  isCategoryLoading: function(b) {
    this.isLoading(b, '.category-loader', '.content');
  },
  isSubCategoryLoading: function(b) {
    this.isLoading(b, '.sub-category-loader', '.sub-categories-content');
  },
  isMapLoading: function(b) {
    var loader = this.isLoading(b, '.maps-loader', '.map-content');
  },
  isLoading: function(b, loaderSelector, contentSelector) {
    var loader = $(this.tab).find(loaderSelector),
      content = $(this.tab).find(contentSelector);
    if (b) {
      loader.show();
      content.hide();
      return;
    }

    loader.hide();
    content.show();
  },
  init: function() {
    var self = this,
      selector = $(self.tab).find('.category-selector'),
      mapSelector = $(self.tab).find('.map-selector'),
      subCategorySelector = $(self.tab).find('.sub-category-selector');
    subCategorySelector.empty();
    selector.empty();
    mapSelector.empty();
    self.isCategoryLoading(true);
    $(self.tab).find('.confirm').prop('disabled', true);
    CategoryClient.getCategoryParents().then(function(r) {
      var categories = r._embedded.map(function(c) { return "<option value='"+c.id+"'>"+c.name+"</option>"; });
      selector.append("<option></option>");
      categories.forEach(function(category) { selector.append(category); });
      self.isCategoryLoading(false);
      self.isSubCategoryLoading(false);
      self.isMapLoading(false);
    });
  }
};
