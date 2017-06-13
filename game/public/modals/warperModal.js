var WarperModal = function() {};
WarperModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function(game) {
    var self = this;
    var title = $.i18n('warperModalTitle'),
      ok = $.i18n('ok');
    self.game = game;
    self.warperMapsTab = new WarperMapsTab();
    self.warperShopsTab = new WarperShopsTab();
    self.warperCurrentUserShopsTab = new WarperCurrentUserShopsTab();
    self.create("<div class='modal modal-lg warper-modal' style='display:none;'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<ul class='tab'>"+
            "<li class='tab-item'>Maps</li>"+
            "<li class='tab-item'>Shops</li>"+
            "<li class='tab-item'>Your shops</li>"+
          "</ul>"+
          "<div class='tab0'></div>"+
          "<div class='tab1'></div>"+
          "<div class='tab2'></div>"+
        "</div>"+
      "</div>"+
    "</div>");
    var showTab = function(indice) {
      var tabLi = $(self.modal).find('.tab li');
      $(tabLi).removeClass('active');
      $($(tabLi).get(indice)).addClass('active');
      for (var i = 0; i <= 2; i++) {
        var tab = $(self.modal).find('.tab'+i);
        if (i === indice) {
          $(tab).show();
        } else {
          $(tab).hide();
        }
      }
    };
    self.modal.find('.tab0').append(self.warperMapsTab.render(game));
    self.modal.find('.tab1').append(self.warperShopsTab.render());
    self.modal.find('.tab2').append(self.warperCurrentUserShopsTab.render());
    showTab(0);
    $(self.modal).find('.tab-item').click(function() {
      var index = $(self.modal).find('.tab-item').index(this);
      showTab(index);
    });
  },
  show() {
    var self = this;
    $(self.modal).show();
    self.warperMapsTab.init();
  }
});
