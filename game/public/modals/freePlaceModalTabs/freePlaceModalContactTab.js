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
      "<form class='contact-form'>"+
        "<p><i class='fa fa-exclamation-triangle'/> "+informationAreComingFromYourProfile+" <input type='checkbox' class='updateInformation' /> "+yesNo+"</p>"+
        "<div>"+
          "<label>"+email+"</label>"+
          "<span class='error-message'></span>"+
          "<input type='text' class='input-control email' name='email' readonly required />"+
        "</div>"+
        "<div>"+
          "<label>"+mobilePhone+"</label>"+
          "<span class='error-message'></span>"+
          "<input type='text' class='input-control mobile-phone' name='mobilePhone' readonly required />"+
        "</div>"+
        "<div>"+
          "<label>"+homePhone+"</label>"+
          "<span class='error-message'></span>"+
          "<input type='text' class='input-control home-phone' name='homePhone' readonly required />"+
        "</div>"+
      "</form>"+
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn update' disabled>"+update+"</button>"+
        "<button class='action-btn next'>"+next+"</button>"+
      "</div>"+
    "</div>");
    $(self.tab).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(self.tab).find('.next').click(function() {
      self.contactFormValidation.form();
      if (!self.contactFormValidation.valid()) {
        return;
      }

      var json = {
        email: $(self.tab).find('.email').val(),
        mobile_phone: $(self.tab).find('.mobile-phone').val(),
        home_home: $(self.tab).find('.home-phone').val()
      };
      $(self).trigger('next', [json]);
    });
    $(self.tab).find('.update').click(function() {

    });
    $(self.tab).find('.updateInformation').change(function() {
      $(self.tab).find('.email').prop('readOnly', !this.checked);
      $(self.tab).find('.mobile-phone').prop('readOnly', !this.checked);
      $(self.tab).find('.home-phone').prop('readOnly', !this.checked);
      $(self.tab).find('.update').prop('disabled', !this.checked);
    });
    $(self.tab).find('.contact-form').submit(function(e) {
      e.preventDefault();
    });
    self.contactFormValidation = $(self.tab).find('.contact-form');
    self.contactFormValidation.validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        mobilePhone: {
          required: true,
          phone: true
        },
        homePhone: {
          required: true,
          phone: true
        }
      },
      errorPlacement: function(error, elt) {
        error.appendTo(elt.prev());
      }
    });
    return self.tab;
  }
};
