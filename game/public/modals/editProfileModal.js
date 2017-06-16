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
      error = $.i18n('error'),
      success = $.i18n('success'),
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
        "<div class='sk-cube-grid profile-updater'>"+
          "<div class='sk-cube sk-cube1'></div>"+
          "<div class='sk-cube sk-cube2'></div>"+
          "<div class='sk-cube sk-cube3'></div>"+
          "<div class='sk-cube sk-cube4'></div>"+
          "<div class='sk-cube sk-cube5'></div>"+
          "<div class='sk-cube sk-cube6'></div>"+
          "<div class='sk-cube sk-cube7'></div>"+
          "<div class='sk-cube sk-cube8'></div>"+
          "<div class='sk-cube sk-cube9'></div>"+
        "</div>"+
        "<div class='alert-error'><b>"+error+" </b><span class='message'></span><span class='close'><i class='fa fa-times'></i></span></div>"+
        "<div class='alert-success'><b>"+success+" </b><span class='message'></span><span class='close'><i class='fa fa-times'></i></span></div>"+
        "<form class='update-profile-form'>"+
          "<div class='container'>"+
            "<div class='content'>"+
              "<div>"+ // Display name + email
                "<div class='col-6'>"+
                  "<label>"+displayedName+"</label>"+
                  "<input type='text' class='input-control'  name='name' />" +
                "</div>"+
                "<div class='col-6'>"+
                  "<label>"+email+"</label>"+
                  "<input type='text' class='input-control' name='email' />" +
                "</div>"+
              "</div>"+
              "<div>"+ // Picture
                "<div class='col-6'>"+
                  "<label>"+picture+"</label>"+
                  "<input type='file' accept='image/*' class='input-control profile-picture-upload' />"+
                "</div>"+
                "<div class='col-6'>"+
                  "<img name='picture' class='profile-picture' />"+
                "</div>"+
              "</div>"+
              "<div>"+ // Phone (mobile + home)
                "<div class='col-6'>"+
                  "<label>"+homePhoneNumber+"</label>"+
                  "<input type='text' class='input-control' name='home_phone_number' />" +
                "</div>"+
                "<div class='col-6'>"+
                  "<label>"+mobilePhoneNumber+"</label>"+
                  "<input type='text' class='input-control' name='mobile_phone_number' />" +
                "</div>"+
              "</div>"+
              "<div>"+
                "<label>"+address+"</label>"+
                "<div class='adr-container'></div>"+
              "</div>"+
            "</div>"+
          "</div>"+
          "<div class='footer'>"+
            "<button class='action-btn update'>"+update+"</button>"+
          "</div>"+
        "</form>"+
      "</div>"+
    "</div>");
    var uploadImage = function(e, callback) {
      e.preventDefault();
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    };
    $(self.modal).find('.alert-error .close').click(function() {
      self.hideError();
    });
    $(self.modal).find('.alert-success .close').click(function() {
      self.hideSuccess();
    });
    $(self.modal).find('.adr-container').append(self.adrSearch.render());
    $(self.modal).find('.update-profile-form').submit(function(e) {
      e.preventDefault();
      var json = {
        google_place_id: self.adrSearch.getGooglePlaceId(),
        address: self.adrSearch.getAddress()
      };
      $(this).serializeArray().map(function(x){json[x.name] = x.value;});
      self.displayProfileUpdater(true);
      UserClient.updateClaims(json, sessionStorage.getItem(Constants.sessionName)).then(function() { // update user information.
        self.displayProfileUpdater(false);
        self.hideError();
        self.displaySuccess($.i18n('success-profileUpdated'));
        var userClaims = $.extend({}, GameStateStore.getUser(), json);
        GameStateStore.setUser(userClaims);
      }).fail(function() {
        self.displayProfileUpdater(false);
        self.hideSuccess();
        self.displayError($.i18n('error-updateUserInformation'));
      });
    });
    $(self.adrSearch).on('error', function() {
      self.disableUpdateBtn(true);
    });
    $(self.adrSearch).on('success', function() {
      self.disableUpdateBtn(false);
    });
    $(self.modal).find('.profile-picture-upload').change(function(e) {
      uploadImage(e, function(b64Img) {
        $(self.modal).find('.profile-picture').attr("src", b64Img);
      });
    });
    self.displayProfileUpdater(false);
    self.hideError();
    self.hideSuccess();
  },
  disableUpdateBtn: function(b) {
    $(this.modal).find('.update').prop('disabled', b);
  },
  setUserInformation: function() {
    var self = this;
    var user = GameStateStore.getUser();
    $(self.modal).find("input[name='name']").val(user.name);
    $(self.modal).find("input[name='email']").val(user.email);
    $(self.modal).find("input[name='home_phone_number']").val(user.home_phone_number);
    $(self.modal).find("input[name='mobile_phone_number']").val(user.mobile_phone_number);
    $(self.modal).find(".profile-picture").attr("src", user.picture || "/styles/images/profile-picture.png");
  },
  displayProfileUpdater: function(b) {
    var self = this;
    if (b) {
      $(self.modal).find('.profile-updater').show();
      $(self.modal).find('.update-profile-form').hide();
    } else {
      $(self.modal).find('.profile-updater').hide();
      $(self.modal).find('.update-profile-form').show();
    }
  },
  displayError: function(message) {
    var errorElt = $(this.modal).find('.alert-error');
    errorElt.find('.message').html(message);
    errorElt.show();
  },
  displaySuccess: function(message) {
    var successElt = $(this.modal).find('.alert-success');
    successElt.find('.message').html(message);
    successElt.show();
  },
  hideError: function() {
    $(this.modal).find('.alert-error').hide();
  },
  hideSuccess: function() {
    $(this.modal).find('.alert-success').hide();
  },
  show: function() {
    var self = this;
    self.displayProfileUpdater(false);
    self.hideError();
    self.hideSuccess();
    self.toggle();
    this.setUserInformation();
    self.adrSearch.init();
  }
});
