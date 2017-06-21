'use strict';
var ShopSectionSearchProductsTab = function() { };
ShopSectionSearchProductsTab.prototype = {
  render: function() {
    var self = this;
    self.tab = $("<div>"+
      "<div class='search-products-content'>"+
        "<div class='col-4'>"+
          "<div class='form-group'>"+
            "<label>Product name</label>"+
            "<input type='text' class='input-control' />"+
          "</div>"+
          "<div class='form-group'>"+
            "<input type='checkbox' /> <span>Best deals</span>"+
          "</div>"+
          "<div class='form-group'"+
            "<label>Price</label>"+
            "<div class='slider-range'></div>"+
            "<div>"+
              "<span>Min</span>"+
              "<input type='number' min='1' max='30000' class='input-control' />"+
            "</div>"+
            "<div>"+
              "<span>Max</span>"+
              "<input type='number' min='1' max='30000' class='input-control' />"+
            "</div>"+
          "</div>"+
          "<div class='form-group'>"+
            "<label>Colors</label>"+
            "<div>"+
              "<input type='checkbox' /> <span>Red</span>"+
            "</div>"+
            "<div>"+
              "<input type='checkbox' /> <span>Blue</span>"+
            "</div>"+
            "<div>"+
              "<input type='checkbox' /> <span>Green</span>"+
            "</div>"+
            "<div>"+
              "<input type='checkbox' /> <span>Green</span>"+
            "</div>"+
            "<div>"+
              "<input type='checkbox' /> <span>Green</span>"+
            "</div>"+
          "</div>"+
          "<div class='form-group'>"+
            "<label>Size</label>"+
            "<div>"+
              "<input type='checkbox' /> <span>Large</span>"+
            "</div>"+
            "<div>"+
              "<input type='checkbox' /> <span>Medium</span>"+
            "</div>"+
          "</div>"+
        "</div>"+
        "<div class='col-8'>"+
          "<ul class='product-list'>"+
            "<li>"+
              "<div>"+
                "<img src='/styles/images/default-store.png' style='width:50px; float:left;' />"+
              "</div>"+
              "<div>"+
                "<h3>Jeans</h3>"+
                "<div>"+
                  "Comments : <div class='rating'></div>"+
                "</div>"+
              "</div>"+
              "<div>"+
                "<span class='price'>€ 300</span><br/>"+
              "</div>"+
              "<button class='action-btn buy'>Buy</button>"+
          "</ul>"+
        "</div>"+
     "</div>"+
     "<div class='footer'>"+
      "<button class='action-btn'>View product</button>"+
     "</div>"+
    "</div>");
    $(self.tab).find('.slider-range').slider({
      range: true,
      min: 1,
      max: 30000
    });
    $(self.tab).find('.rating').rateYo({
      rating: 3.5,
      numStars: 5,
      readOnly: true,
      starWidth: "20px"
    });
    $(self.tab).find('.product-list li').click(function() {
      $(self.tab).find('.product-list li').removeClass('active');
      $(this).addClass('active');
    });
    return self.tab;
  }
};
