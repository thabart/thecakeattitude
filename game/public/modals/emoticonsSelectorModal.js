var EmoticonsSelectorModal = function() { };
EmoticonsSelectorModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this,
      title = $.i18n('emoticonSelectorModalTitle');
    var emoticons = [];
    Constants.emoticons.forEach(function(emoticon) {
      emoticons.push("<div class='col-3 emoticon'><img src='"+emoticon.img+"' /><br />"+emoticon.cmd+"</div>");
    });
    self.create("<div class='modal modal-lg' id='emoticons-selector-modal' style='display:none;'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='content'>"+
            emoticons.join('') +
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
  }
});
