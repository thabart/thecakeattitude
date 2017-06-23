var ShopChooserModal = function() {};
ShopChooserModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() { // Initialize the component.
    var self = this;
    var _houseLayerName = "Houses";
    var title = $.i18n('shopChooserModalTitle'),
      selectCategory = $.i18n('selectCategory'),
      selectSubCategory = $.i18n('selectSubCategory'),
      goToTheShop = $.i18n('goToTheShop'),
      takeThePlace = $.i18n('takeThePlace'),
      viewShop = $.i18n('viewShop'),
      selectPlaceLegendary = $.i18n('selectPlaceLegendary'),
      selectMap = $.i18n('selectMap');
    self.selectCategory = new SelectCategory();
    self.create("<div class='modal modal-lg modal-transparent md-effect-2' id='shop-chooser-modal'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
          "</div>"+
          "<div class='container'>"+
            "<div class='select-category-container'></div>"+
            "<div>"+
              "<p>"+selectPlaceLegendary+"</p>"+
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
              "<div class='map-overview'></div>"+
            "</div>"+
          "</div>"+
          "<div class='footer'>"+
            "<button class='action-btn go-to-the-shop'>"+goToTheShop+"</button>"+
            "<button class='action-btn view-shop'>"+viewShop+"</button>"+
            "<button class='action-btn take-the-place'>"+takeThePlace+"</button>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    var mapOverview = $(self.modal).find('.map-overview'),
      takeThePlace = $(self.modal).find('.take-the-place')
      goToTheShop = $(self.modal).find('.go-to-the-shop'),
      viewTheShop = $(self.modal).find('.view-shop');
    self.informerModal = new InformerModal();
    self.informerModal.init();
    $(self.modal).find('.select-category-container').append(self.selectCategory.render());
    $(self.selectCategory).on('initialized', function() {
      self.isOverviewLoading(false);
      self.disableGoToTheShop(true);
      self.disableTakeThePlace(true);
      self.disableViewShop(true);
    });
    $(self.selectCategory).on('categorySelected', function() {
      self.disableGoToTheShop(true);
      self.disableViewShop(true);
      self.disableTakeThePlace(true);
      mapOverview.empty();
    });
    $(self.selectCategory).on('mapsLoaded', function() {
      self.disableGoToTheShop(true);
      self.disableTakeThePlace(true);
      self.disableViewShop(true);
      mapOverview.empty();
    });
    $(self.selectCategory).on('mapSelected', function(e, data) { // Display the image when the map is selected.
      var categoryid = data.categoryid,
        overviewImage = data.overviewImage,
        mapName = data.mapName,
        mapLink = data.mapLink;
      mapOverview.empty();
      self.disableGoToTheShop(true);
      self.disableTakeThePlace(true);
      $.when(ShopClient.searchShops({category_id : [ categoryid ] }), $.get(mapLink)).done(function(shops, json) {
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
            $(square).data('category', categoryid);
            var shop = embeddedShops.filter(function(s) { return s.place === house.name });
            if (shop.length === 0) { // Free place.
              $(square).addClass('free-place');
              $(square).data('id', house.name);
              $(square).data('mapName', mapName);
              $(square).click(function() {
                mapOverview.find('.place').removeClass('selected-place');
                $(this).addClass('selected-place');
                self.disableGoToTheShop(true);
                self.disableViewShop(true);
                self.disableTakeThePlace(false);
              });
            } else if (shop[0].shop_map) { // Shop exists.
              $(square)[0].shop = shop[0];
              $(square).data('map', Constants.apiUrl + shop[0].shop_map.map_link);
              $(square).data('overview', Constants.apiUrl + shop[0].shop_map.overview_link);
              $(square).data('place', shop[0].place);
              $(square).click(function() {
                mapOverview.find('.place').removeClass('selected-place');
                $(this).addClass('selected-place');
                self.disableGoToTheShop(false);
                self.disableViewShop(false);
                self.disableTakeThePlace(true);
              });
            }

            mapOverview.append(square);
          });
        });
        mapOverview.append(img);
      });
    });
    takeThePlace.click(function() { // Send an event "takeThePlace".
      var selectedPlace = $(self.modal).find('.selected-place');
      $(self).trigger('freePlace', [{
        categoryId: selectedPlace.data('category'),
        mapName: selectedPlace.data('mapName'),
        id: selectedPlace.data('id')
      }]);
    });
    goToTheShop.click(function() { // Go to the shop.
      var selectedPlace = mapOverview.find('.selected-place');
      var shop = selectedPlace[0].shop;
      var json = {
        map_link: selectedPlace.data('map'),
        overview_link: selectedPlace.data('overview'),
        others: {
          categoryId : selectedPlace.data('category'),
          typeMap: 'shop',
          place: selectedPlace.data('place'),
          shop: shop
        },
        isMainMap: false
      };
      $(self).trigger('goToTheShop', [json]);
    });
    viewTheShop.click(function() { // View the shop.
      var selectedPlace = $(self.modal).find('.selected-place');
      var shopId = selectedPlace[0].shop.id;
      self.informerModal.show(shopId);
    });

    self.disableGoToTheShop(true);
    self.disableTakeThePlace(true);
    self.disableViewShop(true);
  },
  isOverviewLoading: function(b) { // Display or hide overview image.
    this.isLoading(b, '.overview-loader', '.map-overview');
  },
  disableGoToTheShop: function(b) {
    $(this.modal).find('.go-to-the-shop').prop('disabled', b);
  },
  disableTakeThePlace: function(b) {
    $(this.modal).find('.take-the-place').prop('disabled', b);
  },
  disableViewShop: function(b) {
    $(this.modal).find('.view-shop').prop('disabled', b);
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
  },
  remove() {
    var self = this;
    $(self.modal).remove();
    self.informerModal.remove();
  }
});
