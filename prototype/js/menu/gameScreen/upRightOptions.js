game.Menu = game.Menu || {};
game.Menu.UpRightOptions = me.Object.extend({
  init: function() {
      this.options = $("<div class='up_right'>"+
        "<div class='options'>"+
          "<span class='help' data-i18n='help'></span>"+
          "<span class='quit'></span>"+
          "<span class='settings'></span>"+
        "</div>"+
        "<div class='heavygray-panel settings-modal' style='display: none;'>"+
          "<div class='top'>"+
          "</div>"+
          "<div class='body'>"+
            "<span data-i18n='parameters' class='parameters'></span>"+
          "</div>"+
          "<div class='bottom'>"+
          "</div>"+
        "</div>"+
      "</div>");
      this.parametersModal = new game.Menu.ParametersModal();
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
    $(this.options).find('.quit').click(function() {
        sessionStorage.removeItem(Constants.sessionName);
        me.state.change(me.state.MENU);
    });
  },
  destroy: function() {
      if (this.options) $(this.options).remove();
  }
});
