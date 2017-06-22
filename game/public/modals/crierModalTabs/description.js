'use strict';
var CrierModalDescriptionTab = function() { };
CrierModalDescriptionTab.prototype = {
  render: function() {
    var next = $.i18n('next'),
      name = $.i18n('name'),
      price = $.i18n('price'),
      description = $.i18n('description'),
      self = this;
    self.tab = $("<div>"+
      "<div class='container'>"+
        "<div class='content'>"+
          "<div>"+
            "<label>"+name+"</label>"+
            "<input type='text' class='input-control' />"+
          "</div>"+
          "<div>"+
            "<label>"+description+"</label>"+
            "<textarea class='input-control' />"+
          "</div>"+
          "<div>"+

          "</div>"+
          "<div>"+
            "<label>"+price+"</label>"+
            "<input type='number' class='input-control' />"+
          "</div>"+
        "</div>"+
      "</div>"+
      "<div class='footer'>"+
          "<button class='action-btn next'>next</button>"+
      "</div>"+
    "</div>");
    $(self.tab).find('.next').click(function() {
      $(self).trigger('next');
    });
    return self.tab;
  }
};
