'use strict';
var AddOfferModalDescriptionTab = function() { };
AddOfferModalDescriptionTab.prototype = {
  render: function() {
    var next = $.i18n('next'),
      name = $.i18n('name'),
      price = $.i18n('price'),
      description = $.i18n('description'),
      addOfferModalDescription = $.i18n('addOfferModalDescription'),
      self = this;
    self.selectCategory = new SelectCategory();
    self.tab = $("<form>"+
      "<div class='container'>"+
        "<div class='content'>"+
          "<p>"+addOfferModalDescription+"</p>"+
          "<div>"+
            "<label>"+name+"</label>"+
            "<span class='error-message'></span>"+
            "<input type='text' name='name' class='input-control' required />"+
          "</div>"+
          "<div>"+
            "<label>"+description+"</label>"+
            "<span class='error-message'></span>"+
            "<textarea name='description' class='input-control' required />"+
          "</div>"+
          "<div class='select-category-container'></div>"+
          "<div>"+
            "<label>"+price+"</label>"+
            "<span class='error-message'></span>"+
            "<input type='number' name='price' class='input-control' required />"+
          "</div>"+
        "</div>"+
      "</div>"+
      "<div class='footer'>"+
          "<button class='action-btn next'>"+next+"</button>"+
      "</div>"+
    "<//form>");
    self.tab.validate({
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
        price: {
          required: true,
          min: 0
        }
      },
      errorPlacement: function(error, elt) {
        error.appendTo(elt.prev());
      }
    });
    $(self.tab).submit(function(e) {
      e.preventDefault();
      var categoryId = self.selectCategory.getSelectedSubCategoryId();
      self.tab.form();
      var isCategoryValid = true;
      if (!categoryId || categoryId === null) {
        $(self).trigger('error', [ { msg: $.i18n('error-categoryMustBeSelected') }]);
        isCategoryValid = false;
      }

      if (!self.tab.valid() || !isCategoryValid) {
        return;
      }

      var name = $(self.tab).find("input[name='name']").val(),
        description = $(self.tab).find("textarea[name='description']").val(),
        price = $(self.tab).find("input[name='price']").val();
      var json = {
        name: name,
        description: description,
        price: price,
        category_id: categoryId
      };
      $(self).trigger('next', [ { data: json }]);
    });
    $(self.tab).find('.select-category-container').append(self.selectCategory.render({isMapEnabled: false}));
    return self.tab;
  },
  reset: function() { // Reset the description tab.
    var self = this;
    $(self.tab).find("input[name='name']").val(''),
    $(self.tab).find("textarea[name='description']").val(''),
    $(self.tab).find("input[name='price']").val('');
    self.selectCategory.init();
  }
};
