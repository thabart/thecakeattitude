var EditProfileModal = function() { };
EditProfileModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('editProfileModalTitle'),
      update = $.i18n('update'),
      displayedName = $.i18n('displayedName'),
      picture = $.i18n('profilePicture'),
      email = $.i18n('email'),
      homePhoneNumber = $.i18n('home-phone'),
      mobilePhoneNumber = $.i18n('mobile-phone'),
      address = $.i18n('address');
    self.adrSearch = new AddressSearch();
    self.create("<div class='modal modal-lg md-effect-1' id='edit-profile-modal'>"+
    "<div class='modal-content'>"+
      "<div class='modal-window'>"+
        "<div class='header'>"+
          "<span class='title'>"+title+"</span>"+
          "<div class='options'>"+
            "<button class='option close'><i class='fa fa-times'></i></button>"+
          "</div>"+
        "</div>"+
        "<div class='container'>"+
          "<div class='content'>"+
            "<div>"+
              "<label>"+displayedName+"</label>"+
              "<input type='text' class='input-control' />" +
            "</div>"+
            "<div>"+
              "<label>"+picture+"</label>"+
              "<input type='text' class='input-control' />" +
            "</div>"+
            "<div>"+
              "<label>"+email+"</label>"+
              "<input type='text' class='input-control' />" +
            "</div>"+
            "<div>"+
              "<label>"+homePhoneNumber+"</label>"+
              "<input type='text' class='input-control' />" +
            "</div>"+
            "<div>"+
              "<label>"+mobilePhoneNumber+"</label>"+
              "<input type='text' class='input-control' />" +
            "</div>"+
            "<div>"+
              "<label>"+address+"</label>"+
              "<div class='adr-container'></div>"+
            "</div>"+
          "</div>"+
        "</div>"+
        "<div class='footer'>"+
          "<button class='action-btn'>"+update+"</button>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(self.modal).find('.adr-container').append(self.adrSearch.render());
  },
  show: function() {
    var self = this;
    self.toggle();
    self.adrSearch.init();
  }
});
