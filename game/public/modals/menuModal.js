var MenuModal = function() { };
MenuModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this,
      title = $.i18n('menuModalTitle'),
    	yourShops = $.i18n('yourShops'),
      doYourShopping = $.i18n('doYourShopping');
    self.create("<div class='modal modal-transparent' id='menu-modal' style='display: none;'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window modal-window-circle'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
          "</div>"+
          "<div class='content'>"+
            "<ul class='list no-border center-text'>"+
              "<li><button class='action-btn lg-action-btn your-shops'>"+yourShops+"</button></li>"+
              "<li><button class='action-btn lg-action-btn do-your-shop'>"+doYourShopping+"</button></li>"+
            "</ul>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(self.modal).find('.your-shops').click(function() {
      $(self).trigger('viewYourShops');
    });
    $(self.modal).find('.do-your-shop').click(function() {
      $(self).trigger('shopping');
    });
  }
});
