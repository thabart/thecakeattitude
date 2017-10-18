game.UpRightOptions = me.Object.extend({
  init: function() {
      this.options = $("<div class='up_right'>"+
        "<div class='options'>"+
          "<span class='help' data-i18n='help'></span>"+
          "<span class='quit'></span>"+
          "<span class='settings'></span>"+
        "</div>"+
        "<div class='sub-options settings-modal' style='display: none;'>"+
          "<div class='top'>"+
          "</div>"+
          "<div class='body'>"+
            "<span data-i18n='parameters' class='parameters'></span>"+
          "</div>"+
          "<div class='footer'>"+
          "</div>"+
        "</div>"+
      "</div>");
      this.parametersModal = new game.ParametersModal();
      $(document.body).append(this.options);
      this.addListeners();
      $(this.options).i18n();
  },
  addListeners: function() {
    var self = this;
    $(this.options).find('.settings').click(function() {
      $(self.options).find('.settings-modal').toggle();
    });
    $(this.options).find('.parameters').click(function() {
      self.parametersModal.toggle();
    });
  }
});
