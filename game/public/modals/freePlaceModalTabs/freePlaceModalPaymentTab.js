var FreePlaceModalPaymentTab = function() {};
FreePlaceModalPaymentTab.prototype = {
  render: function() {
    var confirm = $.i18n('confirm'),
      previous = $.i18n('previous'),
      cash = $.i18n('cash'),
      paypal = $.i18n('paypal'),
      bankTransfer = $.i18n('bankTransfer'),
      insertIban = $.i18n('insertIban'),
      chooseOneOreMorePaymentMethods = $.i18n('chooseOneOreMorePaymentMethods'),
      error = $.i18n('error'),
      self = this;
    self.tab = $("<div class='container'>"+
      "<p><i class='fa fa-exclamation-circle' /> "+chooseOneOreMorePaymentMethods+"</p>"+
      "<div>"+
        "<div class='alert-error'><b>"+error+" </b><span class='message'></span><span class='close'><i class='fa fa-times'></i></span></div>"+
        "<ul class='list-group payments'>"+
          "<li class='list-group-item cash-payment-method'><div class='checkbox-container'><i class='fa fa-check checkbox' /></div><i class='fa fa-money' /> "+cash+"</li>"+
          "<li class='list-group-item bank-transfer-payment-method'>"+
            "<div class='checkbox-container'><i class='fa fa-check checkbox' /></div>"+
            "<i class='fa fa-credit-card-alt' /> "+bankTransfer+
            "<p>"+insertIban+"</p>"+
            "<div>"+
              "<input type='text' class='input-control col-3 iban' maxLength='4' placeholder='BE__' name='firstIban' />"+
              "<input type='text' class='input-control col-3 iban' maxLength='4' placeholder='0000' name='secondIban' />"+
              "<input type='text' class='input-control col-3 iban' maxLength='4' placeholder='0000' name='thirdIban' />"+
              "<input type='text' class='input-control col-3 iban' maxLength='4' placeholder='0000' name='fourthIban' />"+
            "</div>"+
          "</li>"+
          "<li class='list-group-item paypal-payment-method'><div class='checkbox-container'><i class='fa fa-check checkbox' /></div><i class='fa fa-paypal' /> "+paypal+"</li>"+
        "</ul>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn green-action-btn confirm'>"+confirm+"</button>"+
      "</div>"+
    "</div>");
    $(self.tab).find('.alert-error .close').click(function() {
      self.hideError();
    });
    $(self.tab).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(self.tab).find('.confirm').click(function() {
      var isCashMethod = $(self.tab).find('.cash-payment-method').hasClass('list-group-item-active');
      var isBankTransferMethod = $(self.tab).find('.bank-transfer-payment-method').hasClass('list-group-item-active');
      var isPaypalMethod = $(self.tab).find('.paypal-payment-method').hasClass('list-group-item-active');
      if (!isCashMethod && !isBankTransferMethod && !isPaypalMethod) {
        self.displayError($.i18n('error-selectAtLeastOnePaymentMethod'));
        return;
      }

      var json = [];
      if (isCashMethod) {
        json.push({method : 'cash'});
      }
      if (isBankTransferMethod) {
        var iban = $(self.tab).find("input[name='firstIban']").val() + $(self.tab).find("input[name='secondIban']").val()
          + $(self.tab).find("input[name='thirdIban']").val() + $(self.tab).find("input[name='fourthIban']").val();
        var regex = new RegExp("^[A-Z]{2}[0-9]{2}([0-9]{4}){3}");
        if (!regex.test(iban)) {
          self.displayError($.i18n('error-iban'));
          return;
        }

        json.push({method: 'bank_transfer', iban: iban});
      }

      if (isPaypalMethod) {
        json.push({method: 'paypal'});
      }

      self.hideError();
      $(self).trigger('confirm', [ json ]);
    });
    $(self.tab).find('li').click(function() {
      if ($(this).hasClass('list-group-item-active')) $(this).removeClass('list-group-item-active');
      else $(this).addClass('list-group-item-active');
    });
    $(self.tab).find('.iban').click(function(e) {
      e.stopPropagation();
    });
    return self.tab;
  },
  clean: function() {
    $(this.tab).find('.list-group-item').removeClass('list-group-item-active');
  },
  hideError: function() {
    $(this.tab).find('.alert-error').hide();
  },
  displayError: function(message) {
    var errorElt = $(this.tab).find('.alert-error');
    errorElt.find('.message').html(message);
    errorElt.show();
  }
};
