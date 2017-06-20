var MyShopsSelectorModal = function() { };
MyShopsSelectorModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this,
      title = $.i18n('myShopsSelectorModalTitle'),
      createShop = $.i18n('createShop'),
      goToTheShop = $.i18n('goToTheShop'),
      error = $.i18n('error'),
      success = $.i18n('success'),
      remove = $.i18n('remove');
    self.create("<div class='modal modal-lg modal-transparent md-effect-2' id='my-shops-selector-modal'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
          "</div>"+
          "<div class='content'>"+
            "<div class='alert-error'><b>"+error+" </b><span class='message'></span><span class='close'><i class='fa fa-times'></i></span></div>"+
            "<div class='alert-success'><b>"+success+" </b><span class='message'></span><span class='close'><i class='fa fa-times'></i></span></div>"+
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
            "<button class='action-btn remove'>"+ remove + "</button>"+
            "<button class='action-btn go-to-the-shop'>"+goToTheShop+"</button>" +
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(self.modal).find('.slick-prev').trigger('click');
    $(self.modal).find('.go-to-the-shop').click(function() {
      var selectedShop = $(self.modal).find('.shop-cell-active');
      var json = {
        map_link: selectedShop.data('map'),
        overview_link: selectedShop.data('overview'),
        categoryId : selectedShop.data('category'),
        typeMap: 'shop',
        isMainMap: false
      };
      $(self).trigger('goToTheShop', [json]);
    }); // Navigate to the selected shop.
    $(self.modal).find('.create-shop').click(function() {
      $(self).trigger('createShop');
    }); // Add a new shop.
    $(self.modal).find('.remove').click(function() { // Remove the selected shop.
      var selectedShop = $(self.modal).find('.shop-cell-active');
      var shopId = $(selectedShop).data('id');
      self.isShopsLoading(true);
      var accessToken = sessionStorage.getItem(Constants.sessionName);
      self.commonId = Guid.generate();
      ShopClient.removeShop(accessToken, shopId, self.commonId).then(function() {
        self.isShopsLoading(false);
      }).fail(function() {
        self.displayError($.i18n('error-removeShop'));
        self.isShopsLoading(false);
      });
    });
    $(self.modal).find('.alert-error .close').click(function() { // Hide the error message.
      self.hideError();
    });
    $(self.modal).find('.alert-success .close').click(function() { // Hide the success message.
      self.hideSuccess();
    });
		AppDispatcher.register(function(message) {
			if (message.actionName === 'remove-shop' && message.data && message.data.common_id === self.commonId) {
        self.displaySuccess($.i18n('success-shopRemoved'));
        self.refresh();
			}
		});
    self.refresh();
  },
  refresh: function() {
    var self = this;
    var myShopsSlider = $(self.modal).find('.my-shops-slider');
    var accessToken = sessionStorage.getItem(Constants.sessionName);
    $(self.modal).find('.go-to-the-shop').prop('disabled', true);
    $(self.modal).find('.remove').prop('disabled', true);
    self.isShopsLoading(true);
    myShopsSlider.empty();
    ShopClient.getMineShops(accessToken).then(function(obj) {
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
            " data-map='"+Constants.apiUrl + shop.shop_map.map_link+"'"+
            " data-id='"+shop.id+"'"+
            " data-overview='"+Constants.apiUrl + shop.shop_map.overview_link+"'"+
            " data-category='"+shop.category_id+"'>"+shop.name+"<br /><img src='"+profileImage+"' /><br/><span>"+shopCategory+"</span></div>"+
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
        $(self.modal).find('.remove').prop('disabled', false);
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
  },
  hideError: function() {
    $(this.modal).find('.alert-error').hide();
  },
  displayError: function(message) {
    var errorElt = $(this.modal).find('.alert-error');
    errorElt.find('.message').html(message);
    errorElt.show();
  },
  displaySuccess: function(message) {
    var successElt = $(this.modal).find('.alert-success');
    successElt.find('.message').html(message);
    successElt.show();
  },
  hideSuccess: function() {
    $(this.modal).find('.alert-success').hide();
  },
  remove: function() {
    $(this.modal).remove();
    AppDispatcher.remove();
  }
});
