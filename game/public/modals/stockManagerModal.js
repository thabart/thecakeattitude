'use strict';
var StockManagerModal = function() { };
StockManagerModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('stockManagerModalTitle'),
      addProduct = $.i18n('addProduct'),
      manageYourProducts = $.i18n('manageYourProducts'),
      manageShopSettings = $.i18n('manageShopSettings');
    self.addProductModal = new AddProductModal();
    self.addProductModal.init();
    self.create("<div class='modal modal-lg md-effect-1'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window modal-window-circle'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='content'>"+
            "<ul class='list no-border center-text'>"+
              "<li><button class='action-btn lg-action-btn add-product'>"+addProduct+"</button></li>"+
              "<li><button class='action-btn lg-action-btn manage-products' disabled>"+manageYourProducts+"</button></li>"+
              "<li><button class='action-btn lg-action-btn manage-settings' disabled>"+manageShopSettings+"</button></li>"+
            "</ul>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(self.modal).find('.add-product').click(function() {
      self.toggle();
      self.addProductModal.toggle();
    });
    $(self.modal).find('.manage-products').click(function(){

    });
    $(self.modal).find('.manage-settings').click(function() {

    });
  },
  remove() {
    $(this.modal).remove();
    this.addProductModal.remove();
  }
});
