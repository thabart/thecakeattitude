'use strict';
var ManageOffersModal = function() { };
ManageOffersModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('manageOffersModalTitle');
    self.create("<div class='modal modal-lg md-effect-1'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='container'>"+
            "<div class='content'>"+
              "<img src='/styles/images/under-construction.png' />"+
            "</div>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
  }
});
