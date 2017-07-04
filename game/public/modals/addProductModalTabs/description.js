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
      unlimitedStock = $.i18n('unlimitedStock'),
      unitOfMeasureKg = $.i18n('unitOfMeasureKg'),
      unitOfMeasurePiece = $.i18n('unitOfMeasurePiece'),
      unitOfMeasureL = $.i18n('unitOfMeasureL');
    self.tab = $("<form class='add-product-description-tab'>"+
      "<div class='container'>"+
        "<div class='content'>"+
          "<div class='col-6'>"+
            "<div>"+ // Name
              "<label>"+name+"</label>"+
              "<span class='error-message'></span>"+
              "<input type='text' minlength='1' maxlength='15' name='name' class='input-control' />"+
            "</div>"+
            "<div>"+ // Description
              "<label>"+description+"</label>"+
              "<span class='error-message'></span>"+
              "<textarea minlength='1' maxlength='255' name='description' class='input-control' />"+
            "</div>"+
            "<div>"+ // Select category
              "<label>"+selectCategory+"</label>"+
              "<select class='input-control' name='product_category'></select>"+
            "</div>"+
            "<div>"+ // Select tags.
              "<label>"+tags+"</label>"+
              "<input type='text' name='tags' class='input-control tags' />"+
            "</div>"+
            "<div>"+ // Select images.
              "<label>"+images+"</label>"+
              "<input type='file' accept='image/*' class='input-control product-images-btn' />"+
              "<ul class='product-images'></ul>"+
            "</div>"+
          "</div>"+
          "<div class='col-6'>"+
            "<div>"+ // Price per portion
              "<label>"+pricePerPortion+"</label>"+
              "<span class='error-message'></span>"+
              "<input type='number' min='0' name='priceperportion' class='input-control' />"+
            "</div>"+
            "<div>"+ // Unit of measure.
              "<label>"+unitOfMeasure+"</label>"+
              "<select name='unit_of_measure' class='input-control'>"+
                "<option value='kg'>"+unitOfMeasureKg+"</option>"+
                "<option value='piece'>"+unitOfMeasurePiece+"</option>"+
                "<option value='l'>"+unitOfMeasureL+"</option>"+
              "</select>"+
            "</div>"+
            "<div>"+
              "<label>"+quantity+"</label>"+
              "<span class='error-message'></span>"+
              "<input type='number' min='0' name='quantity' class='input-control' />"+
            "</div>"+
            "<div>"+
              "<input type='checkbox' name='unlimitedStock' /> <span>"+unlimitedStock+"</span>"+
            "</div>"+
            "<div class='available-in-stock'>"+
              "<label>"+numberOfPortionsAvailableInStocks+"</label>"+
              "<span class='error-message'></span>"+
              "<input type='number' min='0' name='number_of_portions_available_in_stock' class='input-control' />"+
            "</div>"+
          "</div>"+
        "</div>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn next'>"+next+"</button>"+
      "</div>"+
    "</form>");
    var uploadImage = function(e, callback) {
      e.preventDefault();
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    };
    self.tags = $(self.tab).find('.tags').selectize({
      create: false,
      labelField: 'name',
      searchField: 'name',
      valueField: 'name',
      render: {
        option: function(item, escape) {
          return "<div><span class='title'>"+item.name+"</span></div>";
        }
      },
      load: function(query, callback) {
        TagsClient.search({name: query}).then(function(tags) {
          var embedded = tags._embedded;
          if (!(embedded instanceof Array)) {
            embedded = [embedded];
          }

          callback(embedded);
        }).fail(function() {
          callback();
        });
      }
    });
    $(self.tab).find('.product-images-btn').change(function(e) {
      uploadImage(e, function(b64Img) {
        var li = $("<li><div class='close'><i class='fa fa-times'></i></div><img src='"+b64Img+"' /></li>");
        $(self.tab).find('.product-images').append(li);
        $(li).find('.close').click(function() {
          $(this).parent('li').remove();
        });
      });
    });
    $(self.tab).find("input[name='unlimitedStock']").change(function() {
      var isChecked = $(this).is(':checked');
      if (isChecked) {
        $(self.tab).find('.available-in-stock').hide();
      } else {
        $(self.tab).find('.available-in-stock').show();
      }
    });
    $(self.tab).submit(function(e) {
      e.preventDefault();
      self.tab.form();
      if (!self.tab.valid()) {
        return;
      }

      var shop = ShopMapStateStore.getShop();
      var images = $.map($(self.tab).find('.product-images img'), function(i)  {
        return $(i).attr('src');
      });
      var json = {
        category_id: $(self.tab).find("select[name='product_category']").val(),
        name: $(self.tab).find("input[name='name']").val(),
        description: $(self.tab).find("textarea[name='description']").val(),
        price: $(self.tab).find("input[name='priceperportion']").val(),
        new_price: $(self.tab).find("input[name='priceperportion']").val(),
        unit_of_measure: $(self.tab).find("select[name='unit_of_measure']").val(),
        quantity: $(self.tab).find("input[name='quantity']").val(),
        shop_id: shop.id,
        images: images,
        tags: self.tags[0].selectize.items
      };
      if ($(self.tab).find("input[name='unlimitedStock']").is(':checked')) {
        json['available_in_stock'] = $(self.tab).find("input[name='number_of_portions_available_in_stock']").val();
      }

      $(self).trigger('next', [ { obj: json }]);
    });
    self.tab.validate({ // Add validation.
      rules: {
        name: {
          required: true,
          minlength: 1,
          maxlength: 15
        },
        description: {
          required: true,
          minlength: 1,
          maxlength: 255
        },
        priceperportion: {
          required: true,
          min: 0
        },
        quantity: {
          required: true,
          min: 0
        },
        number_of_portions_available_in_stock: {
          min: 0
        }
      },
      errorPlacement: function(error, elt) {
        error.appendTo(elt.prev());
      }
    });
    return self.tab;
  },
  reset: function() {
    var self = this;
    $(self.tab).find("input[name='name']").val('');
    $(self.tab).find("textarea[name='description']").val('');
    $(self.tab).find("select[name='product_category']").empty();
    $(self.tab).find("input[name='priceperportion']").val('');
    $(self.tab).find("input[name='quantity']").val('');
    $(self.tab).find("input[name='tags']").val('');
    $(self.tab).find("input[name='number_of_portions_available_in_stock']").val('');
    $(self.tab).find('.product-images').empty();
  },
  display: function() {
    var shop = ShopMapStateStore.getShop();
    var self = this;
    self.reset();
    if (shop.product_categories && shop.product_categories.length > 0) {
      shop.product_categories.forEach(function(productCategory) {
        $(self.tab).find("select[name='product_category']").append("<option value='"+productCategory.id+"'>"+productCategory.name+"</option>");
      });
    }
  }
};
