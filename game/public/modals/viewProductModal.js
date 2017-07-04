'use strict';
var ViewProductModal = function() {};
ViewProductModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('viewProductModalTitle'),
      error = $.i18n('error'),
      buy = $.i18n('buy'),
      description = $.i18n('description'),
      characteristics = $.i18n('characteristics'),
      tags = $.i18n('tags');
    self.comment = new Comment();
    self.create("<div class='modal modal-lg md-effect-2 view-product-modal'>"+
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
                "<h3 class='product-name'></h3>"+
                "<div class='rating-container'></div>"+
              "</div>"+
              "<div>"+
                "<div class='col-8'>"+
                  "<div class='col-4'>"+
                    "<ul class='list-images'></ul>"+
                  "</div>"+
                  "<div class='col-8 big-image-container'></div>"+
                "</div>"+
                "<div class='col-4'>"+
                  "<button class='action-btn buy-product'>"+buy+"</button>"+
                "</div>"+
              "</div>"+
              "<div class='section section-with-border'>"+
                "<div class='col-4'>"+description+"</div>"+
                "<div class='col-8 product-description'>"+description+"</div>"+
              "</div>"+
              "<div class='section section-with-border'>"+
                "<div class='col-4'>"+characteristics+"</div>"+
                "<div class='col-8 product-characteristics'></div>"+
              "</div>"+
              "<div class='section'>"+
                "<div class='col-4'>"+tags+"</div>"+
                "<div class='col-8 product-tags'></div>"+
              "</div>"+
            "</div>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(self.modal).find('.buy-product').click(function() {
      // TODO : Add the product into the CART.
    });
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
  reset: function() {
    var self = this;
    $(self.modal).find('.product-name').empty();
    $(self.modal).find('.product-description').empty();
    $(self.modal).find('.product-characteristics').empty();
    $(self.modal).find('.list-images').empty();
    $(self.modal).find('.big-image-container').empty();
    $(self.modal).find('.rating-container').empty();
    $(self.modal).find('.product-tags').empty();
  },
  show: function(productId) {
    var self = this;
    self.toggle();
    self.reset();
    self.displayLoader(true);
    $(self.modal).find('.rating-container').append(self.comment.render());
    $.when(ProductClient.get(productId), ProductClient.searchComments(productId, {})).then(function(productObj, commentsObj) {
      self.displayLoader(false);
      var product = productObj['_embedded'];
      $(self.modal).find('.product-name').html(product.name);
      $(self.modal).find('.product-description').html(product.description);
      if (product.images) {
        var indice = 0;
        product.images.forEach(function(image) {
          var cl = indice === 0 ? 'active' : '';
          var img = $("<li class='"+cl+"'><img src='"+image+"' /></li>");
          $(self.modal).find('.list-images').append(img);
          $(img).click(function() {
            $(self.modal).find('.list-images li').removeClass('active');
            $(this).addClass('active');
            $(self.modal).find('.big-image-container').html("<img src='"+image+"' />");
          });
          if (indice === 0) {
            $(self.modal).find('.big-image-container').html("<img src='"+image+"' />");
          }

          indice++;
        });
      }

      if (product.filters && product.filters.length > 0) { // Display characteristics
        var dic = [];
        product.filters.forEach(function(filter) {
          var rec = dic.filter(function(kvp) { return kvp.name === filter.name });
          if (!rec || rec.length !== 1) {
            dic.push({ name: filter.name, values: [filter.content] });
          } else {
            rec[0].values.push(filter.content);
          }
        });

        var characteristics = $("<table><tbody></tbody></table>");
        dic.forEach(function(kvp) {
          var line = $("<div></div>");
          var firstColumn = $("<div class='col-3'></div>");
          var secondColumn = $("<div class='col-9'></div>");
          var lst = $("<ul class='characteristics-values'></ul>");
          kvp.values.forEach(function(val) {
            lst.append("<li><i>"+val+"</i></li>");
          });

          firstColumn.html("<b>"+kvp.name+"</b>");
          secondColumn.append(lst);
          line.append(firstColumn);
          line.append(secondColumn);
          $(self.modal).find('.product-characteristics').append(line);
        });
      }
      else {
        $(self.modal).find('.product-characteristics').html($.i18n('noFilters'));
      }

      if (product.tags && product.tags.length > 0) { // Display tags.
        var lst = $("<ul class='tags'></ul>");
        product.tags.forEach(function(tag) {
          lst.append("<li><i>"+tag+"</i></li>")
        });
        $(self.modal).find('.product-tags').append(lst);
      } else {
        $(self.modal).find('.product-tags').html($.i18n('noTags'));
      }

      self.comment.display(product.average_score, commentsObj); // Display comments.
    }).fail(function() {
      self.displayLoader(false);
      self.displayError($.i18n('error-viewProduct'));
    });
  }
});
