var PauseModal = function() {};
PauseModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var goToMainMap = $.i18n('navToMainMap'),
      exit = $.i18n('exit'),
      title = $.i18n('mapModalTitle'),
      self = this;
    self.create("<div class='modal md-effect-2' id='pause-modal'>"+
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
              "<li><button class='action-btn lg-action-btn go-to-main-map'>"+ goToMainMap +"</button></li>"+
              "<li><button class='action-btn lg-action-btn exit'>"+ exit +"</button></li>"+
            "</ul>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(self.modal).find('.go-to-main-map').click(function() {
      $(self).trigger('goToMainMap');
    });
    $(self.modal).find('.exit').click(function() {
      $(self).trigger('exit');
    });
  }
});
