var AddProductModal = function() {};
AddProductModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('addProduct');
    self.create("<div class='modal modal-lg md-effect-1' id='map-modal'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='container'>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
  }
});
