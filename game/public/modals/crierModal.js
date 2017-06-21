'use strict';
var CrierModal = function() {};
CrierModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('crierModalTitle'),
      addAnnounce = $.i18n('addAnnounce'),
      description = $.i18n('description'),
      address = $.i18n('address');
    self.create("<div class='modal modal-lg md-effect-2' id='map-modal'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<ul class='progressbar'>"+
            "<li class='col-3'>"+description+"</li>"+
            "<li class='col-3'>"+address+"</li>"+
          "</ul>"+
          "<div class='sk-cube-grid crier-loader'>"+
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
          "<div class='tab-content'>"+

          "</div>"+
          "<div class='footer'>"+
            "<button class='action-btn'>"+addAnnounce+"</button>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    self.displayLoading(false);
  },
  displayLoading: function(b) {
    var self = this;
    var loader = $(self.modal).find('.crier-loader'),
      tabContent = $(self.modal).find('.tab-content');
    if (b) {
      loader.show();
      tabContent.hide();
    } else {
      loader.hide();
      tabContent.show();
    }
  }
});
