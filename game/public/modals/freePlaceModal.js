var FreePlaceModal = function() {};
FreePlaceModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('freePlaceModalTitle'),
      address = $.i18n('address'),
      description = $.i18n('description'),
      error = $.i18n('error'),
      contactInformation = $.i18n('contactInformation'),
      payment = $.i18n('payment'),
      place = null;
    self.descriptionTab = new FreePlaceModalDescriptionTab();
    self.addressTab = new FreePlaceModalAddressTab();
    self.contactInfoTab = new FreePlaceModalContactTab();
    self.paymentTab = new FreePlaceModalPaymentTab();
    self.formResult = {
      descriptionTabResult: null,
      addressTabResult: null,
      contactInfoTabResult: null
    };
    self.create("<div class='modal modal-lg md-effect-1' id='free-place-modal'>"+
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
            "<li class='col-3'>"+contactInformation+"</li>"+
            "<li class='col-3'>"+payment+"</li>"+
          "</ul>"+
          "<div class='sk-cube-grid free-place-loader'>"+
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
            "<div class='tab2'></div>"+
            "<div class='tab3'></div>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(self.modal).find('.tab0').append(self.descriptionTab.render());
    $(self.modal).find('.tab1').append(self.addressTab.render());
    $(self.modal).find('.tab2').append(self.contactInfoTab.render());
    $(self.modal).find('.tab3').append(self.paymentTab.render());
    $(self.modal).find('.modal-window > .alert-error .close').click(function() {
      self.hideError();
    });
    self.showTab(0);
    self.displayLoading(false);
    $(self.descriptionTab).on('next', function(e, data) {
      self.showTab(1);
      self.formResult.descriptionTabResult = data;
      self.addressTab.init();
    });
    $(self.addressTab).on('previous', function() { // Address.
      self.showTab(0);
    });
    $(self.addressTab).on('next', function(e, data) {
      self.showTab(2);
      self.formResult.addressTabResult = data;
    });
    $(self.contactInfoTab).on('previous', function() { // Contact information.
      self.showTab(1);
    });
    $(self.contactInfoTab).on('next', function(e, data) {
      self.showTab(3)
      self.formResult.contactInfoTabResult = data;
    });
    $(self.paymentTab).on('previous', function() { // Payment.
      self.showTab(2);
    });
    $(self.paymentTab).on('confirm', function(e, data) {
      var paymentTabResult = {payments: data};
      var json = $.extend({
        place: self.place.id,
        category_id: self.place.categoryId,
        category_map_name: self.place.mapName
      }, self.formResult.descriptionTabResult, self.formResult.addressTabResult, self.formResult.contactInfoTabResult, paymentTabResult);
      self.displayLoading(true);
      var accessToken = sessionStorage.getItem(Constants.sessionName);
      self.commonId = Guid.generate();
      ShopClient.addShop(accessToken, json, self.commonId).then(function(e) {
        self.displayLoading(false);
      }).fail(function() {
        self.displayError($.i18n('error-addShop'));
        self.displayLoading(false);
      });
    });
  },
  getCommonId: function() {
    return this.commonId;
  },
  showTab: function(indice) {
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
  show: function(place) {
    var self = this;
    self.place = place;
    self.showTab(0);
    self.descriptionTab.clean(); // Clean description tab.
    self.paymentTab.clean(); // Clean payment tab.
    self.toggle();
  },
  remove() {
    var self = this;
    $(self.modal).remove();
    self.contactInfoTab.destroy();
    self.addressTab.destroy();
  },
  displayLoading: function(b) {
    var self = this;
    var loader = $(self.modal).find('.free-place-loader'),
      tabContent = $(self.modal).find('.tab-content');
    if (b) {
      loader.show();
      tabContent.hide();
    } else {
      loader.hide();
      tabContent.show();
    }
  },
  hideError: function() {
    $(this.modal).find('.modal-window > .alert-error').hide();
  },
  displayError: function(message) {
    var errorElt = $(this.modal).find('.modal-window > .alert-error');
    errorElt.find('.message').html(message);
    errorElt.show();
  }
});
