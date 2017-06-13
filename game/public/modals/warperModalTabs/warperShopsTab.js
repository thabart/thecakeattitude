var WarperShopsTab = function() {};
WarperShopsTab.prototype = {
  render: function() {
    var self = this;
    self.tab = $("<div style='text-align: center;'><img src='/styles/images/under-construction.png' width='200' /></div>");
    return self.tab;
  }
};
