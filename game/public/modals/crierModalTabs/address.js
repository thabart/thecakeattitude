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
    $(self.addressSearch).on('error', function() {
      self.setDisableAddAnnounce(true);
    });
    $(self.addressSearch).on('success', function() {
      self.setDisableAddAnnounce(false);
    });
    $(self.tab).find('.container').append(self.addressSearch.render());
    $(self.tab).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(self.tab).find('.add').click(function() {
      var adr = self.addressSearch.getAddress();
      var location = self.addressSearch.getLocation();
      var json = {
        place_id: self.addressSearch.getGooglePlaceId(),
        street_address: adr.street_address,
        location: {
          lat: location.lat(),
          lng: location.lng()
        }
      };
      $(self).trigger('confirm', [ { obj: json } ]);
    });
    return self.tab;
  },
  setDisableAddAnnounce: function(b) {
    $(this.tab).find('.add').prop('disabled', b);
  },
  init: function() {
    this.addressSearch.init();
  }
};
