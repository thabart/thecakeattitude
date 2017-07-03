'use strict';
var ShopSectionPresentationTab = function() { };
ShopSectionPresentationTab.prototype = {
  render: function(shopCategory) {
    var self = this;
    self.tab = $("<div class='content'>"+
      "<p>"+shopCategory.description+"</p>"+
    "</div>");
    return self.tab;
  }
};
