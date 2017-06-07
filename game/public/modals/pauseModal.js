var PauseModal = function() {};
PauseModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    this.create("<div class='modal' id='pause-modal' style='display: none;'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window modal-window-circle'>"+
          "<div class='header'>"+
            "<span class='title'>Pause</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<ul class='content menu-options'>"+
            "<li class='default menu-option'><i class='fa fa-sign-out'></i></li>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
  }
});
