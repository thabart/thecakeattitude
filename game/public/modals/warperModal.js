var WarperModal = function() {};
WarperModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('warperModalTitle'),
      selectCategory = $.i18n('selectCategory');
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
            "<div class='sk-cube-grid loader'>"+
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
              "<form class='search-category-form'>"+
                "<label>"+selectCategory+"</label>"+
                "<select size='4' class='selector'>"+
                "</select>"+
              "</form>"+
              "<div class='map-selector'>"+
                "azeio"+
              "</div>"+
            "</div>"+
          "</div>"+
          "<div class='footer'>"+
            "<button class='action-btn'>Ok</button>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
  },
  show() {
    var self = this,
      selector = $(self.modal).find('.selector');
    $(self.modal).show();
    self.isLoading(true);
    CategoryClient.getCategoryParents().then(function(r) {
      selector.empty();
      var categories = r._embedded.map(function(c) { return "<option value='"+c.id+"'>"+c.name+"</option>"; });
      categories.forEach(function(category) { selector.append(category); });
      self.isLoading(false);
    });
  },
  isLoading(b) {
    var loader = $(this.modal).find('.loader'),
      content = $(this.modal).find('.content');
    if (b) {
      loader.show();
      content.hide();
      return;
    }

    loader.hide();
    content.show();
  }
});
