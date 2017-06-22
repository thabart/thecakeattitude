'use strict';
var SelectCategory = function() { };
SelectCategory.prototype = {
  render: function(opts) {
    var self = this,
      selectCategory = $.i18n('selectCategory'),
      selectSubCategory = $.i18n('selectSubCategory'),
      selectMap = $.i18n('selectMap');
    self.component = $("<div>"+
      "<div class='col-4'>"+
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
        "<div class='category-selector-container'>"+
          "<label>"+selectCategory+"</label>"+
          "<select size='4' class='selector category-selector'>"+
          "</select>"+
        "</div>"+
      "</div>"+
      "<div class='col-4'>"+
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
        "<div class='sub-category-selector-container'>"+
          "<label>"+selectSubCategory+"</label>"+
          "<select size='4' class='sub-category-selector selector'>"+
          "</select>"+
        "</div>"+
      "</div>"+
      "<div class='col-4'>"+
        "<div class='sk-cube-grid map-loader'>"+
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
        "<div class='map-selector-container'>"+
          "<label>"+selectMap+"</label>"+
          "<select size='4' class='map-selector selector'>"+
          "</select>"+
        "</div>"+
      "</div>"+
    "</div>");
    var categorySelector = $(self.component).find('.category-selector'),
      subCategorySelector = $(self.component).find('.sub-category-selector'),
      mapSelector = $(self.component).find('.map-selector');
    var init = function() {
      CategoryClient.getCategoryParents().then(function(r) { // Display the categories.
        var categories = r._embedded.map(function(c) { return "<option value='"+c.id+"'>"+c.name+"</option>"; });
        categorySelector.append("<option></option>");
        categories.forEach(function(category) { categorySelector.append(category); });
        self.isCategoryLoading(false);
        self.isSubCategoryLoading(false);
        self.isMapLoading(false);
        $(self).trigger('initialized');
      });
    };
    categorySelector.empty();
    subCategorySelector.empty();
    mapSelector.empty();
    self.isCategoryLoading(true);
    categorySelector.change(function() { // Display sub category when category changed.
      var categoryId = $(this).find(':selected').val();
      if (!categoryId) {
        return;
      }

      $(self).trigger('categorySelected');
      subCategorySelector.empty();
      mapSelector.empty();
      self.isSubCategoryLoading(true);
      CategoryClient.getCategory(categoryId).then(function(cat) {
        var subCategories = cat._embedded.children.map(function(c) { return "<option value='"+c.id+"'>"+c.name+"</option>"; });
        subCategories.forEach(function(category) { subCategorySelector.append(category); });
        self.isSubCategoryLoading(false);
        $(self).trigger('subCategoriesLoaded');
      });
    });
    subCategorySelector.change(function() { // Display maps when the sub category changed.
      var categoryId = $(this).find(':selected').val();
      self.isMapLoading(true);
      CategoryClient.getCategory(categoryId).then(function(cat) {
        mapSelector.empty();
        var maps = cat._embedded.maps.map(function(map) { return "<option data-name='"+map.map_name+"' data-map='"+Constants.apiUrl + map.map_link+"' data-categoryid='"+cat._embedded.id+"' data-overview='"+Constants.apiUrl + map.overview_link+"'>"+map.map_name+"</option>"; });
        maps.forEach(function(map) { mapSelector.append(map); });
        self.isMapLoading(false);
        $(self).trigger('mapsLoaded', [ cat ]);
      });
    });
    mapSelector.change(function() {
      var selected = $(this).find(':selected');
      $(self).trigger('mapSelected', [ {
        overviewImage: selected.data('overview'),
        categoryid: selected.data('categoryid'),
        mapName: selected.data('name'),
        mapLink: selected.data('map')
      }]);
    });
    init();
    return self.component;
  },
  isCategoryLoading: function(b) { // Display or hide category loader.
    this.isLoading(b, ".category-loader", ".category-selector-container");
  },
  isSubCategoryLoading: function(b) { // Display or hide sub category loader.
    this.isLoading(b, '.sub-category-loader', '.sub-category-selector-container');
  },
  isMapLoading: function(b) { // Display or hide map loader.
    this.isLoading(b, '.map-loader', '.map-selector-container');
  },
  isLoading: function(b, loaderSelector, contentSelector) { // Common method used to display or hide loader.
    var loader = $(this.component).find(loaderSelector),
      content = $(this.component).find(contentSelector);
    if (b) {
      loader.show();
      content.hide();
      return;
    }

    loader.hide();
    content.show();
  }
};
