'use strict';
var StylistModal = function() { };
StylistModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('stylistModalTitle'),
      chooseHead = $.i18n('chooseHead'),
      chooseBody = $.i18n('chooseBody'),
      chooseSex = $.i18n('chooseSex'),
      chooseMale = $.i18n('chooseMale'),
      chooseFemal = $.i18n('chooseFemale'),
      ok = $.i18n('ok');
    self.chooseHeadTab = new StylistModalChooseHeadTab();
    self.chooseBodyTab = new StylistModalChooseBodyTab();
    self.create("<div class='modal modal-lg md-effect-2 stylist-modal'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='content'>"+
            "<label>"+chooseSex+"</label>"+
            "<select class='input-control choose-gender'>"+
              "<option value='male'>"+chooseMale+"</option>"+
              "<option value='female'>"+chooseFemal+"</option>"+
            "</select>"+
          "</div>"+
          "<ul class='tab'>"+
            "<li class='tab-item'>"+chooseHead+"</li>"+
            "<li class='tab-item'>"+chooseBody+"</li>"+
          "</ul>"+
          "<div class='content'>"+
            "<div class='tab0'></div>"+
            "<div class='tab1'></div>"+
          "</div>"+
          "<div class='footer'>"+
            "<button class='action-btn confirm'>"+ok+"</button>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    var playerStyle = GameStateStore.getCurrentPlayerStyle();
    var chooseGender = $(self.modal).find('.choose-gender');
    self.modal.find('.tab0').append(self.chooseHeadTab.render());
    self.modal.find('.tab1').append(self.chooseBodyTab.render());
    chooseGender.val(playerStyle.gender);
    self.chooseHeadTab.refresh(playerStyle.gender);
    chooseGender.change(function() {
      var val = $(this).val();
      self.chooseHeadTab.refresh(val);
      self.chooseHeadTab.forceInit();
    });
    self.showTab(0);
    $(self.modal).find('.tab-item').click(function() {
      var index = $(self.modal).find('.tab-item').index(this);
      self.showTab(index);
    });
    $(self.modal).find('.confirm').click(function() {
      var style = self.chooseHeadTab.getHead();
      style['gender'] = chooseGender.val();
      GameStateStore.setCurrentPlayerStyle(style);
      self.toggle();
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
  },
  show: function() {
    var self = this;
    self.toggle();
    self.chooseHeadTab.show();
  }
});
