var FreePlaceModalContactTab = function() {};
FreePlaceModalContactTab.prototype = {
  render: function() {
    var next = $.i18n('next'),
      previous = $.i18n('previous'),
      self = this;
    var result = $("<div class='container'>"+
      "<div>"+
        "<section class='col-6'>"+
        "</section>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn next'>"+next+"</button>"+
      "</div>"+
    "</div>");
    $(result).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(result).find('.next').click(function() {
      $(self).trigger('next');
    });
    return result;
  }
};
