'use strict';
var StylistModalChooseHeadTab = function() { };
StylistModalChooseHeadTab.prototype = {
  render: function() {
    var self = this;
    self.tab = $("<div style='text-align: center;'><img src='/styles/images/under-construction.png' width='200' /></div>");
    return self.tab;
  }
};
