var MyShopsSelectorModal = function() { };
MyShopsSelectorModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this,
      title = $.i18n('myShopsSelectorModalTitle'),
      createShop = $.i18n('createShop'),
      goToTheShop = $.i18n('goToTheShop');
    self.create("<div class='modal modal-lg modal-transparent md-effect-2' id='my-shops-selector-modal'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
          "</div>"+
          "<div class='content'>"+
            "<div class='sk-cube-grid mine-shops-loader'>"+
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
            "<div class='slider-container'>" +
              "<div class='my-shops-slider'>"+
              "</div>"+
            "</div>"+
          "</div>"+
          "<div class='footer'>"+
            "<button class='action-btn create-shop'>"+createShop+"</button>" +
            "<button class='action-btn go-to-the-shop'>"+goToTheShop+"</button>" +
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    var myShopsSlider = $(self.modal).find('.my-shops-slider');
    $(self.modal).find('.slick-prev').trigger('click');
    $(self.modal).find('.go-to-the-shop').prop('disabled', true);
    $(self.modal).find('.go-to-the-shop').click(function() {
      var selectedShop = $(self.modal).find('.shop-cell-active');
      if (!selectedShop || selectedShop.length === 0) return;
      var json = {
        map_link: selectedShop.data('map'),
        overview_link: selectedShop.data('overview'),
        categoryId : selectedShop.data('category'),
        typeMap: 'shop',
        isMainMap: false
      };
      $(self).trigger('goToTheShop', [json]);
    });
    $(self.modal).find('.create-shop').click(function() {
      $(self).trigger('createShop');
    });
    var accessToken = sessionStorage.getItem(Constants.sessionName);
    self.isShopsLoading(true);
    ShopClient.getMineShops(accessToken).then(function(obj) { // Display mine shops.
      self.isShopsLoading(false);
      var shops = obj._embedded;
      if (!(shops instanceof Array)) {
        shops = [shops];
      }

      shops.forEach(function(shop) {
        var profileImage = shop.profile_image || '/styles/images/default-store.png';
        var shopCategory = $.i18n('shopCategory').replace('{0}', shop.category.name);
        myShopsSlider.append("<div><div class='shop-cell-container'>"+
          "<div class='shop-cell'"+
            " data-map='"+Constants.apiUrl + shop.map.map_link+"'"+
            " data-overview='"+Constants.apiUrl + shop.map.overview_link+"'"+
            " data-category='"+Constants.apiUrl + shop.category_id+"'>"+shop.name+"<br /><img src='"+profileImage+"' /><br/><span>"+shopCategory+"</span></div>"+
          "</div>"+
        "</div>");
      });
      var slick = myShopsSlider.slick({
        infinite: false,
        accessibility: false,
        slidesToShow: 3,
        slidesToScroll: 3
      });
      $(self.modal).find('.shop-cell').click(function() {
        $(self.modal).find('.go-to-the-shop').prop('disabled', false);
        $(self.modal).find('.shop-cell').removeClass('shop-cell-active');
        $(this).addClass('shop-cell-active');
      });
    });
  },
  isShopsLoading: function(b) {
    var self = this;
    var loader = $(self.modal).find('.mine-shops-loader');
    var content = $(self.modal).find('.slider-container');
    if (b) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  }
});
