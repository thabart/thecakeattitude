var WarperModal = function() {};
WarperModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('warperModalTitle'),
      selectCategory = $.i18n('selectCategory'),
      selectSubCategory = $.i18n('selectSubCategory'),
      selectMap = $.i18n('selectMap'),
      ok = $.i18n('ok');
    self.create("<div class='modal modal-lg warper-modal' style='display:none;'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='container'>"+
            "<div class='sk-cube-grid category-loader'>"+
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
            "<div class='content'>"+
              "<form class='first-column'>"+
                "<label>"+selectCategory+"</label>"+
                "<select size='4' class='selector category-selector'>"+
                "</select>"+
              "</form>"+
              "<div class='second-column'>"+
                "<div class='sk-cube-grid sub-category-loader'>"+
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
                "<div class='sub-categories-content'>"+
                  "<label>"+selectSubCategory+"</label>"+
                  "<select size='10' class='sub-category-selector selector selector-lg'>"+
                  "</select>"+
                "</div>"+
              "</div>"+
              "<div class='map-row'>"+
                "<label>"+selectMap+"</label>"+
              "</div>"+
            "</div>"+
          "</div>"+
          "<div class='footer'>"+
            "<button class='action-btn confirm'>"+ok+"</button>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    var subCategorySelector = $(self.modal).find('.sub-category-selector'),
      confirmButton = $(self.modal).find('.confirm');
    $(self.modal).find('.category-selector').change(function() {
      $(confirmButton).prop('disabled', true);
      var categoryId = $(this).find(':selected').val();
      if (!categoryId) {
        $(subCategorySelector).empty();
        return;
      }

      self.isSubCategoryLoading(true);
      CategoryClient.getCategory(categoryId).then(function(cat) {
        var subCategories = cat._embedded.children.map(function(c) { return "<option value='"+c.id+"'>"+c.name+"</option>"; });
        $(subCategorySelector).empty();
        subCategories.forEach(function(category) { subCategorySelector.append(category); });
        self.isSubCategoryLoading(false);
      });
    });
    subCategorySelector.change(function() {
      $(confirmButton).prop('disabled', false);

    });
  },
  show() {
    var self = this,
      selector = $(self.modal).find('.category-selector'),
      subCategorySelector = $(self.modal).find('.sub-category-selector');
    subCategorySelector.empty();
    selector.empty();
    self.isCategoryLoading(true);
    $(self.modal).find('.confirm').prop('disabled', true);
    $(self.modal).show();
    CategoryClient.getCategoryParents().then(function(r) {
      var categories = r._embedded.map(function(c) { return "<option value='"+c.id+"'>"+c.name+"</option>"; });
      selector.append("<option></option>");
      categories.forEach(function(category) { selector.append(category); });
      self.isCategoryLoading(false);
      self.isSubCategoryLoading(false);
    });
  },
  isCategoryLoading(b) {
    var loader = $(this.modal).find('.category-loader'),
      content = $(this.modal).find('.content');
    if (b) {
      loader.show();
      content.hide();
      return;
    }

    loader.hide();
    content.show();
  },
  isSubCategoryLoading(b) {
    var loader = $(this.modal).find('.sub-category-loader'),
      content = $(this.modal).find('.sub-categories-content');
    if (b) {
      loader.show();
      content.hide();
      return;
    }

    loader.hide();
    content.show();
  }
});
