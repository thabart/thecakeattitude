var CrierModal = function() {};
CrierModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('crierModalTitle'),
      addAnnounce = $.i18n('addAnnounce'),
      description = $.i18n('description'),
      address = $.i18n('address'),
      error = $.i18n('error');
    self.descriptionTab = new CrierModalDescriptionTab();
    self.addressTab = new CrierModalAddressTab();
    self.descriptionJson = null;
    self.create("<div class='modal modal-lg md-effect-2'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<ul class='progressbar'>"+
            "<li class='col-3'>"+description+"</li>"+
            "<li class='col-3'>"+address+"</li>"+
          "</ul>"+
          "<div class='sk-cube-grid crier-loader'>"+
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
          "<div class='tab-content'>"+
            "<div class='tab0'></div>"+
            "<div class='tab1'></div>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    self.displayLoader(false);
    self.showTab(0);
    $(self.modal).find('.tab0').append(self.descriptionTab.render());
    $(self.modal).find('.tab1').append(self.addressTab.render());
    $(self.modal).find('.alert-error .close').click(function() {
      self.hideError();
    });
    $(self.descriptionTab).on('next', function(e, obj) {
      self.descriptionJson = obj.data;
      self.hideError();
      self.showTab(1);
      self.addressTab.init();
    });
    $(self.addressTab).on('previous', function(e, data) {
      self.showTab(0);
    });
    $(self.descriptionTab).on('error', function(e, data) {
      self.displayError(data.msg);
    });
    $(self.addressTab).on('confirm', function(e, data) {
      var json = $.extend({}, self.descriptionJson, data.obj);
      self.displayLoader(true);
      var accessToken = sessionStorage.getItem(Constants.sessionName);
      self.commonId = Guid.generate();
      AnnounceClient.addAnnounce(accessToken, json, self.commonId).then(function() {
        self.displayLoader(false);
      }).fail(function() {
        self.displayError($.i18n('error-addAnnounce'));
        self.displayLoader(false);
      });
    });
    AppDispatcher.register(function(obj) {
      if (obj.actionName === 'add-announce' && obj.data.common_id === self.commonId) {
        self.toggle();
      }
    });
  },
  displayLoader: function(b) { // Display loader.
    var self = this;
    var loader = $(self.modal).find('.crier-loader'),
      tabContent = $(self.modal).find('.tab-content');
    if (b) {
      loader.show();
      tabContent.hide();
    } else {
      loader.hide();
      tabContent.show();
    }
  },
  showTab: function(indice) { // Show tab.
    var self = this;
    var progressBarLi = $(self.modal).find('.progressbar li');
    for (var i = 0; i <= 3; i++) {
      var li = progressBarLi.get(i),
        tab = $(self.modal).find('.tab'+i);
      if (i <= indice) {
        $(li).addClass('active');
      } else {
        $(li).removeClass('active');
      }

      if (i === indice) {
        $(tab).show();
      } else {
        $(tab).hide();
      }
    }
  },
  hideError: function() { // Hide the error.
    $(this.modal).find('.alert-error').hide();
  },
  displayError: function(message) { // Display the error.
    var errorElt = $(this.modal).find('.alert-error');
    errorElt.find('.message').html(message);
    errorElt.show();
  },
  show: function() { // Show the modal window.
    var self = this;
    self.showTab(0);
    self.hideError();
    self.descriptionTab.reset();
    self.toggle();
  },
  remove: function() { // Correctly remove the crier modal window.
    $(this.modal).remove();
    AppDispatcher.remove();
  }
});
