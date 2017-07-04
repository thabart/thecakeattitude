var InformerModal = function() { };
InformerModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('informerModalTitle'),
      error = $.i18n('error'),
      comments = $.i18n('comments'),
      description = $.i18n('description'),
      acceptedPaymentMethods = $.i18n('acceptedPaymentMethods'),
      contactInformation = $.i18n('contactInformation'),
      owner = $.i18n('owner');
    self.paymentMethods = {
      "Cash": {
        "label": $.i18n('cash'),
        "icon": "<i class='fa fa-money' aria-hidden='true'></i>"
      },
      "BankTransfer":{
        "label": $.i18n('bankTransfer'),
        "icon": "<i class='fa fa-credit-card' aria-hidden='true'></i>"
      },
      "PayPal": {
        "label": $.i18n('paypal'),
        "icon": "<i class='fa fa-paypal' aria-hidden='true'></i>"
      }
    };
    self.comment = new Comment();
    self.create("<div class='modal modal-lg md-effect-1 informer-modal'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='container'>"+
            "<div class='sk-cube-grid informer-loader'>"+
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
            "<div class='content'>"+
              "<div>"+
                "<div class='col-3 textCenter'>"+
                  "<img src='/styles/images/default-store.png' class='shop-profile' />"+
                "</div>"+
                "<div class='col-9'>"+
                  "<h3 class='shop-name'></h3>"+
                  "<div class='rating-container'></div>"+
                "</div>"+
              "</div>"+
              "<table class='info-table'>"+
                "<tbody>"+
                  "<tr>"+
                    "<td class='key'>"+owner+"</td>"+
                    "<td class='value pseudo'></td>"+
                  "</tr>"+
                  "<tr>"+
                    "<td class='key'>"+description+"</td>"+
                    "<td class='value description'></td>"+
                  "</tr>"+
                  "<tr>"+
                    "<td class='key'>"+acceptedPaymentMethods+"</td>"+
                    "<td class='value payment-methods'></td>"+
                  "</tr>"+
                  "<tr>"+
                    "<td class='key'>"+contactInformation+"</td>"+
                    "<td class='value contact-information'>"+
                      "<div>"+
                        "<div><i class='fa fa-envelope' aria-hidden='true'></i></div>"+
                        "<div class='email'></div>"+
                      "</div>"+
                      "<div>"+
                        "<div><i class='fa fa-phone' aria-hidden='true'></i></div>"+
                        "<div class='home-phone'></div>"+
                      "</div>"+
                      "<div>"+
                        "<div><i class='fa fa-mobile' aria-hidden='true'></i></div>"+
                        "<div class='mobile-phone'></div>"+
                      "</div>"+
                      "<div>"+
                        "<div><i class='fa fa-map-marker' aria-hidden='true'></i></div>"+
                        "<div class='address'></div>"+
                      "</div>"+
                    "</td>"+
                  "</tr>"+
                "</tbody>"+
              "</table>"+
            "</div>"+
          "</div>"+
        "</div>"+
    "</div>");
  },
  reset: function() { // Reset all the fields.
    var self = this;
    $(self.modal).find('.shop-profile').attr('src', '/styles/images/default-store.png');
    $(self.modal).find('.shop-name').empty();
    $(self.modal).find('.rating-container').empty();
    $(self.modal).find('.pseudo').empty();
    $(self.modal).find('.description').empty();
    $(self.modal).find('.payment-methods').empty();
    $(self.modal).find('.email').empty();
    $(self.modal).find('.home-phone').empty();
    $(self.modal).find('.mobile-phone').empty();
    $(self.modal).find('.address').empty();
  },
  show: function(shopId) { // Show the modal window.
    var self = this;
    self.reset();
    $(self.modal).toggleClass('md-show');
    $(self.modal).find('.rating-container').append(self.comment.render());
    self.displayLoader(true);
    $.when(ShopClient.searchComments(shopId, {}), ShopClient.getShop(shopId)).then(function(commentsObj, shopObj) {
      var shop = shopObj._embedded;
      UserClient.getPublicClaims(shop.subject).then(function(userObj) {
        self.displayLoader(false);
        self.hideError();
        var shop = shopObj._embedded;
        var shopProfileImg = shop.profile_image || '/styles/images/default-store.png';
        $(self.modal).find('.shop-profile').attr('src', shopProfileImg);
        $(self.modal).find('.shop-name').html(shop.name);
        $(self.modal).find('.pseudo').html(userObj.name);
        $(self.modal).find('.description').html(shop.description);
        $(self.modal).find('.email').html(userObj.email);
        $(self.modal).find('.home-phone').html(userObj.home_phone_number);
        $(self.modal).find('.mobile-phone').html(userObj.mobile_phone_number);
        var fullAdr = shop.street_address +", " + shop.postal_code + ", " + shop.locality;
        $(self.modal).find('.address').html(fullAdr);
        if (shop.payments) {
          shop.payments.forEach(function(payment) {
            var record = self.paymentMethods[payment.method];
            $(self.modal).find('.payment-methods').append("<div>"+
              "<div>"+record.icon+"</div>"+
              "<div>"+record.label+"</div>"+
            "</div>");
          });
        }

        self.comment.display(shop.average_score, commentsObj);
      }).fail(function() {
        self.displayLoader(false);
        self.displayError($.i18n('error-getUserInformation'));
      });
    }).fail(function() {
      self.displayLoader(false);
      self.displayError($.i18n('error-getShopInformation'));
    });
  },
  displayLoader: function(b) { // Hide / Display the loader.
    var self = this;
    var loader = $(self.modal).find('.informer-loader'),
      content = $(self.modal).find('.content');
    if (b) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
  hideError: function() { // Hide error message.
    $(this.modal).find('.alert-error').hide();
  },
  displayError: function(message) { // Display error message.
    var errorElt = $(this.modal).find('.alert-error');
    errorElt.find('.message').html(message);
    errorElt.show();
  }
});
