'use strict';
var StylistModal = function() { };
StylistModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('stylistModalTitle'),
      chooseHead = $.i18n('chooseHead'),
      chooseBody = $.i18n('chooseBody');
    self.chooseHeadTab = new StylistModalChooseHeadTab();
    self.chooseBodyTab = new StylistModalChooseBodyTab();
    self.create("<div class='modal modal-lg md-effect-2' id='map-modal'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<ul class='tab'>"+
            "<li class='tab-item'>"+chooseHead+"</li>"+
            "<li class='tab-item'>"+chooseBody+"</li>"+
          "</ul>"+
          "<div class='tab0'></div>"+
          "<div class='tab1'></div>"+
        "</div>"+
      "</div>"+
    "</div>");

    self.modal.find('.tab0').append(self.chooseHeadTab.render());
    self.modal.find('.tab1').append(self.chooseBodyTab.render());
    self.showTab(0);
    $(self.modal).find('.tab-item').click(function() {
      var index = $(self.modal).find('.tab-item').index(this);
      self.showTab(index);
    });
  },
  showTab : function(indice) {
    var self = this;
    var tabLi = $(self.modal).find('.tab li');
    $(tabLi).removeClass('active');
    $($(tabLi).get(indice)).addClass('active');
    for (var i = 0; i <= 1; i++) {
      var tab = $(self.modal).find('.tab'+i);
      if (i === indice) {
        $(tab).show();
      } else {
        $(tab).hide();
      }
    }
  }
});
