game.Menu = game.Menu || {};
game.Menu.ProductBox = me.Object.extend({
  init: function() {
    var self = this;
    self.productBox =  $("<div class='modal blue lg product-box'>"+
      "<div class='container'>"+
        "<div class='content'>"+
          "<div class='top'>"+
            "<span data-i18n='product_title'></span> <div class='close'></div>"+
          "</div>"+
          "<div class='body'>"+
            "<div class='loader' data-i18n='loader' style='display: none;'></div>"+
            "<div class='content'>"+
              "<div class='col-6'></div>"+
              "<div class='col-3 offset-2'></div>"+
            "</div>"+
          "</div>"+
          "<div class='bottom'></div>"+
        "</div>"+
      "</div>"+
    "</div>");
    self.addListeners();
    $(document.body).append(self.productBox);
    $(self.productBox).hide();
    $(self.productBox).i18n();
    $(self.productBox).draggable({ "handle": ".container > .content > .top" });
    self.refreshB = self.refresh.bind(self);
    self.hideB = self.hide.bind(self);
    game.Stores.GameStore.listenDisplayProduct(self.refreshB);
    game.Stores.GameStore.listenHideProduct(self.hideB);
  },
  refresh: function(e, productId) {
    var self = this;
    $(self.productBox).show();
    self.displayLoading(true);
    var firstColumn = $(self.productBox).find('.content > .body > .content > .col-6');
    var secondColumn = $(self.productBox).find('.content > .body > .content > .col-3');
    $(firstColumn).empty();
    $(secondColumn).empty();
    game.Services.ProductsService.get(productId).then(function(result) {
      var product = result['_embedded'];
      var image = "/img/icons/default-product.png";
      if (product['images'] || product['images'].length > 0) {
        image = product['images'][0];
      }

      var leftGrayPanel = $("<div class='gray-panel'>"+
        "<div class='top'></div>"+
        "<div class='body'>"+
          "<h3>"+product.name+"</h3>"+
          "<p>"+product.description+"</p>"+
          "<img src='"+image+"' width='50' />"+
        "</div>"+
        "<div class='bottom'></div>"+
      "</div>");
      var rightGrayPanel = $("<div class='gray-panel'>"+
        "<div class='top'></div>"+
        "<div class='body'>"+
          "<h3>€ "+product.price+"</h3>"+
        "</div>"+
        "<div class='bottom'></div>"+
      "</div>");
      $(firstColumn).append(leftGrayPanel);
      $(secondColumn).append(rightGrayPanel);
      self.displayLoading(false);
    }).catch(function(e) {
      self.displayLoading(false);
    });
  },
  hide: function() {
    $(this.productBox).hide();
  },
  displayLoading: function(b) {
    if (b) {
      $(this.productBox).find('.body > .content').hide();
      $(this.productBox).find('.loader').show();
    } else {
      $(this.productBox).find('.body > .content').show();
      $(this.productBox).find('.loader').hide();
    }
  },
  addListeners: function() {
    var self = this;
    $(self.productBox).find('.close').click(function() {
      self.hide();
    });
  },
  destroy: function() {
    if (this.productBox) $(this.productBox).remove();
    if (this.refreshB) game.Stores.GameStore.unsubscribeDisplayProduct(this.refreshB);
    if (this.hideB) game.Stores.GameStore.unsubscribeHideProduct(this.hideB);
  }
});
