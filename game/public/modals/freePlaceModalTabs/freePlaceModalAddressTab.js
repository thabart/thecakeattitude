var FreePlaceModalAddressTab = function() {};
FreePlaceModalAddressTab.prototype = {
  render: function() {
    var next = $.i18n('next'),
      previous = $.i18n('previous'),
      self = this;
    self.adrSearch = new AddressSearch();
    this.tab = $("<div class='container'>"+
      "<div class='adr-container'></div>"+
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn next'>"+next+"</button>"+
      "</div>"+
    "</div>");
    $(self.tab).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(self.tab).find('.next').click(function() {
      var json = self.adrSearch.getAddress();
      json['google_place_id'] = self.adrSearch.getGooglePlaceId();
      $(self).trigger('next', [ json ]);
    });
    $(self.tab).find('.adr-container').append(self.adrSearch.render());
    $(self.adrSearch).on('error', function() {
      self.disableNextBtn(true);
    });
    $(self.adrSearch).on('success', function() {
      self.disableNextBtn(false);
    });
    $(self.adrSearch).on('initialized', function() {
      self.isInit = true;
    });
    GameStateStore.onUserChanged.call(self, function(user) {
      self.adrSearch.setGooglePlaceId(user.google_place_id);
    });
    return self.tab;
  },
  disableNextBtn: function(b) {
    $(this.tab).find('.next').prop('disabled', b);
  },
  init: function() {
    var self = this;
    if (self.isInit) return;
    self.disableNextBtn(true);
    self.adrSearch.init();
  },
  destroy: function() {
    GameStateStore.offUserChanged.call(this);
  }
};
