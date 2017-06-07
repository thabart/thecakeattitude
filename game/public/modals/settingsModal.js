var SettingsModal = function() {};
SettingsModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    this.create("<div class='modal' style='display:none;'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>Settings</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='content'>"+
            "<ul class='list'><li>Enable music</li></ul>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
  }
});
