'use strict';
var ViewProductModal = function() {};
ViewProductModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('viewProductModalTitle'),
      error = $.i18n('error');
    self.create("<div class='modal modal-lg md-effect-2' id='map-modal'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='content'>"+
            "<div class='sk-cube-grid view-product-loader'>"+
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
            "<div class='product-container'>"+
              "<div>"+
                "<h3>Product name</h3>"+
              "</div>"+
              "<div>"+
                "<div class='col-8'>"+
                  "<div class='col-4'>"+
                    "<ul style='padding: 0; margin: 0; list-style-type: none; overflow-y: auto; max-height: 250px;'>"+
                      "<li><img src='/styles/images/default-product.png' style='width: 50px;' /></li>"+
                      "<li><img src='/styles/images/default-product.png' style='width: 50px;' /></li>"+
                      "<li><img src='/styles/images/default-product.png' style='width: 50px;' /></li>"+
                      "<li><img src='/styles/images/default-product.png' style='width: 50px;' /></li>"+
                      "<li><img src='/styles/images/default-product.png' style='width: 50px;' /></li>"+
                      "<li><img src='/styles/images/default-product.png' style='width: 50px;' /></li>"+
                      "<li><img src='/styles/images/default-product.png' style='width: 50px;' /></li>"+
                    "</ul>"+
                  "</div>"+
                  "<div class='col-8'>"+
                    "<img src='/styles/images/default-product.png' style='width: 200px;' />"+
                  "</div>"+
                "</div>"+
                "<div class='col-4'>"+
                  "<button class='action-btn'>Buy</button>"+
                "</div>"+
              "</div>"+
              "<table>"+
                "<tbody>"+
                  "<tr>"+
                    "<td>Description</td>"+
                    "<td>Description Description Description Description</td>"+
                  "</tr>"+
                  "<tr>"+
                    "<td>Filters</td>"+
                    "<td>Colors : red</td>"+
                  "</tr>"+
                "</tbody>"+
              "</table>"+
            "</div>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
  },
  displayLoader: function(b) { // Display loader.
    var self = this;
    var loader = $(self.modal).find('.view-product-loader'),
      content = $(self.modal).find('.product-container');
    if (b) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
  hideError: function() { // Hide the error.
    $(this.modal).find('.alert-error').hide();
  },
  displayError: function(message) { // Display the error.
    var errorElt = $(this.modal).find('.alert-error');
    errorElt.find('.message').html(message);
    errorElt.show();
  },
  show: function(productId) {
    var self = this;
    self.toggle();
    self.displayLoader(true);
    ProductClient.get(productId).then(function(obj) {
      self.displayLoader(false);
      console.log(obj);
    }).fail(function() {
      self.displayLoader(false);
      self.displayError($.i18n('error-viewProduct'));
    });
  }
});
