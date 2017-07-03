'use strict';
var ShopSectionModal = function() { };
ShopSectionModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function(shopCategory, shopFilters) {
    var self = this;
    var title = $.i18n('shopSectionModalTitle'),
      presentationTabTitle = $.i18n('shopSectionPresentationTabTitle'),
      searchProductsTabTitle = $.i18n('shopSectionSearchProductsTabTitle');
    title = title.replace('{0}', shopCategory.name);
    self.shopCategory = shopCategory;
    self.shopFilters = shopFilters;
    self.presentationTab = new ShopSectionPresentationTab();
    self.searchProductsTab = new ShopSectionSearchProductsTab();
    self.create("<div class='modal modal-lg shop-section-modal md-effect-1'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<ul class='tab'>"+
            "<li class='tab-item'>"+presentationTabTitle+"</li>"+
            "<li class='tab-item'>"+searchProductsTabTitle+"</li>"+
          "</ul>"+
          "<div class='tab-content'>"+
            "<div class='tab0'></div>"+
            "<div class='tab1'></div>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(self.modal).find('.tab0').append(self.presentationTab.render(shopCategory));
    $(self.modal).find('.tab1').append(self.searchProductsTab.render(shopCategory, shopFilters));
    self.showTab(0);
    $(self.modal).find('.tab-item').click(function() {
      var index = $(self.modal).find('.tab-item').index(this);
      if (index === 1) {
        self.searchProductsTab.refresh();
      }

      self.showTab(index);
    });
  },
  showTab: function(indice) {
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
    this.toggle();
  }
});
