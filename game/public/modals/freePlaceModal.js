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
    showTab(0);
    $(descriptionTab).on('next', function() {
      showTab(1);
    });
    $(addressTab).on('previous', function() {
      showTab(0);
    });
  }
});
