'use strict';
var AddProductCharacteristicTab = function() { };
AddProductCharacteristicTab.prototype = {
  render: function() {
    var self = this,
      previous = $.i18n('previous'),
      addProduct = $.i18n('addProduct'),
      addProductFiltersHelp = $.i18n('addProductFiltersHelp');
    self.tab = $("<div>"+
      "<div class='container'>"+
        "<div class='content'>"+
          "<p>"+addProductFiltersHelp+"</p>"+
        "</div>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn add'>"+addProduct+"</button>"+
      "</div>"+
    "</div>");
    $(self.tab).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(self.tab).find('.add').click(function() {
      $(self).trigger('confirm');
    });
    return self.tab;
  }
};
