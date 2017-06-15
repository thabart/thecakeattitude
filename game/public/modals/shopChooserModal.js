var ShopChooserModal = function() {};
ShopChooserModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() { // Initialize the component.
    var self = this;
    var _houseLayerName = "Houses";
    var title = $.i18n('shopChooserModalTitle'),
      selectCategory = $.i18n('selectCategory'),
      selectSubCategory = $.i18n('selectSubCategory'),
      goToTheShop = $.i18n('goToTheShop'),
      selectMap = $.i18n('selectMap');
    self.create("<div class='modal modal-lg modal-transparent' id='shop-chooser-modal' style='display:none;'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
          "</div>"+
          "<div class='container'>"+
            "<div>"+
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
            "</div>"+
            "<div>"+
              "<div class='sk-cube-grid overview-loader'>"+
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
              "<div class='map-overview'>"+
                // "<img src='http://localhost:5000/maps/first_shoes_map_overview.png' class='img-overview' />" +
              "</div>"+
            "</div>"+
          "</div>"+
          "<div class='footer'>"+
            "<button class='action-btn'>"+goToTheShop+"</button>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    var categorySelector = $(self.modal).find('.category-selector'),
      subCategorySelector = $(self.modal).find('.sub-category-selector'),
      mapSelector = $(self.modal).find('.map-selector'),
      mapOverview = $(self.modal).find('.map-overview');
    categorySelector.change(function() { // Display sub category when category changed.
      var categoryId = $(this).find(':selected').val();
      $(subCategorySelector).empty();
      $(mapSelector).empty();
      $(mapOverview).empty();
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
    subCategorySelector.change(function() { // Display maps when the sub category changed.
      var categoryId = $(this).find(':selected').val();
      self.isMapLoading(true);
      CategoryClient.getCategory(categoryId).then(function(cat) {
        mapSelector.empty();
        mapOverview.empty();
        var maps = cat._embedded.maps.map(function(map) { return "<option data-map='"+Constants.apiUrl + map.map_link+"' data-categoryid='"+cat._embedded.id+"' data-overview='"+Constants.apiUrl + map.overview_link+"'>"+map.map_name+"</option>"; });
        maps.forEach(function(map) { mapSelector.append(map); });
        self.isMapLoading(false);
      });
    });
    mapSelector.change(function() { // Display the image when the map is selected.
      var selected = $(this).find(':selected');
      var overviewImage = selected.data('overview'),
        categoryid = selected.data('categoryid'),
        mapLink = selected.data('map');
      mapOverview.empty();
      $.when(ShopClient.searchShops({category_id : [ 'azeaze' ] }), $.get(mapLink)).done(function(shops, json) {
        var img = $("<img src='"+overviewImage+"' class='img-overview' />");
        img.bind('load', function() {
          var imgSize = {
            w: $(self.modal).find('.img-overview').width(),
            h: $(self.modal).find('.img-overview').height()
          };
          json = json[0];
          var houses = json.layers.filter(function(layer) { return layer.name === _houseLayerName });
          if (houses.length !== 1) {
            return;
          }

          var embeddedShops = shops._embedded || [];
          if (!(embeddedShops instanceof Array)) {
            embeddedShops = [embeddedShops];
          }

          houses[0].objects.forEach(function(house) {
            var housePosition = {
              x: house.x,
              y: house.y
            };
            var tileMapSize = {
              widthInPixels: json.width * json.tilewidth,
              heightInPixels: json.height * json.tileheight
            };
            var overviewHouseSize = Calculator.getHouseSize(house, tileMapSize, imgSize);
            var coordinate = Calculator.getOverviewPlayerRelativeCoordinate(housePosition, tileMapSize, imgSize);
            var square = $("<div class='place'></div>");
            $(square).css('top', coordinate.y - overviewHouseSize.h - 2);
            $(square).css('left', coordinate.x - 2);
            $(square).css('width', overviewHouseSize.w + "px");
            $(square).css('height', overviewHouseSize.h + "px");
            var shop = embeddedShops.filter(function(s) { return s.place === house.name });
            if (shop.length === 0) {
              $(square).addClass('free-place');
              $(square).click(function() {
                $(self).trigger('freePlace');
              });
            }

            mapOverview.append(square);
          });
        });
        mapOverview.append(img);
      });
    });


    categorySelector.empty();
    subCategorySelector.empty();
    mapSelector.empty();
    self.isCategoryLoading(true);
    CategoryClient.getCategoryParents().then(function(r) { // Display the categories.
      var categories = r._embedded.map(function(c) { return "<option value='"+c.id+"'>"+c.name+"</option>"; });
      categorySelector.append("<option></option>");
      categories.forEach(function(category) { categorySelector.append(category); });
      self.isCategoryLoading(false);
      self.isSubCategoryLoading(false);
      self.isMapLoading(false);
      self.isOverviewLoading(false);
    });
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
  isOverviewLoading: function(b) { // Display or hide overview image.
    this.isLoading(b, '.overview-loader', '.map-overview');
  },
  isLoading: function(b, loaderSelector, contentSelector) { // Common method used to display or hide loader.
    var loader = $(this.modal).find(loaderSelector),
      content = $(this.modal).find(contentSelector);
    if (b) {
      loader.show();
      content.hide();
      return;
    }

    loader.hide();
    content.show();
  }
});
