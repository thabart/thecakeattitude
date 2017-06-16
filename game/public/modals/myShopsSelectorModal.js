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
            "<div class='slider-container'>" +
              "<div class='my-shops-slider'>"+
                "<div><div class='shop-cell-container'><div class='shop-cell'>shop1</div></div></div>"+
                "<div><div class='shop-cell-container'><div class='shop-cell'>shop2</div></div></div>"+
                "<div><div class='shop-cell-container'><div class='shop-cell'>shop3</div></div></div>"+
                "<div><div class='shop-cell-container'><div class='shop-cell'>shop4</div></div></div>"+
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
    var slick = $(self.modal).find('.my-shops-slider').slick({
      infinite: false,
      accessibility: false,
      slidesToShow: 3,
      slidesToScroll: 3
    });
    $(self.modal).find('.slick-prev').trigger('click');
    $(self.modal).find('.shop-cell').click(function() {
      $(self.modal).find('.shop-cell').removeClass('shop-cell-active');
      $(this).addClass('shop-cell-active');
    });
    $(self.modal).find('.go-to-the-shop').click(function() {

    });
    $(self.modal).find('.create-shop').click(function() {
      $(self).trigger('createShop');
    });
  }
});
