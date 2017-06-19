var FreePlaceModalContactTab = function() {};
FreePlaceModalContactTab.prototype = {
  render: function() {
    var next = $.i18n('next'),
      previous = $.i18n('previous'),
      email = $.i18n('email'),
      mobilePhone = $.i18n('mobile-phone'),
      homePhone = $.i18n('home-phone'),
      informationAreComingFromYourProfile = $.i18n('informationAreComingFromYourProfile'),
      update = $.i18n('update'),
      yesNo = $.i18n('yesNo'),
      self = this;
    self.tab = $("<div class='container'>"+
      "<p><i class='fa fa-exclamation-triangle'/> "+informationAreComingFromYourProfile+"</p>"+
      "<div>"+
        "<label>"+email+"</label>"+
        "<input type='text' class='input-control email' name='email' readonly />"+
      "</div>"+
      "<div>"+
        "<label>"+mobilePhone+"</label>"+
        "<input type='text' class='input-control mobile-phone' name='mobilePhone' readonly  />"+
      "</div>"+
      "<div>"+
        "<label>"+homePhone+"</label>"+
        "<input type='text' class='input-control home-phone' name='homePhone' readonly />"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn next'>"+next+"</button>"+
      "</div>"+
    "</div>");
    $(self.tab).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(self.tab).find('.next').click(function() {
      var user = GameStateStore.getUser();
      var json = {
        email: user.email,
        mobile_phone: user.mobile_phone_number,
        home_home: user.home_phone_number
      };
      $(self).trigger('next', [json]);
    });
    self.setUserInformation();
    GameStateStore.onUserChanged.call(self, function() {
      if (!self.tab) return;
      self.setUserInformation();
    });
    return self.tab;
  },
  setUserInformation: function() {
    var self = this;
    var user = GameStateStore.getUser();
    $(self.tab).find("input[name='email']").val(user.email);
    $(self.tab).find("input[name='mobilePhone']").val(user.mobile_phone_number);
    $(self.tab).find("input[name='homePhone']").val(user.home_phone_number);
  },
  destroy: function() {
    GameStateStore.offUserChanged.call(this);
  }
};
