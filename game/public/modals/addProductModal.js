var AddProductModal = function() {};
AddProductModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('addProduct'),
      description = $.i18n('description'),
      characteristics = $.i18n('characteristics'),
      error = $.i18n('error');
    self.descriptionTab = new AddProductDescriptionTab();
    self.characteristicsTab = new AddProductCharacteristicTab();
    self.create("<div class='modal modal-lg md-effect-1 add-product-modal'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<ul class='progressbar'>"+
            "<li class='col-3'>"+description+"</li>"+
            "<li class='col-3'>"+characteristics+"</li>"+
          "</ul>"+
          "<div class='sk-cube-grid add-product-loader'>"+
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
          "<div class='tab-content'>"+
            "<div class='tab0'></div>"+
            "<div class='tab1'></div>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    self.showTab(0);
    self.displayLoader(false);
    $(self.modal).find('.tab0').append(self.descriptionTab.render());
    $(self.modal).find('.tab1').append(self.characteristicsTab.render());
    $(self.descriptionTab).on('next', function(e, data) {
      self.json = data.obj;
      self.showTab(1);
    });
    $(self.characteristicsTab).on('previous', function(e) {
      self.showTab(0);
    });
    $(self.characteristicsTab).on('confirm', function(e, data) {
      self.json['filters'] = data.obj;
      self.displayLoader(true);
      var accessToken = sessionStorage.getItem(Constants.sessionName);
      self.commonId = Guid.generate();
      ProductClient.add(accessToken, self.json, self.commonId).then(function() {
        self.displayLoader(false);
      }).fail(function() {
        self.displayLoader(false);
        self.displayError($.i18n('error-addProduct'));
      });
    });

    self.descriptionTab.display();
    AppDispatcher.register(function(obj) {
      if (obj.actionName === 'add-product' && obj.data.common_id === self.commonId) {
        self.toggle();
      }
    });
  },
  displayLoader: function(b) { // Display loader.
    var self = this;
    var loader = $(self.modal).find('.add-product-loader'),
      tabContent = $(self.modal).find('.tab-content');
    if (b) {
      loader.show();
      tabContent.hide();
    } else {
      loader.hide();
      tabContent.show();
    }
  },
  showTab: function(indice) { // Show tab.
    var self = this;
    var progressBarLi = $(self.modal).find('.progressbar li');
    for (var i = 0; i <= 3; i++) {
      var li = progressBarLi.get(i),
        tab = $(self.modal).find('.tab'+i);
      if (i <= indice) {
        $(li).addClass('active');
      } else {
        $(li).removeClass('active');
      }

      if (i === indice) {
        $(tab).show();
      } else {
        $(tab).hide();
      }
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
    self.descriptionTab.display();
    self.characteristicsTab.display();
  },
  show: function() { // Show the modal.
    var self = this;
    self.reset();
    self.showTab(0);
    self.toggle();
  },
  remove: function() { // Remove the modal.
    var self = this;
    AppDispatcher.remove();
    $(self.modal).remove();
  }
});
