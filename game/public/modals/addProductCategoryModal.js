'use strict';
var AddProductcategoryModal = function() { };
AddProductcategoryModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function(shopSectionName) {
    var self = this;
    var title = $.i18n('addProductcategoryModalTitle'),
      name = $.i18n('name'),
      description = $.i18n('description'),
      addProductCategory = $.i18n('addProductCategory'),
      error = $.i18n('');
    self.shopSectionName = shopSectionName;
    self.create("<div class='modal modal-lg md-effect-1'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='alert-error'><b>"+error+" </b><span class='message'></span><span class='close'><i class='fa fa-times'></i></span></div>"+
          "<div class='sk-cube-grid add-product-category-loader'>"+
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
          "<form class='form-add-product-category'>"+
            "<div class='content'>"+
              "<div>"+
                "<label>"+name+"</label>"+
                "<input type='text' name='name' class='input-control' />"+
              "</div>"+
              "<div>"+
                "<label>"+description+"</label>"+
                "<textarea name='description' class='input-control' />"+
              "</div>"+
            "</div>"+
            "<div class='footer'>"+
              "<button class='action-btn'>"+addProductCategory+"</button>"+
            "</div>"+
          "</form>"+
        "</div>"+
      "</div>"+
    "</div>");

    self.displayLoading(false);
    $(self.modal).find('.form-add-product-category').submit(function(e) {
      e.preventDefault();
      var name = $(self.modal).find("input[name='name']").val(),
        description = $(self.modal).find("textarea[name='description']").val();
      var shop = $.extend(true, {}, ShopMapStateStore.getShop());
      var category = {
        id: Guid.generate(),
        name: name,
        description: description,
        shop_section_name: self.shopSectionName
      };
      var productCategories = shop.product_categories;
      if (!productCategories || !(productCategories instanceof Array)) {
        productCategories = [];
      }

      productCategories.push(category);
      shop.product_categories = productCategories;
      self.displayLoading(true);
      var accessToken = sessionStorage.getItem(Constants.sessionName);
      var commonId = Guid.generate();
      ShopClient.updateShop(shop.id, shop, accessToken, commonId).then(function() {
        self.displayLoading(false);
        self.toggle();
      }).fail(function() {
        self.displayLoading(false);
        self.displayError($.i18n('error-addProductCategory'));
      });
    });
    $(self.modal).find('.alert-error .close').click(function(e) {
      self.hideError();
    });
  },
  displayLoading: function(b) {
    var self = this;
    var loader = $(self.modal).find('.add-product-category-loader'),
      tabContent = $(self.modal).find('.content');
    if (b) {
      loader.show();
      tabContent.hide();
    } else {
      loader.hide();
      tabContent.show();
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
  reset: function() {
    var self = this;
    $(self.modal).find("input[name='name']").val(''),
    $(self.modal).find("textarea[name='description']").val('');
  },
  show: function() {
    var self = this;
    self.toggle();
    self.hideError();
    self.displayLoading(false);
    self.reset();
  }
});
