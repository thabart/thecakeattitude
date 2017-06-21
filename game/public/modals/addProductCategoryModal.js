'use strict';
var AddProductcategoryModal = function() { };
AddProductcategoryModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('addProductcategoryModalTitle');
    self.create("<div class='modal modal-lg md-effect-2'>"+
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
              "<label>Name</label>"+
              "<input type='text' class='input-control' />"+
            "</div>"+
            "<div>"+
              "<label>Description</label>"+
              "<textarea class='input-control' />"+
            "</div>"+
          "</div>"+
          "<div class='footer'>"+
            "<button class='action-btn'>Add</button>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
  }
});