game.Menu = game.Menu || {};
game.Menu.ShelfBox = me.Object.extend({
  init: function() {
    this._request = { count: 2, start_index: 0 };
    this._product_category = null;
    this.shelf = $("<div class='modal blue lg shelf-box'>"+
      "<div class='container'>"+
        "<div class='content'>"+
          "<div class='top'><span data-i18n='shelf'></span> <div class='close'></div></div>"+
          "<div class='body'>"+
            "<ul class='tabs'>"+
              "<li data-i18n='description' data-target='.tab-content > .description' class='active'></li>"+
              "<li data-i18n='products' data-target='.tab-content > .products'></li>"+
            "</ul>"+
            "<div class='tab-container'>"+
              "<div class='loader' data-i18n='loading' style='display: none;'></div>"+
              "<div class='tab-content'>"+
                // DISPLAY THE DESCRIPTION.
                "<div class='description'>"+
                "</div>"+
                // DISPLAY THE PRODUCTS.
                "<div class='products' style='display: none;'>"+
                  "<div class='col-4'>"+
                    // SEARCH BY NAME.
                    "<div class='input edit'>"+
                      "<div class='top'></div>"+
                      "<div class='body'>"+
                        "<form class='search-product-form'>"+
                        "<input type='text' class='product-name' placeholder='Search product' />"+
                        "</form>"+
                      "</div>"+
                      "<div class='bottom'></div>"+
                    "</div>"+
                    // BEST DEALS + PRICE.
                    "<div class='gray-panel' style='padding-top: 5px'>"+
                      "<div class='top'></div>"+
                      "<div class='body'>"+
                        // BEST DEALS.
                        "<div>"+
                          "<input type='checkbox' /><label data-i18n='best_deals'></label>"+
                        "</div>"+
                        // MIN PRICE.
                        "<div class='input' style='padding-top:2px;'>"+
                          "<div class='top'></div>"+
                          "<div class='body' style='padding:5px;'>"+
                            "<input type='text' min='1' max='999999' placeholder='Min price' />"+
                          "</div>"+
                          "<div class='bottom'></div>"+
                        "</div>"+
                        // MAX PRICE.
                        "<div class='input' style='padding-top:2px;'>"+
                          "<div class='top'></div>"+
                          "<div class='body' style='padding:5px;'>"+
                            "<input type='number' min='1' max='999999' placeholder='Max price' />"+
                          "</div>"+
                          "<div class='bottom'></div>"+
                        "</div>"+
                      "</div>"+
                      "<div class='bottom'></div>"+
                    "</div>"+
                    // FILTERS.
                    "<div class='gray-panel' style='padding-top: 5px'>"+
                      "<div class='top'></div>"+
                      "<div class='body'>"+
                        "<div class='treeview filters'>"+
                          "<ul>"+
                            "<li>"+
                              "<span class='node-toggle'></span>"+
                              "<span>Color</span>"+
                              "<ul>"+
                                "<li class='filter'>Red</li>"+
                              "</ul>"+
                            "</li>"+
                            "<li>"+
                              "<span class='node-toggle'></span>"+
                              "<span>Size</span>"+
                              "<ul>"+
                                "<li>Medium</li>"+
                              "</ul>"+
                            "</li>"+
                          "</ul>"+
                        "</div>"+
                      "</div>"+
                      "<div class='bottom'></div>"+
                    "</div>"+
                  "</div>"+
                  "<div class='col-8'>"+
                    // DISPLAY THE PRODUCTS.
                    "<ul class='list' style='padding: 0 10px 0 10px'></ul>"+
                    "<ul class='navigations'></ul>"+
                  "</div>"+
                "</div>"+
              "</div>"+
            "</div>"+
          "</div>"+
          "<div class='bottom'></div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(document.body).append(this.shelf);
    $(this.shelf).hide();
    $(this.shelf).draggable({ "handle": ".top" });
    $(this.shelf).i18n();
    this.addListeners();
    this.displayB = this.display.bind(this);
    this.hideB = this.hide.bind(this);
    game.Stores.GameStore.listenDisplayShelfBoxArrived(this.displayB);
    game.Stores.GameStore.listenHideShelfBoxArrived(this.hideB);
  },
  refresh: function() {
    var self = this;
    if (!self._product_category || self._product_category === null) { return; }
    self.displayLoading(true);
    var productsElt = $(self.shelf).find('.products .list');
    var navigationsElt = $(self.shelf).find('.navigations');
    productsElt.empty();
    navigationsElt.empty();
    game.Services.ProductsService.search(self._request).then(function(result) {
      var products = result['_embedded'],
        navigation = result['_links']['navigation'];
      if (!(products instanceof Array)) {
        products = [ products];
      }

      products.forEach(function(product) {
        var elt = $("<li>"+
          "<div class='information'>"+
            product.name+
          "</div>"+
          "<div>"+
            "<div class='col-8'>"+
              "<span>€ "+product.price+"</span>"+
            "</div>"+
            "<div class='col-4' style='text-align: right;'>"+
              "<button class='button button-green' data-i18n='see'></button>"+
            "</div>"+
          "</div>"+
        "</li>");
        productsElt.append(elt);
      });
      productsElt.i18n();
      if (navigation && navigation.length > 0) {
        navigation.forEach(function(nav) {
          var n = $("<li>"+nav.name+"</li>");
          navigationsElt.append(n);
          $(n).click(function() {
            $(self.shelf).find('.navigations li').removeClass('active');
            $(this).addClass('active');
            var page = $(this).html();
            self._request.start_index = self._request.count * (parseInt(page) - 1);
            self.refresh();
          });
        });
      }

      self.displayLoading(false);
    }).catch(function() {
      self.displayLoading(false);
    });
  },
  addListeners: function() {
    var self = this;
    $(this.shelf).find('.close').click(function() {
      self.hide();
    });
    $(this.shelf).find('.filters .node-toggle').click(function(e) {
      e.stopPropagation();
      var li = $(this).closest('li');
      if(li.hasClass('active')) {
        li.removeClass('active');
      } else {
        li.addClass('active');
      }
    });
    $(this.shelf).find('.tabs li').click(function() {
      var target = $(this).data('target');
      $(self.shelf).find('.tab-content > div').hide();
      $(self.shelf).find(target).show();
      $(self.shelf).find('.tabs li').removeClass('active');
      $(this).addClass('active');
      if (target === '.tab-content > .products') {
        self.refresh();
      }
    });
    $(this.shelf).find('.search-product-form').submit(function(e) {
      e.preventDefault();
      var val = $(self.shelf).find('.product-name').val();
      self._request['name'] = val;
      self.refresh();
    });
  },
  displayLoading: function(b) {
    if (b) {
      $(this.shelf).find('.tab-content').hide();
      $(this.shelf).find('.loader').show();
    } else {
      $(this.shelf).find('.tab-content').show();
      $(this.shelf).find('.loader').hide();
    }
  },
  display: function(e, settings) {
    if (settings.product_category) {
      var shop = game.Stores.GameStore.getShopInformation();
      $(this.shelf).find('.tab-content > .description').empty();
      $(this.shelf).find('.tab-content > .description').append(
        "<div>"+
          "<h3 class='no-style'>" + settings.product_category.name + "</h3>"+
          "<p class='no-style'>" + settings.product_category.description + "</p>"+
        "</div>"
      );
      this._product_category = settings.product_category;
      this._request['category_id'] = [ settings.product_category.id ];
      this._request['shop_id'] = [ shop.id ];
    }

    $(this.shelf).show();
  },
  hide: function() {
    $(this.shelf).hide();
  },
  reset: function() {
    this._product_category = null;
    this._request = { count: 2, start_index: 0 };
  },
  destroy: function() {
    if (this.shelf) $(this.shelf).remove();
    if (this.displayB) game.Stores.GameStore.unsubscribeDisplayShelfBoxArrived(this.displayB);
    if (this.hideB) game.Stores.GameStore.unsubscribeHideShelfBoxArrived(this.hideB);
  }
});
