'use strict';
var AddProductDescriptionTab = function() { };
AddProductDescriptionTab.prototype = {
  render: function() {
    var self = this,
      next = $.i18n('next'),
      name = $.i18n('name'),
      description = $.i18n('description'),
      selectCategory = $.i18n('selectCategory'),
      tags = $.i18n('tags'),
      images = $.i18n('images'),
      pricePerPortion = $.i18n('pricePerPortion'),
      unitOfMeasure = $.i18n('unitOfMeasure'),
      quantity = $.i18n('quantity'),
      numberOfPortionsAvailableInStocks = $.i18n('numberOfPortionsAvailableInStocks'),
      unlimitedStock = $.i18n('unlimitedStock');
    self.tab = $("<div>"+
      "<div class='container'>"+
        "<div class='content'>"+
          "<div class='col-6'>"+
            "<div>"+ // Name
              "<label>"+name+"</label>"+
              "<input type='text' class='input-control' />"+
            "</div>"+
            "<div>"+ // Description
              "<label>"+description+"</label>"+
              "<textarea class='input-control' />"+
            "</div>"+
            "<div>"+ // Select category
              "<label>"+selectCategory+"</label>"+
              "<select class='input-control'></select>"+
            "</div>"+
            "<div>"+ // Select tags.
              "<label>"+tags+"</label>"+
            "</div>"+
            "<div>"+ // Select images.
              "<label>"+images+"</label>"+
            "</div>"+
          "</div>"+
          "<div class='col-6'>"+
            "<div>"+
              "<label>"+pricePerPortion+"</label>"+
              "<input type='number' class='input-control' />"+
            "</div>"+
            "<div>"+
              "<label>"+unitOfMeasure+"</label>"+
              "<input type='number' class='input-control' />"+
            "</div>"+
            "<div>"+
              "<label>"+quantity+"</label>"+
              "<input type='number' class='input-control' />"+
            "</div>"+
            "<div>"+
              "<input type='checkbox' /> <span>"+unlimitedStock+"</span>"+
            "</div>"+
            "<div>"+
              "<label>"+numberOfPortionsAvailableInStocks+"</label>"+
              "<input type='number' class='input-control' />"+
            "</div>"+
          "</div>"+
        "</div>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn next'>"+next+"</button>"+
      "</div>"+
    "</div>");
    $(self.tab).find('.next').click(function() {
      $(self).trigger('next');
    });
    return self.tab;
  }
};
