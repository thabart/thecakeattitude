var MapModal = function() {};
MapModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('mapModalTitle');
    self.create("<div class='modal modal-lg md-effect-2' id='map-modal'>"+
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
		GameStateStore.onCurrentMapChanged(function(e, obj) {
      var img = obj.map.game.cache.getImage(obj.map.overviewKey);
      $(self.modal).find('.container').html(img);
		});
  }
});
