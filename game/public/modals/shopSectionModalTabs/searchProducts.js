'use strict';
const minPrice = 1;
const maxPrice = 30000;
const defaultCount = 3;
var ShopSectionSearchProductsTab = function() { };
ShopSectionSearchProductsTab.prototype = {
  render: function(shopCategory, shopFilters) {
    var self = this,
      productName = $.i18n('productName'),
      bestDeals = $.i18n('bestDeals'),
      price = $.i18n('price'),
      min = $.i18n('min'),
      max = $.i18n('max'),
      error = $.i18n('error'),
      search = $.i18n('search');
    self.filterJson = {
        orders: [{target: 'update_datetime', method: 'desc'}],
        start_index: 0,
        count: defaultCount,
        min_price: minPrice,
        max_price: maxPrice,
        filters: [],
        category_id: shopCategory.id
    };
    self.shopCategory = shopCategory;
    self.shopFilters = shopFilters;
    self.tab = $("<div>"+
      "<div class='sk-cube-grid search-products-loader'>"+
        "<div class='sk-cube sk-cube1'></div>"+
        "<div class='sk-cube sk-cube2'></div>"+
        "<div class='sk-cube sk-cube3'></div>"+
        "<div class='sk-cube sk-cube4'></div>"+
        "<div class='sk-cube sk-cube5'></div>"+
        "<div class='sk-cube sk-cube6'></div>"+
        "<div class='sk-cube sk-cube7'></div>"+
        "<div class='sk-cube sk-cube8'></div>"+
        "<div class='sk-cube sk-cube9'></div>"+
      "</div>"+
      "<div class='alert-error'><b>"+error+" </b><span class='message'></span><span class='close'><i class='fa fa-times'></i></span></div>"+
      "<div class='search-products-content'>"+
        "<div class='col-4'>"+
          "<form class='product-name-form'>"+
            "<div class='form-group'>"+
              "<label>"+productName+"</label>"+
              "<input type='text' name='product-name' class='input-control' />"+
            "</div>"+
            "<div class='form-group'>"+
              "<button class='action-btn'>"+search+"</button>"+
            "</div>"+
          "</form>"+
          "<div class='form-group'>"+
            "<input type='checkbox' /> <span>"+bestDeals+"</span>"+
          "</div>"+
          "<div class='form-group'"+
            "<label>"+price+"</label>"+
            "<div class='slider-range'></div>"+
            "<div>"+
              "<span>"+min+"</span>"+
              "<input type='number' value='"+minPrice+"' min='"+minPrice+"' max='"+maxPrice+"' name='min' class='input-control' />"+
            "</div>"+
            "<div>"+
              "<span>"+max+"</span>"+
              "<input type='number' value='"+maxPrice+"' min='"+minPrice+"' max='"+maxPrice+"' name='max' class='input-control' />"+
            "</div>"+
          "</div>"+
          "<div class='filter-container'></div>"+
        "</div>"+
        "<div class='col-8'>"+
          "<ul class='product-list'>"+
          "</ul>"+
        "</div>"+
     "</div>"+
     "<div class='footer'>"+
      "<button class='action-btn'>View product</button>"+
     "</div>"+
    "</div>");
    if (shopFilters) {
      shopFilters.forEach(function(shopFilter) {
        var filter = $("<div class='form-group'><label>"+shopFilter.name+"</label><div class='filter-values'></div></div>");
        if (shopFilter.values) {
          shopFilter.values.forEach(function(shopFilterValue) {
            $(filter).find('.filter-values').append("<div><input type='checkbox' data-valueid='"+shopFilterValue.id+"' data-filterid='"+shopFilter.id+"' /> <span>"+shopFilterValue.content+"</span></div>");
          });
        }

        $(self.tab).find('.filter-container').append(filter);
      });
    }
    $(self.tab).find('.slider-range').slider({
      range: true,
      min: minPrice,
      max: maxPrice,
      values: [minPrice, maxPrice],
      slide: function(evt, ui) {
        $(self.tab).find("input[name='min']").val(ui.values[0]);
        $(self.tab).find("input[name='max']").val(ui.values[1]);
      },
      change: function(evt, ui) {
        self.filterJson['min_price'] = ui.values[0];
        self.filterJson['max_price'] = ui.values[1];
        self.refresh();
      }
    });
    $(self.tab).find("input[name='min']").change(function() {
      var val = $(this).val();
      $(self.tab).find('.slider-range').slider("values", 0, val);
      self.filterJson['min_price'] = val;
      self.refresh();
    });
    $(self.tab).find("input[name='max']").change(function() {
      var val = $(this).val();
      $(self.tab).find('.slider-range').slider("values", 1, val);
      self.filterJson['max_price'] = val;
      self.refresh();
    });
    $(self.tab).find('.product-name-form').submit(function(e) {
      e.preventDefault();
      var productName = $(self.tab).find("input[name='product-name']").val();
      self.filterJson['name'] = productName;
      self.refresh();
    });
    return self.tab;
  },
  reset: function() {
    var self = this;
  },
  refresh: function() {
    var self = this;
    self.displayLoader(true);
    $(self.tab).find('.product-list').empty();
    ProductClient.search(self.filterJson).then(function(result) {
      self.displayLoader(false);
      var commentsLabel = $.i18n('comments'),
        buyLabel = $.i18n('buy');
      var products = result['_embedded'];
      if (!products instanceof Array) {
        products = [products];
      }

      if (products.length === 0) {
        $(self.tab).find('.product-list').append("<span>"+$.i18n('noProduct')+"</span>");
        return;
      }

      products.forEach(function(product) {
        var imgSrc = "/styles/images/default-product.png";
        if (product.images && product.images.length > 0) {
          imgSrc = product.images[0];
        }

        var line = $("<li>"+
            "<div>"+
              "<img src='"+imgSrc+"' style='width:50px; float:left;' />"+
            "</div>"+
            "<div>"+
              "<h3>"+product.name+"</h3>"+
              "<div>"+
                commentsLabel + " : <div class='rating'></div>"+
              "</div>"+
            "</div>"+
            "<div>"+
              "<span class='price'>€ "+product.new_price+"</span><br/>"+
            "</div>"+
            "<button class='action-btn buy'>"+buyLabel+"</button>"+
          "</li>");
          $(self.tab).find('.product-list').append(line);
          line.find('.rating').rateYo({
            rating: product.average_score,
            numStars: 5,
            readOnly: true,
            starWidth: "20px"
          });
          $(line).find()
      });
      $(self.tab).find('.product-list li').click(function() {
        $(self.tab).find('.product-list li').removeClass('active');
        $(this).addClass('active');
      });
    }).fail(function() {
      self.displayLoader(false);
      self.displayError($.i18n('error-searchProducts'));
    });
  },
  displayLoader: function(b) { // Display loader.
    var self = this;
    var loader = $(self.tab).find('.search-products-loader'),
      tabContent = $(self.tab).find('.search-products-content');
    if (b) {
      loader.show();
      tabContent.hide();
    } else {
      loader.hide();
      tabContent.show();
    }
  },
  hideError: function() { // Hide the error.
    $(this.tab).find('.alert-error').hide();
  },
  displayError: function(message) { // Display the error.
    var errorElt = $(this.tab).find('.alert-error');
    errorElt.find('.message').html(message);
    errorElt.show();
  },
};
