var MapModal = function() {};
MapModal.prototype = {
  init: function() {
    var self = this;
    self.modal = $("<div class='modal modal-lg' id='map-modal' style='display:none;'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>Map</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='container'>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(Constants.gameSelector).append(self.modal);
    $(self.modal).find('.close').click(function() {
      $(self.modal).toggle();
    });
  },
  toggle() {
    $(this.modal).toggle();
  }
};
