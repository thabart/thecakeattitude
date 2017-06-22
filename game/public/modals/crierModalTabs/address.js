'use strict';
var CrierModalAddressTab = function() { };
CrierModalAddressTab.prototype = {
  render: function() {
    var previous = $.i18n('previous'),
      addAnnounce = $.i18n('addAnnounce'),
      self = this;
    self.addressSearch = new AddressSearch();
    self.tab = $("<div>"+
      "<div class='container'>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn add'>"+addAnnounce+"</button>"+
      "</div>"+
    "</div>");
    $(self.tab).find('.container').append(self.addressSearch.render());
    $(self.tab).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(self.tab).find('.add').click(function() {
      $(self).trigger('confirm');
    });
    return self.tab;
  },
  init: function() {
    this.addressSearch.init();
  }
};
