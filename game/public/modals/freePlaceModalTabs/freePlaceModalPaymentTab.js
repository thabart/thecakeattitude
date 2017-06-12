var FreePlaceModalPaymentTab = function() {};
FreePlaceModalPaymentTab.prototype = {
  render: function() {
    var confirm = $.i18n('confirm'),
    previous = $.i18n('previous'),
    self = this;
    var result = $("<div class='container'>"+
      "<div>"+
        "<section class='col-6'>"+
        "</section>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn green-action-btn confirm'>"+confirm+"</button>"+
      "</div>"+
    "</div>");
    $(result).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(result).find('.confirm').click(function() {
      $(self).trigger('confirm');
    });
    return result;
  }
};
