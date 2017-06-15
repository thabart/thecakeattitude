var ShopChooserModal = function() {};
ShopChooserModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('shopChooserModalTitle'),
      selectCategory = $.i18n('selectCategory'),
      selectSubCategory = $.i18n('selectSubCategory'),
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
                "<label>"+selectCategory+"</label>"+
                "<select size='4' class='selector category-selector'>"+
                "</select>"+
              "</div>"+
              "<div class='col-4'>"+
                "<label>"+selectSubCategory+"</label>"+
                "<select size='4' class='sub-category-selector selector'>"+
                "</select>"+
              "</div>"+
              "<div class='col-4'>"+
                "<label>"+selectMap+"</label>"+
                "<select size='4' class='map-selector selector'>"+
                "</select>"+
              "</div>"+
            "</div>"+
            "<div>"+
              "<div class='map-overview'>"+
                "<img src='http://localhost:5000/maps/first_shoes_map_overview.png' class='img-overview' />" +
              "</div>"+
            "</div>"+
          "</div>"+
          "<div class='footer'>"+

          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    // fake category id : a20ab67b-f046-40c5-b5cd-566b3fca2749
    var fakeCategoryId = "a20ab67b-f046-40c5-b5cd-566b3fca2749";
    $.when(ShopClient.searchShops({category_id : [ fakeCategoryId ] }), CategoryClient.getCategory(fakeCategoryId)).done(function(shops, category) {
      var mapLink = category._embedded.maps[0].map_link; // Take first map ...
      $.get(Constants.apiUrl + mapLink).then(function(json) {
        var houses = json.layers.filter(function(layer) { return layer.name === 'Houses' });
        if (houses.length !== 1) {
          return;
        }

        var embeddedShops = shops._embedded || [];
        if (!(embeddedShops instanceof Array)) {
          embeddedShops = [embeddedShops];
        }

        houses[0].objects.forEach(function(house) {
          var img = $(self.modal).find('.img-overview');
          var housePosition = {
            x: house.x,
            y: house.y
          };
          var tileMapSize = {
            widthInPixels: json.width * json.tilewidth,
            heightInPixels: json.height * json.tileheight
          };
          var imgSize = {
            w: img.width(),
            h: img.height()
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
          }

          $(self.modal).find('.map-overview').append(square);
        });
      });
    }).fail(function() {

    });
  }
});
