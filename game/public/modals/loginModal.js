var LoginModal = function() {};
LoginModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('loginModalTitle'),
      login = $.i18n('login'),
      password = $.i18n('password'),
      useOtherIdProviders = $.i18n('useOtherIdProviders'),
      cannotAuthenticate = $.i18n('error-cannotAuthenticate'),
      error = $.i18n('error'),
      login = $.i18n('authenticate'),
      sessionName = "shopInGame-Game";
    self.create("<div class='modal modal-lg md-effect-2' id='login-modal'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
          "</div>"+
          "<form class='local-login-form'>"+
            "<div class='sk-cube-grid login-loader'>"+
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
            "<div class='local-login'>"+
              "<div class='alert-error'><b>"+error+" </b><span class='message'></span><span class='close'><i class='fa fa-times'></i></span></div>"+
              "<div>"+
                "<label>"+login+"</label>"+
                "<span class='error-message'></span>"+
                "<input type='text' name='login' class='input-control' required />" +
              "</div>"+
              "<div>"+
                "<label>"+password+"</label>"+
                "<span class='error-message'></span>"+
                "<input type='password' name='password' class='input-control' required />" +
              "</div>"+
            "</div>"+
            "<div class='footer'>"+
              "<button class='action-btn local-login-btn'>"+login+"</button>" +
              "<button class='action-btn use-other-id-providers'>"+useOtherIdProviders+"</button>"+
            "</div>"+
          "</form>"+
        "</div>"+
      "</div>"+
    "</div>");
    self.isLoading(false);
    self.loginFormValidation = $(self.modal).find('.local-login-form');
    self.loginFormValidation.validate({
      rules: {
        login: {
          required: true
        },
        password: {
          required: true
        }
      },
      errorPlacement: function(error, elt) {
        error.appendTo(elt.prev());
      }
    });
    $(self.modal).find('.local-login-form').submit(function(e) { // Local authentication.
      e.preventDefault();
      self.displayError(false);
      if (!self.loginFormValidation.valid()) {
        return;
      }

      self.isLoading(true);
      var formJson = {};
      $(this).serializeArray().map(function(x){formJson[x.name] = x.value;});
      var json = {
				grant_type: 'password',
				username: formJson.login,
				password: formJson.password,
				scope: 'openid profile',
				client_id: Constants.ClientId,
				client_secret: Constants.ClientSecret
			};
      OpenIdClient.postToken(json).then(function(r) {
        self.isLoading(false);
        $(self).trigger('authenticated', [ r.access_token ]);
      }).fail(function() {
        self.isLoading(false);
        self.displayError(true, $.i18n('error-cannotAuthenticate'));
      });
    });
    $(self.modal).find('.use-other-id-providers').click(function(e) { // External authentication.
      e.preventDefault();
      var href = Constants.openIdUrl + "/authorization?scope=openid%20profile%20email&state=75BCNvRlEGHpQRCT"+
        "&redirect_uri="+Constants.callbackUrl+"&response_type=id_token%20token&client_id="+Constants.ClientId+"&nonce=nonce&response_mode=query";
      var w = window.open(href, 'targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=400'); // Open modal window.
      self.isLoading(true);
      self.disableLogin(true);
      self.disableUseExtAuthProviders(true);
      var interval = setInterval(function() {
				if (w.closed) {
          self.isLoading(false);
          self.disableLogin(false);
          self.disableUseExtAuthProviders(false);
					clearInterval(interval);
					return;
				}

				var href = w.location.href;
				var accessToken = HrefUtils.getParameter('access_token', href);
				if (accessToken) {
          clearInterval(interval);
          w.close();
          $(self).trigger('authenticated', [ accessToken ]);
				}
			}, 1000);
    });
    $(self.modal).find('.alert-error .close').click(function() {
      self.displayError(false);
    });
  },
  isLoading: function(b) { // Display or hide the loading spinner.
    var self = this;
    if (b) {
      $(self.modal).find('.login-loader').show();
      $(self.modal).find('.local-login').hide();
    } else {
      $(self.modal).find('.login-loader').hide();
      $(self.modal).find('.local-login').show();
    }
  },
  disableLogin: function(b) { // Disable or enable the login button.
    $(this.modal).find('.local-login-btn').prop('disabled', b);
  },
  disableUseExtAuthProviders: function(b) { // Disable or enable use external authentication providers.
    $(this.modal).find('.use-other-id-providers').prop('disabled', b);
  },
  displayError: function(b, msg) { // Display or hide the error.
    var self = this;
    var alertError = $(self.modal).find('.alert-error');
    if (b) {
      alertError.show();
      alertError.find('.message').html(msg);
    } else {
      alertError.hide();
    }
  }
});
