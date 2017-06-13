var FreePlaceModal = function() {};
FreePlaceModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('freePlaceModalTitle'),
      address = $.i18n('address'),
      description = $.i18n('description'),
      contactInformation = $.i18n('contactInformation'),
      payment = $.i18n('payment');
    var descriptionTab = new FreePlaceModalDescriptionTab();
    var addressTab = new FreePlaceModalAddressTab();
    var contactInfoTab = new FreePlaceModalContactTab();
    var paymentTab = new FreePlaceModalPaymentTab();
    self.create("<div class='modal modal-lg' id='free-place-modal' style='display:none;'>"+
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
          "<div class='tab0'></div>"+
          "<div class='tab1'></div>"+
          "<div class='tab2'></div>"+
          "<div class='tab3'></div>"+
        "</div>"+
      "</div>"+
    "</div>");
    var showTab = function(indice) {
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
    };
    $(self.modal).find('.tab0').append(descriptionTab.render());
    $(self.modal).find('.tab1').append(addressTab.render());
    $(self.modal).find('.tab2').append(contactInfoTab.render());
    $(self.modal).find('.tab3').append(paymentTab.render());
    showTab(0);
    $(descriptionTab).on('next', function() {
      showTab(1);
      addressTab.init();
    });
    $(addressTab).on('previous', function() { // Address.
      showTab(0);
    });
    $(addressTab).on('next', function() {
      showTab(2);
    });
    $(contactInfoTab).on('previous', function() { // Contact information.
      showTab(1);
    });
    $(contactInfoTab).on('next', function() {
      showTab(3)
    });
    $(paymentTab).on('previous', function() { // Payment.
      showTab(2);
    });
    $(paymentTab).on('confirm', function() {
      console.log('confirm');
    });
  }
});
