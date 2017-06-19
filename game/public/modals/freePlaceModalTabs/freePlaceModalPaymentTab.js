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
    self = this;
    self.tab = $("<div class='container'>"+
      "<p><i class='fa fa-exclamation-circle' /> "+chooseOneOreMorePaymentMethods+"</p>"+
      "<div>"+
        "<ul class='list-group payments'>"+
          "<li class='list-group-item'><div class='checkbox-container'><i class='fa fa-check checkbox' /></div><i class='fa fa-money' /> "+cash+"</li>"+
          "<li class='list-group-item'>"+
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
          "<li class='list-group-item'><div class='checkbox-container'><i class='fa fa-check checkbox' /></div><i class='fa fa-paypal' /> "+bankTransfer+"</li>"+
        "</ul>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn previous'>"+previous+"</button>"+
        "<button class='action-btn green-action-btn confirm'>"+confirm+"</button>"+
      "</div>"+
    "</div>");
    $(self.tab).find('.previous').click(function() {
      $(self).trigger('previous');
    });
    $(self.tab).find('.confirm').click(function() {
      
      $(self).trigger('confirm');
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
  }
};
