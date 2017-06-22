'use strict';
var AddProductcategoryModal = function() { };
AddProductcategoryModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('addProductcategoryModalTitle'),
      name = $.i18n('name'),
      description = $.i18n('description'),
      addProductCategory = $.i18n('addProductCategory');
    self.create("<div class='modal modal-lg md-effect-1'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='content'>"+
            "<div>"+
              "<label>"+name+"</label>"+
              "<input type='text' class='input-control' />"+
            "</div>"+
            "<div>"+
              "<label>"+description+"</label>"+
              "<textarea class='input-control' />"+
            "</div>"+
          "</div>"+
          "<div class='footer'>"+
            "<button class='action-btn'>"+addProductCategory+"</button>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
  }
});
